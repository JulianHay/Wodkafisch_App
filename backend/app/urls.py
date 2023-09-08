from rest_framework import routers
from .views import *
from django.urls import path, include


router = routers.DefaultRouter()

router.register(r'events',EventViewSet)
router.register(r'latest_event',LatestEventViewSet)
router.register(r'pictures',PictureViewSet)
router.register(r'latest_picture',LatestPictureViewSet)
router.register(r'sponsors',SponsorViewSet)
router.register(r'sponsor_user_data',SponsorUserViewSet)
router.register(r'highscore',HighscoreViewSet)
router.register(r'season',SeasonViewSet)
router.register(r'season_items',SeasonItemViewSet)
router.register(r'donations',DonationViewSet)
router.register(r'promo',PromoViewSet)
#router.register(r'register', UserRegister,basename='register')
#router.register(r'login', UserLogin,basename='login')
#router.register(r'logout', UserLogout,basename='logout')

urlpatterns = [
    path('',include(router.urls)),
    path(r'register',SignupView.as_view(),name='register'),
    path(r'login', LoginView.as_view(),name='login'),
    path(r'logout', LogoutView.as_view(),name='logout'),
    path(r'authenticated',CheckAuthenticatedView.as_view(),name='authenticated'),
]