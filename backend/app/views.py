from rest_framework import viewsets
from .serializer import *
from pages.models import *
from paypal_payment.models import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.contrib import auth
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from datetime import datetime
from django.contrib.sites.shortcuts import get_current_site
from django.template.loader import get_template
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.core.mail import EmailMultiAlternatives
from pages.tokens import account_activation_token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from django.contrib.auth import update_session_auth_hash
import random
from django.db.models import Sum, Case, Value, When, Q, Exists, OuterRef
from django.db.models.functions import Coalesce
from utils.push_notifications import send_push_notifications
from paypal_payment.views import add_donation
from utils.mail import send_mail, get_mail_connection
import re
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
from django.template.loader import render_to_string
from copy import deepcopy


class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminUser]
    queryset = User.objects.all()
    serializer_class = UserSerializer

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventModelSerializer

class LatestEventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all().order_by('-id')[:1]
    serializer_class = EventModelSerializer

class PictureViewSet(viewsets.ModelViewSet):
    queryset = FischPicture.objects.all().order_by('-id')
    serializer_class = PictureModelSerializer

class LatestPictureViewSet(viewsets.ModelViewSet):
    queryset = FischPicture.objects.order_by('-id')[:1]
    serializer_class = PictureModelSerializer

class SponsorViewSet(viewsets.ModelViewSet):
    queryset = Sponsor.objects.filter(sponsor_score__gt=0).order_by('-sponsor_score')
    serializer_class = SponsorModelSerializer

class SponsorUserViewSet(viewsets.ModelViewSet):
    serializer_class = SponsorModelSerializer
    queryset = Sponsor.objects.all()

    def get_queryset(self):
        profile = Profile.objects.get(user_id=self.request.user.id)
        return Sponsor.objects.filter(id=profile.sponsor_id)

class HighscoreViewSet(viewsets.ModelViewSet):
    queryset = Highscore.objects.all()
    serializer_class = HighscoreModelSerializer

class SeasonViewSet(viewsets.ModelViewSet):
    queryset = Season.objects.order_by('-id')[:1]
    serializer_class = SeasonModelSerializer

class SeasonItemViewSet(viewsets.ModelViewSet):
    season = Season.objects.last()
    queryset = SeasonItem.objects.filter(season_id=season.id)
    serializer_class = SeasonItemModelSerializer

class DonationViewSet(viewsets.ModelViewSet):
    queryset = Donation.objects.all().order_by('-id')
    serializer_class = DonationModelSerializer

class PromoViewSet(viewsets.ModelViewSet):
    queryset = Promo.objects.all().order_by('-id')
    serializer_class = PromoModelSerializer

class SignupView(APIView):
    permission_classes = (permissions.AllowAny, )

    def post(self, request, format=None):
        data = self.request.data

        username = data['username']
        password = data['password']
        re_password = data['re_password']
        first_name = data['first_name']
        last_name = data['last_name']
        email = data['email']

        try:
            if password == re_password:
                if User.objects.filter(username=username).exists():
                    return Response({ 'error': 'Username already exists' })
                else:
                    if len(password) < 6:
                        return Response({ 'error': 'Password must be at least 6 characters' })
                    else:
                        user = User.objects.create_user(username=username,
                                                        password=password,
                                                        email=email,
                                                        first_name=first_name,
                                                        last_name=last_name)
                        user.refresh_from_db()
                        user.profile.first_name = first_name
                        user.profile.last_name = last_name
                        user.profile.email = email
                        user.is_active = False
                        user.save()

                        token = ExpoToken.objects.create()
                        profile = Profile.objects.get(first_name=first_name,
                                                      last_name=last_name)
                        profile.expo_token = token
                        profile.save()

                        current_site = get_current_site(request)
                        subject = 'Please Activate Your Account'

                        txt_template = get_template('mails/activation_request.txt')
                        html_template = get_template('mails/activation_request.html')

                        context = {'title': 'Please Activate Your Account!',
                                   'message': ['Please click the following link to confirm your registration:'],
                                   'bye': 'Fisch',
                                   'user': user,
                                   'domain': current_site.domain + '/app',
                                   'uid': urlsafe_base64_encode(force_bytes(user.pk)),
                                   'token': account_activation_token.make_token(user),
                                   }

                        text_content = txt_template.render(context)
                        html_content = html_template.render(context)
                        with get_mail_connection(from_mail='no-reply@wodkafis.ch',
                                                 password='Hoeh!en1urch') as connection:
                            msg = EmailMultiAlternatives(subject,
                                                         text_content,
                                                         'no-reply@wodkafis.ch',
                                                         [user.profile.email],
                                                         connection=connection)
                            msg.attach_alternative(html_content, "text/html")
                            msg.send()

                        return Response({ 'success': 'User created successfully' })
            else:
                return Response({ 'error': 'Passwords do not match' })
        except:
                return Response({ 'error': 'Something went wrong when registering the account' })

