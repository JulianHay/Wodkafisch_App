from django.shortcuts import render, redirect, get_object_or_404, HttpResponseRedirect
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.forms import AuthenticationForm, PasswordResetForm, PasswordChangeForm
from django.contrib.sites.shortcuts import get_current_site
from django.contrib import messages
from django.utils.encoding import force_str
from django.contrib.auth.models import User
from django.core import serializers
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.decorators import login_required, user_passes_test
import json
from django.template.defaultfilters import linebreaks
from django.urls import reverse
from django.db import IntegrityError
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.core.mail import send_mail
from .tokens import account_activation_token
from django.template.loader import render_to_string
from .forms import SubmitScoreForm, ContactForm, SignUpForm, EventForm, FischPictureForm, UpdateSponsorForm, NewSponsorForm
from .models import Highscore, Event, FischPicture, Sponsor
from copy import deepcopy
import random
from datetime import datetime

def main(request,*args,**kwargs):
    if request.method == 'POST':
        name = request.POST.get('name')
        score = int(request.POST.get('score'))

        highscore1 = Highscore.objects.get(id=1)
        highscore2 = Highscore.objects.get(id=2)
        highscore3 = Highscore.objects.get(id=3)
        if score > highscore3.score:
            highscore3.score = score
            highscore3.name = name
            highscore3.save()
        elif score > highscore2.score:
            highscore3.score = deepcopy(highscore2.score)
            highscore3.name = deepcopy(highscore2.name)
            highscore3.save()
            highscore2.score = score
            highscore2.name = name
            highscore2.save()
        elif score > highscore1.score:
            highscore3.score = deepcopy(highscore2.score)
            highscore3.name = deepcopy(highscore2.name)
            highscore3.save()
            highscore2.score = deepcopy(highscore1.score)
            highscore2.name = deepcopy(highscore1.name)
            highscore2.save()
            highscore1.score = score
            highscore1.name = name
            highscore1.save()

    if request.method == 'GET':
        highscore1 = Highscore.objects.get(id=1)
        highscore2 = Highscore.objects.get(id=2)
        highscore3 = Highscore.objects.get(id=3)

    context = {
        'highscore1': highscore1,
        'highscore2': highscore2,
        'highscore3': highscore3
    }
    return render(request, 'pages/main.html', context)

def about(request,*args,**kwargs):
    context = {}
    return render(request, 'pages/about.html', context)

def contact(request,*args,**kwargs):
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            subject = "Wodkafisch Inquiry"
            body = {
                'name': form.cleaned_data['name'],
                'email': form.cleaned_data['email_address'],
                'message': form.cleaned_data['message'],
            }
            message = "\n".join(body.values())

            send_mail(subject, message, 'contact@wodkafis.ch', ['contact@wodkafis.ch'])
            return render(request,"pages/contact_success.html")
        else:
            return render(request, "pages/contact.html", {'form': form})

    elif request.method == 'GET':
        form = ContactForm()
        return render(request, "pages/contact.html", {'form': form})

def privacy_policy(request):
    context = {}
    return render(request, 'pages/privacy_policy.html', context)

def terms_and_conditions(request):
    context = {}
    return render(request, 'pages/terms_and_conditions.html', context)

def signup(request):
    # https://dev.to/thepylot/create-advanced-user-sign-up-view-in-django-step-by-step-k9m
    # implement activation by admin
    if request.method  == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            user = form.save()
            user.refresh_from_db()
            user.profile.first_name = form.cleaned_data.get('first_name')
            user.profile.last_name = form.cleaned_data.get('last_name')
            user.profile.email = form.cleaned_data.get('email')
            user.profile.image = form.cleaned_data.get('image')
            # user can't login until link confirmed
            user.is_active = False

            user.save()
            current_site = get_current_site(request)
            subject = 'Please Activate Your Account'
            # load a template like get_template()
            # and calls its render() method immediately.
            message = render_to_string('user/activation_request.html', {
                'user': user,
                'domain': current_site.domain,
                'uid': urlsafe_base64_encode(force_bytes(user.pk)),
                # method will generate a hash value with user related data
                'token': account_activation_token.make_token(user),
            })
            send_mail(subject=subject,
                      message=message,
                      from_email='no-reply@wodkafis.ch',
                      recipient_list=[user.profile.email])
            #user.email_user(subject, message)
            return redirect('activation_sent')
    else:
        form = SignUpForm()
    return render(request, 'user/signup.html', {'form': form})

def activation_sent(request):
    return render(request, 'user/activation_sent.html')

