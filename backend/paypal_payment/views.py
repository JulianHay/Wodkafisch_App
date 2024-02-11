from django.shortcuts import render,redirect
from django.urls import reverse
from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt
#from paypal.standard.forms import PayPalPaymentsForm
from django.conf import settings
import re
#from django.core.mail import send_mail
from django.contrib.auth.models import User
from pages.models import SeasonItem,Season, Profile, Sponsor, ExpoToken, SeasonBadge
from .models import Donation, Promo
from datetime import datetime, timedelta
import pytz
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from django.core.mail import EmailMultiAlternatives
from django.template.loader import get_template
import quopri
from utils.push_notifications import send_push_notifications
from utils.mail import send_mail, get_mail_connection

def add_donation(first_name,last_name,donation):
    user = Profile.objects.get(first_name=first_name, last_name=last_name)
    sponsor = Sponsor.objects.get(id=user.sponsor_id)

    badge_list = [
        ['diamond_sponsor', 200],
        ['black_sponsor', 100],
        ['gold_sponsor', 50],
        ['silver_sponsor', 20],
        ['bronze_sponsor', 10],
    ]
    remaining_donation = donation
    for badge in badge_list:
        while remaining_donation >= badge[1]:
            remaining_donation -= badge[1]
            setattr(sponsor, badge[0], getattr(sponsor, badge[0]) + 1)


    promo = Promo.objects.latest('id')
    if datetime.today()<=datetime.strptime(promo.date.split('+')[0], '%Y-%m-%d %H:%M:%S'):
        fisch_coin_multiplier = 100 * (1+promo.value)
    else:
        fisch_coin_multiplier = 100

    fischflocken = round(float(donation) * float(fisch_coin_multiplier))
    sponsor.sponsor_score += fischflocken
    sponsor.season_score += fischflocken
    sponsor.save()

    Donation.objects.create(value=fischflocken,
                            date=datetime.now(pytz.timezone('Europe/Berlin')).strftime("%d/%m/%Y %H:%M"))

    # send mails if item is unlocked
    season = Season.objects.latest('id')
    items = SeasonItem.objects.filter(season=season)
    notification_token = ExpoToken.objects.get(id=user.expo_token_id)
    for i, item in enumerate(items):
        if sponsor.season_score >= item.price and sponsor.unlocked_items < i + 1:
            if notification_token:
                send_push_notifications([notification_token.token],
                                        'New Item Unlocked!',
                                        f'Check your battle pass.')
            else:
                txt_template = get_template('mails/general_template.txt')
                html_template = get_template('mails/general_template.html')
                context = {'title': "New Item Unlocked!",
                           'hello': 'Hi',
                           'message': ['Congratulations!',
                                       'You unlocked a new item!',
                                       'Your Fisch Season Status is available here:',
                                       'https://wodkafis.ch/sponsors'],
                           'bye': 'Fisch',
                           'user': User.objects.get(first_name=first_name, last_name=last_name),
                           }
                subject, from_email, to = 'New Item Unlocked', 'spenden@wodkafis.ch', [user.email]
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

            subject = "New Item Unlocked"
            message = "%s %s unlocked a new item worth %i Fischflocken." % (user.first_name, user.last_name, item.price)
            send_mail(from_mail='no-reply@wodkafis.ch',
                      password='Hoeh!en1urch',
                      subject=subject,
                      body=message,
                      to=['spenden@wodkafis.ch'])
            #send_mail(subject, message, 'spenden@wodkafis.ch', ['spenden@wodkafis.ch'])

            sponsor.unlocked_items += 1
            sponsor.save()
    # add season badge if maximum donation is reached
    if sponsor.season_score > items.order_by('-price').first().price:
        season_badge = SeasonBadge.objects.latest('id')
        sponsor.season_badges.add(season_badge)
        sponsor.save()

        if notification_token:
            send_push_notifications([notification_token.token],
                                    'Season Completed!',
                                    f'You completed the battle pass and unlocked the season badge.')
        else:
            txt_template = get_template('mails/general_template.txt')
            html_template = get_template('mails/general_template.html')
            context = {'title': "Season Completed!",
                       'hello': 'Hi',
                       'message': ['Congratulations!',
                                   'You completed the battle pass and unlocked the season badge.',
                                   'Your Fisch Season Status is available here:',
                                   'https://wodkafis.ch/sponsors'],
                       'bye': 'Fisch',
                       'user': User.objects.get(first_name=first_name, last_name=last_name),
                       }
            subject, from_email, to = 'Season Completed!', 'spenden@wodkafis.ch', [user.email]
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
    return fischflocken