@api_view(['POST'])
@permission_classes([AllowAny])
def activate_account(request, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None

    # checking if the user exists, if the token is valid.
    if user is not None and account_activation_token.check_token(user, token):
        if not user.is_active:
            user.is_active = False
            user.save()

            # send approval request to admin
            message = render_to_string('user/user_approval_request.html', {
                'user': user,
                'domain': get_current_site(request).domain,
                'uid': urlsafe_base64_encode(force_bytes(user.pk)),
                # generate a hash value with user related data
                'token': account_activation_token.make_token(user),
            })

            send_mail(from_mail='no-reply@wodkafis.ch',
                      password='Hoeh!en1urch',
                      subject='User Sign Up Request Approval',
                      body=message,
                      to=['contact@wodkafis.ch'])

        return Response({ 'success': 'Account activated successfully' })
    else:
        return Response({ 'error': 'Something went wrong when activating the account' })


@api_view(['POST'])
@permission_classes([AllowAny])
def approve_user(request, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None
    if user is not None and account_activation_token.check_token(user, token):
        user.is_active = True
        user.profile.signup_confirmation = True
        user.save()

        txt_template = get_template('mails/general_template.txt')
        html_template = get_template('mails/general_template.html')
        context = {'title': "Sign Up Completed!",
                   'hello': 'Hi',
                   'message': ['your account is now active.',
                               'Please use the following link to log in:',
                               'https://wodkafis.ch/login'],
                   'bye': 'Fisch',
                   'user': user,
                   }
        subject, from_email, to = 'Sign Up Completed', 'no-reply@wodkafis.ch', [user.profile.email]
        text_content = txt_template.render(context)
        html_content = html_template.render(context)
        with get_mail_connection(from_mail='no-reply@wodkafis.ch',
                                 password='Hoeh!en1urch') as connection:
            msg = EmailMultiAlternatives(subject,
                                         text_content,
                                         from_email,
                                         to,
                                         connection=connection)
            msg.attach_alternative(html_content, "text/html")
            msg.send()

        return Response({'success': 'Account approved successfully'})
    else:
        return Response({'error': 'Something went wrong when approving the account'})

class LogoutView(APIView):
    def post(self, request):
        try:
            auth.logout(request)
            return Response({ 'success': 'Loggout Out' })
        except:
            return Response({ 'error': 'Something went wrong when logging out' })
class CheckAuthenticatedView(APIView):
    def get(self, request):

        try:
            user = request.user
            isAuthenticated = user.is_authenticated

            if isAuthenticated:
                return Response({ 'isAuthenticated': 'success' })
            else:
                return Response({ 'isAuthenticated': 'error' })
        except:
            return Response({ 'error': 'Something went wrong when checking authentication status' })
class LoginView(ObtainAuthToken):
    permission_classes = (permissions.AllowAny,)
    def post(self, request, *args, **kwargs):

        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        is_admin = User.objects.get(username=user).is_superuser
        return Response({
            'success': 'token generated',
            'token': token.key,
            'is_admin': is_admin
        })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    if request.method == 'POST':
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            if user.check_password(serializer.data.get('old_password')):
                new_password = serializer.data.get('new_password')
                if len(new_password) < 6:
                    return Response({'error': 'Password must be at least 6 characters'})
                user.set_password(new_password)
                user.save()
                update_session_auth_hash(request, user)  # To update session after password change
                return Response({'success': 'Password changed successfully.'}, status=status.HTTP_200_OK)
            return Response({'error': 'Incorrect old password.'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class HomeView(APIView):

    def get(self,request):
        profile = Profile.objects.get(user_id=request.user.id)
        sponsor = Sponsor.objects.filter(id=profile.sponsor_id)
        season = Season.objects.all().order_by('-id')[:1]
        season_items = SeasonItem.objects.filter(season_id=season[0].id)
        event = Event.objects.all().order_by('-id')[:1]
        pictures = FischPicture.objects.all()
        current_date = datetime.today()
        date_seed = int(current_date.strftime("%Y%m%d"))
        random.seed(date_seed)
        latest_picture = random.sample(list(pictures), 1)[0]
        picture_serializer = PictureModelSerializer(latest_picture)
        app_info = AppInfo.objects.last()
        app_info_serializer = AppInfoSerializer(app_info)
        return Response({
            'upcoming_event': event.values(),
            'sponsor': sponsor.values(),
            'season': season.values(),
            'season_items': season_items.values(),
            'picture': [picture_serializer.data],#picture.values()
            'app_update': app_info_serializer.data
        })

class MapView(APIView):
    def get(self,request):
        events = Event.objects.exclude(country__isnull=True)
        user = Profile.objects.get(user_id=request.user.id)
        pictures = FischPicture.objects.annotate(likes=Coalesce(Sum('like__like'), 0),
                                                user_like=Exists(FischPicture.objects.filter(
                                                    like__user_id=user.id,
                                                    like__picture_id=OuterRef('pk'),
                                                    like__like=1))).order_by('-id')
        return Response({
            'events': events.values('title','image','lat','long','country','start'),
            'pictures': pictures.values()
        })

class SponsorView(APIView):

    def get(self,request):
        profile = Profile.objects.get(user_id=request.user.id)
        sponsor_user = Sponsor.objects.get(id=profile.sponsor_id)
        sponsor_user_serializer = SponsorModelSerializer(deepcopy(sponsor_user))
        sponsors = Sponsor.objects.filter(sponsor_score__gt=0).order_by('-sponsor_score')
        sponsor_serializer = SponsorModelSerializer(sponsors,many=True)
        season = Season.objects.all().order_by('-id')[:1]
        season_items = SeasonItem.objects.filter(season_id=season[0].id)
        promo = Promo.objects.all().order_by('-id')[:1]
        donations = Donation.objects.all().order_by('-id')[:5]
        for i, item in enumerate(season_items):
            if sponsor_user.season_score >= item.price and sponsor_user.unlocked_items_animation < i + 1:
                sponsor_user.unlocked_items_animation += 1
                sponsor_user.save()

        return Response({
            'sponsor_user': [sponsor_user_serializer.data],
            'sponsor': sponsor_serializer.data,
            'season': season.values(),
            'season_items': season_items.values(),
            'promo': promo.values(),
            'donations': donations.values()
        })

class ImageUploadView(APIView):
    def post(self,request):
        try:
            FischPicture.objects.create(
                image=request.data['image'],
                description=request.data['description'],
                lat=request.data['lat'],
                long=request.data['long'],
                username=request.user,
                date=datetime.today().strftime("%d/%m/%Y"),
            )
            return Response({'success':'Image upload successful'})
        except:
            return Response({'error': 'something went wrong'})

class ImageEditView(APIView):
    def post(self,request):
        try:
            picture = FischPicture.objects.get(id=request.data['id'])
            picture.description=request.data['description']
            picture.lat=request.data['lat']
            picture.long=request.data['long']
            picture.save()
            return Response({'success':'Image edited successfully'})
        except:
            return Response({'error': 'something went wrong'})
class PictureLikeView(APIView):
    def post(self,request):
        user = Profile.objects.get(user_id=request.user.id)
        picture = FischPicture.objects.get(id=request.data['picture_id'])
        try:
            FischPictureLikes.objects.update_or_create(
                user=user,
                picture=picture,
                defaults=dict(
                like=request.data['like']))
            return Response({'success':'Like successful'})
        except:
            return Response({'error': 'something went wrong'})

class PictureView(APIView):
    def get(self,request):
        user = Profile.objects.get(user_id=request.user.id)
        picture = FischPicture.objects.annotate(likes=Coalesce(Sum('like__like'),0),
                                                user_like=Exists(FischPicture.objects.filter(
                                                    like__user_id=user.id,
                                                    like__picture_id = OuterRef('pk'),
                                                    like__like = 1))).order_by('-id')

        return Response({
            'pictures': picture.values()
        })

class ReportUser(APIView):

    def post(self,request):
        subject = 'Reported User / Content'
        message = f'Dear Admins,\n The user {request.data["user"]} has been reported by {request.user.username} for posting the picture with id {request.data["picture_id"]}.\n Please review the content and act accordingly.'
        send_mail(from_mail='no-reply@wodkafis.ch',
                  password='Hoeh!en1urch',
                  subject=subject,
                  body=message,
                  to=['reported_content@wodkafis.ch'])
        #send_mail(subject, message, 'reported_content@wodkafis.ch', ['reported_content@wodkafis.ch'])
        return Response({'success: User / Content has been reported'})

class PushNotificationTokenView(APIView):
    def post(self,request):
        try:
            profile = Profile.objects.get(user_id=request.user.id)
            token = ExpoToken.objects.get(id=profile.expo_token_id)
            token.token = request.data['token']
            token.save()
            return Response({'success':'Token saved successfully'})
        except:
            return Response({'error': 'something went wrong'})

class SendPushNotificationView(APIView):
    def post(self, request):
        try:
            tokens = ExpoToken.objects.all()
            send_push_notifications([token.token for token in tokens if token.token], request.data['title'], request.data['message'])
            return Response({'success': 'Push Notification sent'})
        except:
            return Response({'error': 'something went wrong'})

class NewSeasonView(APIView):
    permission_classes = [IsAdminUser]
    def post(self, request):
        try:
            season_serializer = SeasonModelSerializer(data=request.data)

            season_item_files = {key: value for key, value in request.FILES.items() if 'season_items' in key}
            season_items_data = []
            for key, value in season_item_files.items():
                season_item_data = {
                    'price': request.data[key.split('image')[0] + 'price]'],
                    'image': value
                }
                season_items_data.append(season_item_data)
            season_item_serializer = SeasonItemModelSerializer(data=season_items_data, many=True)
            if season_serializer.is_valid():
                if season_item_serializer.is_valid():

                    season = season_serializer.save()
                    season_item_serializer.save(season=season)

                    season_badge = SeasonBadge.objects.create(season_badge=season.image)
                    season_badge.save()

                    sponsors = Sponsor.objects.all()
                    sponsors.update(season_score=0, unlocked_items=0, unlocked_items_animation=0)

                    tokens = ExpoToken.objects.all()
                    send_push_notifications([token.token for token in tokens if token.token], 'New Fisch Season',
                                            'The ' + request.data['title'] + ' season has started!')

                    return Response({'success': 'new season created'})
                else:
                    print(season_item_serializer.errors)
                    return Response({'error': 'An error occured while creating the season items. Please try again.'})
            else:
                print(season_serializer.errors)
                return Response({'error': 'An error occured while creating the season instance. Please try again.'})
        except:
            return Response({'error': 'An error occured while creating a new season. Please try again.'})

class NewEventView(APIView):

    permission_classes = [IsAdminUser]
    def post(self, request):
        try:
            event_serializer = EventModelSerializer(data=request.data)
            if event_serializer.is_valid():
                event = event_serializer.save()

                # check if users have activated push notifications
                users_with_push_notifications = Profile.objects.exclude(expo_token__token='')
                expo_tokens = [user.expo_token.token for user in users_with_push_notifications]
                send_push_notifications(expo_tokens,
                                        'Next Fisch event announced',
                                        request.data['title'] + ' on ' + request.data['start'])

                # send a mail to users without push notifications instead
                users_without_push_notifications = Profile.objects.filter(expo_token__token='')
                mailing_list = list(users_without_push_notifications.values_list("email", flat=True))
                # include mailing list
                mailing_list.extend(re.findall(r'\"?([\w\.-]+@[\w\.-]+)\"?', request.data['mailing_list']))
                # remove duplicates
                mailing_list = list(set(mailing_list))

                txt_template = get_template('mails/event_template.txt')
                html_template = get_template('mails/event_template.html')
                context = {'title': request.data['title'],
                           'n': Event.objects.count() - 1,
                           'worldmap_image': event.worldmap_image,
                           'hello': request.data['hello'],
                           'message': request.data['message'],
                           'location': request.data['location'],
                           'additional_text': request.data['additional_text'],
                           'bye': request.data['bye'],
                           'image': event.image,
                           'time': datetime.strftime(datetime.strptime(request.data['start'], '%Y-%m-%d %H:%M:%S'), '%d. %b, %H:%M'),
                           }

                subject, from_email, bcc = 'Fisch Event', 'events@wodkafis.ch', mailing_list
                text_content = txt_template.render(context)
                html_content = html_template.render(context)

                with get_mail_connection(from_mail='events@wodkafis.ch',
                                         password='Hoeh!en1urch') as connection:
                    msg = EmailMultiAlternatives(subject,
                                                 text_content,
                                                 from_email,
                                                 bcc=bcc,
                                                 connection=connection)
                    msg.attach_alternative(html_content, "text/html")
                    msg.send()

                return Response({'success': 'new event created'})
            else:
                return Response({'error': 'something went wrong'})
        except:
            return Response({'error': 'something went wrong'})

class AddDonationView(APIView):

    permission_classes = [IsAdminUser]
    def post(self, request):

        try:
            first_name = request.data['first_name']
            last_name = request.data['last_name']
            donation = request.data['donation']
            fischflocken = add_donation(first_name,last_name,donation)

            profile = Profile.objects.get(first_name=first_name, last_name=last_name)
            notification_token = ExpoToken.objects.get(id=profile.expo_token_id).token

            if notification_token:
                send_push_notifications([notification_token],
                                        'Donation successful!',
                                        f'Check you season score: {fischflocken} Fischflocken donated.')
            else:
                user = User.objects.get(first_name=first_name, last_name=last_name)
                txt_template = get_template('mails/general_template.txt')
                html_template = get_template('mails/general_template.html')

                context = {'title': "Your donation was successful!",
                           'hello': 'Hi',
                           'message': ['You just made a Fisch donation!',
                                       'Please check your season score here:',
                                       'https://wodkafis.ch/sponsors'],
                           'bye': 'Fisch',
                           'user': user,
                           }

                subject, from_email, to = 'Donation Approval', 'spenden@wodkafis.ch', [user.email]
                text_content = txt_template.render(context)
                html_content = html_template.render(context)
                with get_mail_connection(from_mail='spenden@wodkafis.ch',
                                         password='Hoeh!en1urch') as connection:
                    msg = EmailMultiAlternatives(subject,
                                                 text_content,
                                                 from_email,
                                                 to,
                                                 connection=connection)
                    msg.attach_alternative(html_content, "text/html")
                    msg.send()

            return Response({'success': 'donation added successful'})
        except:
            return Response({'error': 'something went wrong'})

class AddAppRelease(APIView):
    permission_classes = [IsAdminUser]
    def post(self, request):
        try:
            AppInfo.objects.create(version=request.data['version'],
                                   update=request.data['update'])
            return Response({'success': 'App release successful'})
        except:
            return Response({'error': 'something went wrong'})