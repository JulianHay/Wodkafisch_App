from django.shortcuts import render
from rest_framework import viewsets
from .serializer import *
from pages.models import *
from paypal_payment.models import *
from django.contrib.auth import get_user_model, login, logout
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from django.contrib import auth
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventModelSerializer

class LatestEventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all().order_by('-id')[:1]
    serializer_class = EventModelSerializer

class PictureViewSet(viewsets.ModelViewSet):
    queryset = FischPicture.objects.all()
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
        re_password  = data['re_password']
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
                        user = User.objects.create_user(username=username, password=password)

                        user.profile.first_name = first_name
                        user.profile.last_name = last_name
                        user.profile.email = email
                        user.save()

                        # implement confirmation mail ...

                        return Response({ 'success': 'User created successfully' })
            else:
                return Response({ 'error': 'Passwords do not match' })
        except:
                return Response({ 'error': 'Something went wrong when registering account' })

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