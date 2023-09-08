from __future__ import absolute_import, unicode_literals
from celery import task
#imports needed for the functions
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import get_template
from .models import *
from django.contrib.auth.models import User
from users.models import *
from celery import Celery
from celery.schedules import crontab
from celery.task import periodic_task
from celery.utils.log import get_task_logger
import requests

def sendEmail(email, subject, to_email):
    #Logic to send an email here ........
@task()
def scheduledTask():
    #Get Subscriptions
    notifications = JobNotifications.objects.all()
    for nx in notifications:
        if nx.status == 'ACTIVE':
            selection = nx.subscribed_category
    the_company = Company.objects.get(uniqueId='139260d2')
                jobs = Jobs.objects.filter(company=the_company, category__title__contains=selection)[:3]
    subject = '[Careers Portal] Weekly Job Notifications'
    email_jobs = {
                "title": "Job Notifications from Careers Portal",
                "shortDescription": "Thank you for subscribing to Careers Portal, job notifications. For more jobs visit https://careers-portal.co.za",
                "subtitle": "Careers Portal - The latest job opportunities, updated weekly",
                "jobs": jobs
                }
    sendEmail(email_jobs, subject, [nx.subscribed_user.email])


import datetime
import celery

@celery.decorators.periodic_task(run_every=datetime.timedelta(minutes=5)) # here we assume we want it to be run every 5 mins
def myTask():
    # Do something here
    # like accessing remote apis,
    # calculating resource intensive computational data
    # and store in cache
    # or anything you please
    print 'This wasn\'t so difficult'