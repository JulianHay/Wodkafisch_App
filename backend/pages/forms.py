from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from .widgets import BootstrapDateTimePickerInput
from .models import Sponsor
import re

class SubmitScoreForm(forms.Form):
    name = forms.CharField(max_length=100)
    score = forms.DecimalField(max_digits=20,decimal_places=0)

class ContactForm(forms.Form):
	name = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Please enter your name.','class':'form-control'}),
						   max_length = 50,required=True,label='')
	email_address = forms.EmailField(widget=forms.TextInput(attrs={'placeholder': 'Please enter your email address.','class':'form-control'}),
									 max_length = 150,required=True,label='')
	message = forms.CharField(widget = forms.Textarea(attrs={'placeholder': 'Please enter a message.','class':'form-control'}),
							  max_length = 2000,required=True,label='')

class SignUpForm(UserCreationForm):
    first_name = forms.CharField(max_length=100, help_text='First Name')
    last_name = forms.CharField(max_length=100, help_text='Last Name')
    email = forms.EmailField(max_length=150, help_text='Email')
    image = forms.ImageField(required=False)

    def __init__(self, *args, **kwargs):
        super(SignUpForm, self).__init__(*args, **kwargs)
        help_text = re.sub('<ul>', '', str(self.fields['password1'].help_text))
        help_text = re.sub('<li>','',help_text)
        help_text = re.sub('</li>', '\n', help_text)
        help_text = re.sub('</ul>', '', help_text)
        self.fields['password1'].help_text = help_text

    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email', 'image', 'password1', 'password2', )

class FischPictureForm(forms.Form):
    image = forms.ImageField()
    description = forms.CharField(
        widget=forms.Textarea(attrs={'placeholder': 'Please enter a brief description, e.g. City', 'class': 'form-control', "rows":"3"}),
        max_length=2000, required=True, label='')
    lat = forms.DecimalField()
    long = forms.DecimalField()

class EventForm(forms.Form):

    title = forms.CharField(widget = forms.Textarea(attrs={'placeholder': 'Please enter an event title.','class':'form-control', "rows":"1"}),
							  max_length = 100,required=True,label='')
    start = forms.DateTimeField(
        input_formats=['%d/%m/%Y %H:%M'],
        widget=BootstrapDateTimePickerInput())
    end = forms.DateTimeField(
        input_formats=['%d/%m/%Y %H:%M'],
        widget=BootstrapDateTimePickerInput())
    worldmap_image = forms.ImageField()
    hello = forms.CharField(widget = forms.Textarea(attrs={'placeholder': 'hello message','class':'form-control', "rows":"1"}),
							  max_length = 100,required=True,label='')
    message = forms.CharField(widget = forms.Textarea(attrs={'placeholder': 'message','class':'form-control', "rows":"3"}),
							  max_length = 2000,required=True,label='')
    location = forms.CharField(widget = forms.Textarea(attrs={'placeholder': 'location','class':'form-control', "rows":"1"}),
							  max_length = 100,required=True,label='')
    additional_text = forms.CharField(widget = forms.Textarea(attrs={'placeholder': 'additional text','class':'form-control', "rows":"1"}),
							  max_length = 100,required=True,label='')
    bye = forms.CharField(widget = forms.Textarea(attrs={'placeholder': 'goodbye message','class':'form-control', "rows":"1"}),
							  max_length = 100,required=True,label='')
    image = forms.ImageField()
    lat = forms.DecimalField(max_digits=20, decimal_places=9)
    long = forms.DecimalField(max_digits=20, decimal_places=9)

class UpdateSponsorForm(forms.ModelForm):

    bronze_sponsor = forms.IntegerField()
    silver_sponsor = forms.IntegerField()
    gold_sponsor = forms.IntegerField()
    black_sponsor = forms.IntegerField()
    diamond_sponsor = forms.IntegerField()

    class Meta:
        model = Sponsor
        fields = ('bronze_sponsor', 'silver_sponsor', 'gold_sponsor', 'black_sponsor', 'diamond_sponsor')

class NewSponsorForm(forms.ModelForm):
    first_name = forms.CharField(max_length=100, help_text='First Name')
    last_name = forms.CharField(max_length=100, help_text='Last Name')

    class Meta:
        model = Sponsor
        fields = ('first_name', 'last_name')

class NewSeasonForm(forms.Form):
    title = forms.CharField(widget = forms.Textarea(attrs={'placeholder': 'Enter a Season Title.','class':'form-control', "rows":"1"}),
							  max_length = 100,required=True,label='')
    image = forms.ImageField()
    max_donation = forms.IntegerField()

class SeasonItemForm(forms.Form):
    image = forms.ImageField()
    price = forms.IntegerField()

class NewEventProposalForm(forms.Form):
    location = forms.CharField(widget = forms.Textarea(attrs={'placeholder': 'location or country','class':'form-control', "rows":"1"}),
							  max_length = 50,required=True,label='')
    food = forms.CharField(widget = forms.Textarea(attrs={'placeholder': 'possible food','class':'form-control', "rows":"1"}),
							  max_length = 200,required=True,label='')
    drinks = forms.CharField(widget = forms.Textarea(attrs={'placeholder': 'possible drinks','class':'form-control', "rows":"1"}),
							  max_length = 200,required=True,label='')
    comments = forms.CharField(widget = forms.Textarea(attrs={'placeholder': 'additional comments','class':'form-control', "rows":"1"}),
							  max_length = 400,required=True,label='')

class NewItemProposalForm(forms.Form):
    name = forms.CharField(widget = forms.Textarea(attrs={'placeholder': 'name','class':'form-control', "rows":"1"}),
							  max_length = 50,required=True,label='')
    description = forms.CharField(widget = forms.Textarea(attrs={'placeholder': 'description','class':'form-control', "rows":"1"}),
							  max_length = 200,required=True,label='')
    image = forms.ImageField()
    comments = forms.CharField(widget = forms.Textarea(attrs={'placeholder': 'additional comments','class':'form-control', "rows":"1"}),
							  max_length = 400,required=True,label='')



