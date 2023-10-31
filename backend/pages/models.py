from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver


class Sponsor(models.Model):
    first_name = models.CharField(max_length=100,null=True, blank=True)
    last_name = models.CharField(max_length=100,null=True, blank=True)
    username = models.CharField(max_length=100,null=True, blank=True)
    bronze_sponsor = models.IntegerField(default=0)
    silver_sponsor = models.IntegerField(default=0)
    gold_sponsor = models.IntegerField(default=0)
    black_sponsor = models.IntegerField(default=0)
    diamond_sponsor = models.IntegerField(default=0)
    sponsor_score = models.IntegerField(default=0)
    season_score = models.IntegerField(default=1000,null=True, blank=True)
    unlocked_items = models.IntegerField(default=0,null=True, blank=True)
    unlocked_items_animation = models.IntegerField(default=0, null=True, blank=True)

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100, blank=True)
    email = models.EmailField(max_length=150)
    image = models.ImageField(null=True, blank=True, verbose_name='Pictures', upload_to='user/')
    signup_confirmation = models.BooleanField(default=False)
    sponsor = models.OneToOneField('Sponsor', on_delete=models.CASCADE,null=True)
    def __str__(self):
        return self.user.username

@receiver(post_save, sender=User)
#@receiver(post_save, sender=Sponsor)
def update_profile_signal(sender, instance, created, **kwargs):
    if created:
        sponsor = Sponsor.objects.create(first_name=instance.first_name, last_name=instance.last_name,username=instance.username)
        profile = Profile.objects.create(user=instance,first_name=instance.first_name,last_name=instance.last_name,email=instance.email,sponsor_id=sponsor.id)
        instance.profile.save()


class Highscore(models.Model):
    name = models.CharField(max_length=100)
    score = models.DecimalField(max_digits=20,decimal_places=0)

class Event(models.Model):
    title = models.CharField(max_length=100, null=True,blank=True)
    start = models.DateTimeField(null=True,blank=True)
    end = models.DateTimeField(null=True,blank=True)
    worldmap_image = models.ImageField(null=True, blank=True, verbose_name='Pictures', upload_to='events/')
    hello = models.CharField(max_length=100, null=True,blank=True)
    message = models.CharField(max_length=2000, null=True,blank=True)
    location = models.CharField(max_length=100, null=True,blank=True)
    additional_text = models.CharField(max_length=100, null=True,blank=True)
    bye = models.CharField(max_length=100, null=True,blank=True)
    image = models.ImageField(null=True,blank=True,verbose_name='Pictures',upload_to='events/')
    lat = models.DecimalField(null=True, blank=True, max_digits=20, decimal_places=9)
    long = models.DecimalField(null=True, blank=True, max_digits=20, decimal_places=9)
    user = models.CharField(max_length=200, null=True,blank=True)
    country = models.CharField(max_length=200, null=True, blank=True)


    def __str__(self):
        return self.title

class FischPicture(models.Model):
    image = models.ImageField(null=True,blank=True,verbose_name='Pictures', upload_to='fisch_pictures/')
    description = models.CharField(max_length=2000, null=True, blank=True)
    lat = models.DecimalField(null=True,blank=True,max_digits=20, decimal_places=9)
    long = models.DecimalField(null=True,blank=True,max_digits=20, decimal_places=9)
    date = models.CharField(max_length=50, null=True,blank=True)
    username = models.CharField(max_length=50, null=True,blank=True)

class FischPictureLikes(models.Model):
    picture = models.ForeignKey(FischPicture, on_delete=models.CASCADE, related_name="like")
    user = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name="fisch_picture_likes")
    like = models.IntegerField(default=0)

class SeasonItem(models.Model):
    image = models.ImageField(null=True, blank=True, verbose_name='Pictures', upload_to='battlepass/')
    price = models.IntegerField(default=0)
    season = models.ForeignKey('Season', on_delete=models.CASCADE,default=None)
class Season(models.Model):
    title = models.CharField(max_length=50, blank=True)
    image = models.ImageField(null=True, blank=True, verbose_name='Pictures', upload_to='battlepass/')
    max_donation = models.IntegerField(default=300)

class EventProposal(models.Model):
    location = models.CharField(max_length=50, blank=True)
    food = models.CharField(max_length=200, blank=True)
    drinks = models.CharField(max_length=200, blank=True)
    comments = models.CharField(max_length=400, blank=True)
    is_active = models.BooleanField(default=True)

class ItemProposal(models.Model):
    name = models.CharField(max_length=50, blank=True)
    description = models.CharField(max_length=200, blank=True)
    image = models.ImageField(null=True, blank=True, verbose_name='Pictures', upload_to='items/')
    comments = models.CharField(max_length=400, blank=True)
    is_active = models.BooleanField(default=True)

class EventProposalLikes(models.Model):
    event_proposal = models.ForeignKey(EventProposal, on_delete=models.CASCADE, related_name="like")
    user = models.ForeignKey(Profile, on_delete=models.CASCADE,related_name="event_proposal_likes")
    like = models.IntegerField(default=0)
    dislike = models.IntegerField(default=0)

class ItemProposalLikes(models.Model):
    item_proposal = models.ForeignKey(ItemProposal, on_delete=models.CASCADE, related_name="like")
    user = models.ForeignKey(Profile, on_delete=models.CASCADE,related_name="item_proposal_likes")
    like = models.IntegerField(default=0)
    dislike = models.IntegerField(default=0)
