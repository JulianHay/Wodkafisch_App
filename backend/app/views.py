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
from django.core.mail import EmailMultiAlternatives, send_mail
from pages.tokens import account_activation_token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import update_session_auth_hash
import random
from django.db.models import Sum, Case, Value, When, Q, Exists, OuterRef
from django.db.models.functions import Coalesce
from utils.push_notifications import send_push_notifications

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

                        current_site = get_current_site(request)
                        subject = 'Please Activate Your Account'

                        txt_template = get_template('mails/activation_request.txt')
                        html_template = get_template('mails/activation_request.html')

                        context = {'title': 'Please Activate Your Account!',
                                   'message': ['Please click the following link to confirm your registration:'],
                                   'bye': 'Fisch',
                                   'user': user,
                                   'domain': current_site.domain,
                                   'uid': urlsafe_base64_encode(force_bytes(user.pk)),
                                   'token': account_activation_token.make_token(user),
                                   }

                        text_content = txt_template.render(context)
                        html_content = html_template.render(context)
                        msg = EmailMultiAlternatives(subject, text_content, 'no-reply@wodkafis.ch',
                                                     [user.profile.email])
                        msg.attach_alternative(html_content, "text/html")
                        msg.send()

                        return Response({ 'success': 'User created successfully' })
            else:
                return Response({ 'error': 'Passwords do not match' })
        except:
                return Response({ 'error': 'Something went wrong when registering the account' })

# class LoginView(APIView):
#     permission_classes = (permissions.AllowAny, )
#
#     def post(self, request):
#         data = self.request.data
#         username = data['username']
#         password = data['password']
#
#         try:
#             user = auth.authenticate(username=username, password=password)
#             if user is not None:
#                 auth.login(request, user)
#                 return Response({ 'success': 'User authenticated' })
#             else:
#                 return Response({ 'error': 'Error Authenticating' })
#         except:
#             return Response({ 'error': 'Something went wrong when logging in' })

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
        return Response({
            'success': 'token generated',
            'token': token.key,
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
        serializer = PictureModelSerializer(latest_picture)
        return Response({
            'upcoming_event': event.values(),
            'sponsor': sponsor.values(),
            'season': season.values(),
            'season_items': season_items.values(),
            'picture': [serializer.data]#picture.values()
        })

class MapView(APIView):
    def get(self,request):
        event = Event.objects.all()
        user = Profile.objects.get(user_id=request.user.id)
        picture = FischPicture.objects.annotate(likes=Coalesce(Sum('like__like'), 0),
                                                user_like=Exists(FischPicture.objects.filter(
                                                    like__user_id=user.id,
                                                    like__picture_id=OuterRef('pk'),
                                                    like__like=1))).order_by('-id')
        return Response({
            'events': event.values('title','image','lat','long','country','start'),
            'pictures': picture.values()
        })

class SponsorView(APIView):

    def get(self,request):
        profile = Profile.objects.get(user_id=request.user.id)
        sponsor_user = Sponsor.objects.filter(id=profile.sponsor_id)
        sponsors = Sponsor.objects.filter(sponsor_score__gt=0).order_by('-sponsor_score')
        season = Season.objects.all().order_by('-id')[:1]
        season_items = SeasonItem.objects.filter(season_id=season[0].id)
        promo = Promo.objects.all().order_by('-id')[:1]
        donations = Donation.objects.all().order_by('-id')[:5]
        for i, item in enumerate(season_items):
            if sponsor_user[0].season_score >= item.price and sponsor_user[0].unlocked_items_animation < i + 1:
                sponsor_user[0].unlocked_items_animation += 1
                sponsor_user[0].save()

        return Response({
            'sponsor_user': sponsor_user.values(),
            'sponsor': sponsors.values(),
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
        send_mail(subject, message, 'reported_content@wodkafis.ch', ['reported_content@wodkafis.ch'])
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