def activate(request, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None
    # checking if the user exists, if the token is valid.
    if user is not None and account_activation_token.check_token(user, token):
        user.is_active = False
        # set signup_confirmation true
        user.profile.signup_confirmation = True
        user.save()
        logout(request)

        # send approval request to admin
        message = render_to_string('user/user_approval_request.html', {
            'user': user,
            'domain': get_current_site(request).domain,
            'uid': urlsafe_base64_encode(force_bytes(user.pk)),
            # method will generate a hash value with user related data
            'token': account_activation_token.make_token(user),
        })

        send_mail(subject='User Sign Up Request Approval',
                  message=message,
                  from_email='contact@wodkafis.ch',
                  recipient_list=['contact@wodkafis.ch'])

        return render(request, 'user/activation_successful.html')
    else:
        return render(request, 'user/activation_invalid.html')

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
        context = {'user':user}

        message = render_to_string('user/user_approval_confirmation.html', {
            'user': user,
            'domain': get_current_site(request).domain,
        })
        send_mail(subject='Sign Up Completed',
                  message=message,
                  from_email='no-reply@wodkafis.ch',
                  recipient_list=[user.profile.email])
        #user.email_user('Sign Up Completed', message)

        return render(request, 'user/user_approved.html',context=context)
    else:
        return render(request, 'user/activation_invalid.html')

def login_request(request):
    if request.method == 'POST':
        form = AuthenticationForm(request=request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                if user.is_active:
                    login(request, user)
                    messages.info(request, f"You are now logged in as {username}")
                    return redirect('/')
            elif User.objects.filter(username=username).exists():
                    messages.error(request, "Your account has not been activated by the admins. You will receive an Email confirmation when your account is active")
            else:
                messages.error(request, "Invalid username or password.")
        else:
            messages.error(request, "Invalid username or password.")
    form = AuthenticationForm()
    return render(request,"user/login.html",context={"form": form})

def logout_request(request):
    logout(request)
    messages.info(request, "Logged out successfully!")
    return redirect("/")

@login_required
def pictures(request):

    if request.method == 'GET':
        form = FischPictureForm()
    if request.method == 'POST':
        form = FischPictureForm(request.POST, request.FILES)
        if form.is_valid():
            FischPicture.objects.create(
                image=form.cleaned_data['image'],
                description=form.cleaned_data['description'],
                lat = form.cleaned_data['lat'],
                long = form.cleaned_data['long'],
                username=request.user,
                date = datetime.today().strftime("%d/%m/%Y"),
            )
    pictures = FischPicture.objects.all()
    n = min(len(pictures),4)
    random_pictures = random.sample(list(pictures), n)
    context = {
        'pictures' : pictures,
        'random_pictures' : random_pictures,
        'form' : form,
    }
    return render(request, 'pages/pictures.html', context)

@login_required
def events(request):
    if request.method == 'GET':
        form = EventForm()
    if request.method == 'POST':
        form = EventForm(request.POST, request.FILES)
        if form.is_valid():
            Event.objects.create(
                user=request.user,
                title=form.cleaned_data['title'],
                description=form.cleaned_data['description'],
                start=form.cleaned_data['start'],
                end=form.cleaned_data['end'],
                image=form.cleaned_data['image'],
                lat = form.cleaned_data['lat'],
                long = form.cleaned_data['long'],
            )
    events = Event.objects.all()

    context = {
        'form':form,
        'events':events,
    }
    return render(request,'pages/events.html',context)

@login_required
def all_events(request):
    all_events = Event.objects.all()
    out = []
    for event in all_events:
        out.append({
            'title': event.title,
            'id': event.id,
            'start': event.start.strftime("%m/%d/%Y, %H:%M:%S"),
            'end': event.end.strftime("%m/%d/%Y, %H:%M:%S"),
        })
    return JsonResponse(out, safe=False)

@login_required
def event_detail(request):
    id = request.GET.get("id", None)
    event = Event.objects.get(id=id)
    context = {
        'event': event,
    }
    out = {
        'title': event.title,
        'start': event.start.strftime("%d/%m/%Y, %H:%M:%S"),
        'end': event.end.strftime("%d/%m/%Y, %H:%M:%S"),
        'description': linebreaks(event.description),
        'image': '/'+str(event.image),
    }
    return JsonResponse(out, safe=False)

@login_required
def sponsors(request):

    users_data = Sponsor.objects.order_by('-sponsor_score')

    if request.method == 'GET':
        form = NewSponsorForm()
    if request.method == 'POST':
        form = NewSponsorForm(request.POST)
        if form.is_valid():
            Sponsor.objects.create(
                first_name=form.cleaned_data['first_name'],
                last_name=form.cleaned_data['last_name'],
            )

    context = {'users_data' : users_data,
               'form': form,
    }
    return render(request, 'pages/sponsors.html', context)

@user_passes_test(lambda u: u.is_staff)
def update_sponsor_status(request):
    first_name = request.GET.get("first_name", None)
    last_name = request.GET.get("last_name", None)
    sponsor = Sponsor.objects.get(first_name=first_name,last_name=last_name)

    if request.method == 'GET':
        form =UpdateSponsorForm(instance=sponsor)
        context = {'form': form}
        return render(request, 'pages/sponsor_update.html', context)

    if request.method == 'POST':
        form = UpdateSponsorForm(request.POST,instance=sponsor)
        if form.is_valid():
            sponsor.bronze_sponsor = form.cleaned_data['bronze_sponsor']
            sponsor.silver_sponsor = form.cleaned_data['silver_sponsor']
            sponsor.gold_sponsor = form.cleaned_data['gold_sponsor']
            sponsor.black_sponsor = form.cleaned_data['black_sponsor']
            sponsor.diamond_sponsor = form.cleaned_data['diamond_sponsor']
            sponsor.sponsor_score = sponsor.bronze_sponsor * 10 + sponsor.silver_sponsor * 20 + sponsor.gold_sponsor * 50 + sponsor.black_sponsor * 100 + sponsor.diamond_sponsor * 200
            sponsor.save()
        return redirect('/sponsors')


def error_404(request, exception):
    return render(request, 'pages/404_error.html')

