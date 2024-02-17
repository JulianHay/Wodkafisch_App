from pages.models import *
from paypal_payment.models import *
from rest_framework import serializers
from django.contrib.auth import authenticate

class EventModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'

class PictureModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = FischPicture
        fields = '__all__'

class SeasonBadgeSerializer(serializers.RelatedField):
    def to_representation(self, value):
        return value.season_badge

class SponsorModelSerializer(serializers.ModelSerializer):
    season_badges = SeasonBadgeSerializer(many=True, read_only=True)

    class Meta:
        model = Sponsor
        fields = '__all__'

class HighscoreModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Highscore
        fields = '__all__'

class SeasonModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Season
        fields = '__all__'

class SeasonItemModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = SeasonItem
        fields = '__all__'
class DonationModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Donation
        fields = '__all__'

class PromoModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Promo
        fields = '__all__'
class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
    def create(self, clean_data):
        user = User.objects.create(email=clean_data['email'], password=clean_data['password'],first_name=clean_data['first_name'],last_name=clean_data['last_name'])
        user.username = clean_data['username']
        user.profile.first_name = clean_data['first_name']
        user.profile.last_name = clean_data['last_name']
        user.profile.email = clean_data['email']
        user.profile.image = clean_data['image']
        #user.is_active = False
        user.save()
        return user

    # from django.contrib.auth import password_validation
    #
    # def validate_password(self, value):
    #     password_validation.validate_password(value, self.instance)
    #     return value

class UserLoginSerializer(serializers.Serializer):
    #email = serializers.EmailField()
    username = serializers.CharField()
    password = serializers.CharField()
    ##
    def check_user(self, clean_data):
        user = authenticate(username=clean_data['username'], password=clean_data['password'])
        if not user:
            raise ValidationError('user not found')
        return user
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('email', 'username', 'first_name', 'last_name')

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

class AppInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppInfo
        fields = '__all__'