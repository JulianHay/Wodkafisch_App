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
from django.db import IntegrityError, transaction
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.core.mail import send_mail
from django.core.mail import EmailMultiAlternatives
from django.template.loader import get_template
from django.template import Context
from .tokens import account_activation_token
from django.template.loader import render_to_string
from .forms import *
from django.forms.formsets import BaseFormSet
from django.forms.formsets import formset_factory
from .models import *
from copy import deepcopy
import random
from datetime import datetime
from paypal_payment.models import Donation,Promo
from paypal_payment.forms import NewDonationForm,NewPromoForm
from paypal_payment.views import add_donation
from django.db.models import Sum, Case, Value, When, Q, Exists, OuterRef
from django.db.models.functions import Coalesce
import json

def main(request,*args,**kwargs):
    if request.method == 'POST':
        name = request.POST.get('name')
        score = int(request.POST.get('score'))
        highscore1 = Highscore.objects.get(id=1)
        highscore2 = Highscore.objects.get(id=2)
        highscore3 = Highscore.objects.get(id=3)
        if score > highscore3.score and score <= highscore2.score:
            highscore3.score = score
            highscore3.name = name
            highscore3.save()
        elif score > highscore2.score and score <= highscore1.score:
            highscore2_prev = deepcopy(highscore2)
            highscore2.score = score
            highscore2.name = name
            highscore2.save()
            highscore3.score = highscore2_prev.score
            highscore3.name = highscore2_prev.name
            highscore3.save()
        elif score > highscore1.score:
            highscore1_prev = deepcopy(highscore1)
            highscore2_prev = deepcopy(highscore2)
            highscore1.score = score
            highscore1.name = name
            highscore1.save()
            highscore2.score = highscore1_prev.score
            highscore2.name = highscore1_prev.name
            highscore2.save()
            highscore3.score = highscore2_prev.score
            highscore3.name = highscore2_prev.name
            highscore3.save()
        print(highscore1.score)
        print(highscore2.score)
        print(highscore3.score)
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
            msg = EmailMultiAlternatives(subject, text_content, 'no-reply@wodkafis.ch', [user.profile.email])
            msg.attach_alternative(html_content, "text/html")
            msg.send()

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
        if not user.is_active:
            user.is_active = False
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
        msg = EmailMultiAlternatives(subject, text_content, from_email, to)
        msg.attach_alternative(html_content, "text/html")
        msg.send()

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
                worldmap_image=form.cleaned_data['worldmap_image'],
                hello=form.cleaned_data['hello'],
                message=form.cleaned_data['message'],
                location=form.cleaned_data['location'],
                additional_text=form.cleaned_data['additional_text'],
                bye=form.cleaned_data['bye'],
                start=form.cleaned_data['start'],
                end=form.cleaned_data['end'],
                image=form.cleaned_data['image'],
                lat = form.cleaned_data['lat'],
                long = form.cleaned_data['long'],
            )

            txt_template = get_template('mails/event_template.txt')
            html_template = get_template('mails/event_template.html')
            event = Event.objects.latest('id')
            context = {'title': form.cleaned_data['title'],
                       'n': Event.objects.count()-1,
                       'worldmap_image': event.worldmap_image,
                       'hello': form.cleaned_data['hello'],
                       'message': form.cleaned_data['message'],
                       'location': form.cleaned_data['location'],
                       'additional_text': form.cleaned_data['additional_text'],
                       'bye': form.cleaned_data['bye'],
                       'image': event.image,
                       'time': datetime.strftime(form.cleaned_data['start'],'%d. %b, %H:%M'),
                       }

            subject, from_email, to = 'Fisch Event', 'events@wodkafis.ch', list(Profile.objects.values_list("email", flat=True))
            text_content = txt_template.render(context)
            html_content = html_template.render(context)
            msg = EmailMultiAlternatives(subject, text_content, from_email, to)
            msg.attach_alternative(html_content, "text/html")
            msg.send()


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

    users_data = Sponsor.objects.filter(sponsor_score__gt=0).order_by('-sponsor_score')

    if request.method == 'GET':
        form = NewDonationForm()
    if request.method == 'POST':
        form = NewDonationForm(request.POST)
        if form.is_valid():
            add_donation(first_name=form.cleaned_data['first_name'],
                         last_name=form.cleaned_data['last_name'],
                         donation=form.cleaned_data['donation'])



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