@csrf_exempt
def donation(request):
    msg = request.POST.get('mail')
    #if '    ---------- Urspr=C3=BCngliche Nachricht ----------\n   </div>=20\n   <div>\n    Von: "service@paypal.de"' in msg:

    try:
        last_name = re.search('[\w\d\=]*(?=\shat Ihnen)',msg)[0]
        first_name = re.search('[\w\d\=]*(?=\s%s)'%last_name,msg)[0]
        if '=' in last_name:
            last_name = quopri.decodestring(last_name).decode('utf-8')
        if '=' in first_name:
            first_name = quopri.decodestring(first_name).decode('utf-8')
        donation = float(re.sub(',','.',re.search('(?<=hat Ihnen\s)[\d,]*',msg)[0]))
    except:
        subject = "Donation has been made - Please add sponsor"
        message = "A donation has been made. An automatic identification of donation and sponsor.\n Please add the User and / or assign the donation."
        send_mail(from_mail='no-reply@wodkafis.ch',
                  password='Hoeh!en1urch',
                  subject=subject,
                  body=message,
                  to=['spenden@wodkafis.ch'])
        #send_mail(subject, message, 'contact@wodkafis.ch', ['spenden@wodkafis.ch'])
        return HttpResponse(' ')
    #date = pytz.timezone('Europe/Berlin').localize(datetime.strptime(re.search('(?<=Datum: )[\s\d:\.]*(?= CEST)',msg)[0],'%d.%m.%Y %H:%M'))
    #if datetime.now(pytz.timezone('Europe/Berlin'))-date<timedelta(minutes=1):
    try:
        fischflocken = add_donation(first_name, last_name, donation)
        profile = Profile.objects.get(first_name=first_name, last_name=last_name)
        notification_token = ExpoToken.objects.get(id=profile.expo_token_id)
        if notification_token:
            send_push_notifications([notification_token.token],
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
    except:
        subject = "Donation has been made - Please add sponsor"
        message = "%s %s made a donation of %i. An automatic assignment of the donation to the sponsor score failed.\n Please add the User and / or assign the donation." %(first_name, last_name, donation)
        send_mail(from_mail='no-reply@wodkafis.ch',
                  password='Hoeh!en1urch',
                  subject=subject,
                  body=message,
                  to=['spenden@wodkafis.ch'])
        #send_mail(subject, message, 'spenden@wodkafis.ch', ['spenden@wodkafis.ch'])
    # else:
    #     subject = "Donation has been made - Please check it"
    #     message = "%s %s made a donation of %i. The timestamp didn't match, please check it." %(first_name, last_name, donation)
    #     send_mail(subject, message, 'contact@wodkafis.ch', ['contact@wodkafis.ch'])
    return HttpResponse(' ')

def api_donation(request):
    host = request.get_host()
    paypal_dict = {
        'business': settings.PAYPAL_RECEIVER_EMAIL,
        'amount': '20.00',
        'item_name': 'Bronze Donation',
        'invoice': str(uuid.uuid4()),
        'currency_code': 'EUR',
        'notify_url': 'http://{}{}'.format(host,
                                           reverse('paypal-ipn')),
        'return_url': 'http://{}{}'.format(host,
                                           reverse('payment_done')),
        'cancel_return': 'http://{}{}'.format(host,
                                              reverse('payment_cancelled')),
    }
    form = PayPalPaymentsForm(initial=paypal_dict)
    context = {
        'form': form
    }
    return render(request,'donation.html', context)

@csrf_exempt
def payment_done(request):
    messages.success(request,'You\'ve successfully made a payment!')
    return redirect('sponsors')

@csrf_exempt
def payment_cancelled(request):
    messages.error(request, 'You\'re donation was cancelled!')
    return redirect('sponsors')
