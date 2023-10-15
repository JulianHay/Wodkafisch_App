"""wodkafisch URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path, re_path
from pages.views import *
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.contrib.auth import views as auth_views
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', main,name='home'),
    path('about/', about,name='about'),
    path('contact/', contact,name='contact'),
    path('signup/', signup, name="signup"),
    path('sent/', activation_sent, name="activation_sent"),
    path('activate/<slug:uidb64>/<slug:token>/', activate, name='activate'),
    path('approve_user/<slug:uidb64>/<slug:token>/', approve_user, name='approve_user'),

    path('pictures/',pictures,name='pictures'),

    path('sponsors/',battle_pass,name='sponsors'),
    path('update_sponsor/', update_sponsor_status, name='update_sponsor'),

    path('events/', events, name='events'),
    path('all_events/', all_events, name='all_events'),
    path('event_detail/', event_detail, name='event_detail'),
    path('fischboard/',fischboard,name='fischboard'),

    #path('paypal/', include('paypal.standard.ipn.urls')),
    path('',include('paypal_payment.urls')),

    path('login/', login_request, name="login"),
    path('logout/', logout_request, name="logout"),

    path('change_password/',
         auth_views.PasswordChangeView.as_view(template_name='user/password_change.html',success_url = '/'),
         name='change_password'),
    path('password_reset/',
         auth_views.PasswordResetView.as_view(
             template_name='user/password_reset.html',
             subject_template_name='user/password_reset_subject.txt',
             email_template_name='user/password_reset_email.html',
             # success_url='/login/'
         ),
         name='password_reset'),
    path('password_reset/done/',
         auth_views.PasswordResetDoneView.as_view(
             template_name='user/password_reset_done.html'
         ),
         name='password_reset_done'),
    path('password_reset_confirm/<uidb64>/<token>/',
         auth_views.PasswordResetConfirmView.as_view(
             template_name='user/password_reset_confirm.html'
         ),
         name='password_reset_confirm'),
    path('password_reset_complete/',
         auth_views.PasswordResetCompleteView.as_view(
             template_name='user/password_reset_complete.html'
         ),
         name='password_reset_complete'),
    path('delete_user/', delete_account, name='delete_user'),
    path('terms_and_conditions/', terms_and_conditions, name='Terms and Conditions'),
    path('privacy_policy/', privacy_policy, name='Privacy Policy'),

    # --------------------------------------------------------
    path('app/', include('app.urls'))
]

urlpatterns += staticfiles_urlpatterns()
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

handler404 = 'pages.views.error_404'