@login_required
def battle_pass(request):
    seasonItemFormset = formset_factory(SeasonItemForm, formset=BaseFormSet)

    if request.method == 'POST':
        if 'new_season' in request.POST:
            newSeason_form = NewSeasonForm(request.POST, request.FILES)
            seasonItem_formset = seasonItemFormset(request.POST, request.FILES)
            if newSeason_form.is_valid() and seasonItem_formset.is_valid():
                # Save user info
                season_title = newSeason_form.cleaned_data.get('title')
                season_image = newSeason_form.cleaned_data.get('image')
                max_donation = newSeason_form.cleaned_data.get('max_donation')
                Season.objects.create(title=season_title,image=season_image,max_donation=max_donation)

                season_items = []
                for seasonItem_form in seasonItem_formset:
                    item_image = seasonItem_form.cleaned_data.get('image')
                    item_price = seasonItem_form.cleaned_data.get('price')
                    item_season = Season.objects.latest('id')
                    season_items.append(SeasonItem(image=item_image,price=item_price,season=item_season))
                with transaction.atomic():
                    SeasonItem.objects.bulk_create(season_items)

                sponsors = Sponsor.objects.all()
                sponsors.update(season_score=0,unlocked_items=0,unlocked_items_animation=0)

                txt_template = get_template('mails/general_template.txt')
                html_template = get_template('mails/general_template.html')

                context = {'title': "A New Fisch Season Started!",
                           'hello': 'Dear Fisch Community,',
                           'message': ['a new season just started!',
                                       'Click the following links to see your progress and the available items:',
                                       'https://wodkafis.ch/sponsors'],
                           'bye': 'Fisch',
                           }

                subject, from_email, to = 'New Fisch Season', 'spenden@wodkafis.ch', list(Profile.objects.values_list("email", flat=True))
                text_content = txt_template.render(context)
                html_content = html_template.render(context)
                msg = EmailMultiAlternatives(subject, text_content, from_email, to)
                msg.attach_alternative(html_content, "text/html")
                msg.send()

        elif 'promo' in request.POST:
            promo_form = NewPromoForm(request.POST)
            if promo_form.is_valid():
                Promo.objects.create(value=promo_form.cleaned_data['value'],
                                     date=promo_form.cleaned_data['date'])
        elif 'new_donation' in request.POST:
            form = NewDonationForm(request.POST)
            if form.is_valid():
                add_donation(first_name=form.cleaned_data['first_name'],
                             last_name=form.cleaned_data['last_name'],
                             donation=form.cleaned_data['donation'])

        return redirect('/sponsors')
    else:
        newSeason_form = NewSeasonForm()
        seasonItem_formset = seasonItemFormset()
        promo_form = NewPromoForm()
        newDonation_form = NewDonationForm()
        season = Season.objects.latest('id')
        items = SeasonItem.objects.filter(season=season)

        sponsor_id = Profile.objects.get(user_id=request.user.id).sponsor_id
        sponsor = Sponsor.objects.get(id=sponsor_id)

        unlock_items = []
        for i,item in enumerate(items):
            item.percent = item.price / season.max_donation * 100
            if sponsor.season_score >= item.price and sponsor.unlocked_items_animation<i+1:
                unlock_items.append(True)
                sponsor.unlocked_items_animation += 1
                sponsor.save()
            else:
                unlock_items.append(False)

        season_score = sponsor.season_score/season.max_donation*100
        users_data = Sponsor.objects.filter(sponsor_score__gt=0).order_by('-sponsor_score')
        first_names = list(Sponsor.objects.values_list('first_name', flat = True))
        last_names = list(Sponsor.objects.values_list('last_name', flat = True))
        promo = Promo.objects.latest('id')

        donations = []
        for donation in Donation.objects.all().order_by('-id')[:5]:
            donations.append({'value':donation.value,'date':datetime.strftime(datetime.strptime(donation.date, '%d/%m/%Y %H:%M'),'%d. %b %H:%M')})

        context = {
            'season': season,
            'items': items,
            'newSeason_form': newSeason_form,
            'seasonItem_formset': seasonItem_formset,
            'promo_form': promo_form,
            'promo_date': datetime.strftime(datetime.strptime(promo.date.split('+')[0], '%Y-%m-%d %H:%M:%S'),'%d. %B %Y %H:%M'),
            'promo_value': int(promo.value * 100),
            'unlock_items': unlock_items,
            'sponsor': sponsor,
            'season_score': season_score,
            'users_data': users_data,
            'newDonation_form': newDonation_form,
            'donations': donations,
            'unlocked_items': sponsor.unlocked_items,
            'first_names':first_names,
            'last_names':last_names,
        }
        if datetime.today()<=datetime.strptime(promo.date.split('+')[0], '%Y-%m-%d %H:%M:%S'):
            context['promo_is_active'] = True
        else:
            context['promo_is_active'] = False

        return render(request, 'pages/battle_pass.html',context=context)

@login_required
def delete_account(request):
    if request.method == 'POST':
        user = request.user
        user.delete()
        logout(request)
        return redirect('home')
    return render(request, 'user/delete_account.html')

