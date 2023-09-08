from django.contrib import admin
from .models import Highscore, Event, FischPicture, Sponsor, Season, SeasonItem,Profile

admin.site.register(Highscore)
admin.site.register(Event)
admin.site.register(FischPicture)
admin.site.register(Sponsor)
admin.site.register(Season)
admin.site.register(SeasonItem)
admin.site.register(Profile)
