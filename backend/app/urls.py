from rest_framework import routers
from .views import *
from django.urls import path, include


router = routers.DefaultRouter()

# router.register(r'events',EventViewSet)
# router.register(r'latest_event',LatestEventViewSet)
# #router.register(r'pictures',PictureViewSet)
# router.register(r'latest_picture',LatestPictureViewSet)
# router.register(r'sponsors',SponsorViewSet)
# router.register(r'sponsor_user_data',SponsorUserViewSet)
# router.register(r'highscore',HighscoreViewSet)
# router.register(r'season',SeasonViewSet)
# router.register(r'season_items',SeasonItemViewSet)
# router.register(r'donations',DonationViewSet)
# router.register(r'promo',PromoViewSet)

urlpatterns = [
    path('',include(router.urls)),
    path(r'register',SignupView.as_view(),name='register'),
    # path(r'activate_user',activate_user,name='activate_user'),
    path(r'activate', activate_account, name='activate_account'),
    path(r'approve_user', approve_user, name='approve_user'),
    path(r'login', LoginView.as_view(),name='login'),
    path(r'logout', LogoutView.as_view(),name='logout'),
    path(r'authenticated',CheckAuthenticatedView.as_view(),name='authenticated'),
    path(r'home',HomeView.as_view(),name='home'),
    path(r'map', MapView.as_view(), name='map'),
    path(r'sponsor', SponsorView.as_view(), name='sponsor'),
    path(r'pictures', PictureView.as_view(), name='pictures'),
    path(r'upload_picture', ImageUploadView.as_view(), name='upload_picture'),
    path(r'edit_picture', ImageEditView.as_view(), name='edit_picture'),
    path(r'subscribe_push_notification', PushNotificationTokenView.as_view(), name='subscribe_push_notification'),
    path(r'send_push_notification', SendPushNotificationView.as_view(), name='send_push_notification'),
    path(r'contact', ContactView.as_view(), name='contact'),
    path(r'highscore', HighscoreView.as_view(), name='set_highscore'),

    path(r'admin/new_season', NewSeasonView.as_view(), name='new_season'),
    path(r'admin/new_event', NewEventView.as_view(), name='new_event'),
    path(r'admin/add_donation', AddDonationView.as_view(), name='add_donation'),
    path(r'admin/add_bonus', AddFischFlockenBonusView.as_view(), name='add_bonus'),
    path(r'admin/add_app_release', AddAppRelease.as_view(), name='add_app_release'),
    path(r'admin/user_list', UserViewSet.as_view({'get': 'list'}), name='user_list'),

    path(r'like_picture', PictureLikeView.as_view(), name='picture_like'),
    path(r'report_content', ReportUser.as_view(), name='report_content'),
    path(r'password_change', change_password, name='change_password'),
    path(r'password_reset/', include('django_rest_passwordreset.urls', namespace='password_reset')),

    ]