@user_passes_test(lambda u: u.is_staff)
def fischboard(request):
    if request.method == 'POST':
        if 'new_event_proposal' in request.POST:
            event_proposal_form = NewEventProposalForm(request.POST)
            if event_proposal_form.is_valid():
                EventProposal.objects.create(location = event_proposal_form.cleaned_data['location'],
                                             food = event_proposal_form.cleaned_data['food'],
                                             drinks = event_proposal_form.cleaned_data['drinks'],
                                             comments = event_proposal_form.cleaned_data['comments'],
                                             )
            return redirect('/fischboard')
        elif 'new_item_proposal' in request.POST:
            item_proposal_form = NewItemProposalForm(request.POST,request.FILES)
            if item_proposal_form.is_valid():
                ItemProposal.objects.create(name = item_proposal_form.cleaned_data['name'],
                                            description = item_proposal_form.cleaned_data['description'],
                                            image = item_proposal_form.cleaned_data['image'],
                                            comments = item_proposal_form.cleaned_data['comments'],
                                            )
        elif 'submit_likes' in request.POST:
            request_data = json.loads(request.POST.get('data'))
            if request_data['like'] in (0,1) and request_data['dislike'] in (0,1):
                user = Profile.objects.get(user_id=request.user.id)
                if 'event' in request.POST:
                    eventProposal = EventProposal.objects.get(location=request_data['location'])
                    EventProposalLikes.objects.update_or_create(user=user,event_proposal=eventProposal,defaults=dict(
                        like=request_data['like'],dislike=request_data['dislike']))
                elif 'item' in request.POST:
                    itemProposal = ItemProposal.objects.get(name=request_data['name'])
                    ItemProposalLikes.objects.update_or_create(user=user,item_proposal=itemProposal,defaults=dict(
                        like=request_data['like'],dislike=request_data['dislike']))
        elif 'backlog' in request.POST:
            request_data = json.loads(request.POST.get('data'))
            if 'event' in request_data:
                EventProposal.objects.filter(location=request_data['location']).update(is_active=0)
            elif 'item' in request_data:
                ItemProposal.objects.get(name=request_data['name']).update(is_active=0)
        elif 'edit' in request.POST:
            #request_data = json.loads(request.POST)
            #print(request_data)
            if request.POST.__contains__('event'):
                EventProposal.objects.filter(id=request.POST.get('id')).update(location=request.POST.get('location'),
                                                                           food=request.POST.get('food'),
                                                                           drinks=request.POST.get('drinks'),
                                                                           comments=request.POST.get('comments'))
            elif request.POST.__contains__('item'):
                itemProposal = ItemProposal.objects.get(id=request.POST.get('id'))
                itemProposal.name = request.POST.get('name')
                itemProposal.description = request.POST.get('description')
                itemProposal.image = request.FILES['image']
                itemProposal.comments = request.POST.get('comments')
                itemProposal.save()
        return redirect('/fischboard')

    else:
        user = Profile.objects.get(user_id=request.user.id)
        event_proposals = EventProposal.objects.annotate(likes=Coalesce(Sum('like__like'),0),
                                                         dislikes=Coalesce(Sum('like__dislike', default=0),0),
                                                         score=Coalesce(Sum('like__like'),0)-Coalesce(Sum('like__dislike', default=0),0),
                                                         user_like=Exists(EventProposal.objects.filter(
                                                             like__user_id=user.id,
                                                             like__event_proposal_id = OuterRef('pk'),
                                                             like__like = 1)),
                                                         user_dislike=Exists(EventProposal.objects.filter(
                                                             like__user_id=user.id,
                                                             like__event_proposal_id=OuterRef('pk'),
                                                             like__dislike=1)),
                                                         ).order_by('-score')
        item_proposals = ItemProposal.objects.annotate(likes=Coalesce(Sum('like__like'),0),
                                                         dislikes=Coalesce(Sum('like__dislike', default=0),0),
                                                         score=Coalesce(Sum('like__like'),0)-Coalesce(Sum('like__dislike', default=0),0),
                                                         user_like=Exists(ItemProposal.objects.filter(
                                                             like__user_id=user.id,
                                                             like__item_proposal_id = OuterRef('pk'),
                                                             like__like = 1)),
                                                         user_dislike=Exists(ItemProposal.objects.filter(
                                                             like__user_id=user.id,
                                                             like__item_proposal_id=OuterRef('pk'),
                                                             like__dislike=1)),
                                                         ).order_by('-score')
        item_proposal_form = NewItemProposalForm()
        event_proposal_form = NewEventProposalForm()


        context = {'event_proposals':event_proposals,
                   'item_proposals':item_proposals,
                   'item_proposal_form':item_proposal_form,
                   'event_proposal_form':event_proposal_form,
                   }
        return render(request, 'pages/fischboard.html', context=context)

@user_passes_test(lambda u: u.is_staff)
def stock_overview(request):
    context = {}
    return