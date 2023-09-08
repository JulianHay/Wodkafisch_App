from django.views.generic import FormView
from django.urls import reverse
#from paypal.standard.forms import PayPalPaymentsForm
from django import forms
from pages.widgets import BootstrapDateTimePickerInput

# class PaypalFormView(FormView):
#     template_name = 'paypal_form.html'
#     form_class = PayPalPaymentsForm
#
#     def get_initial(self):
#         return {
#             'business': 'your-paypal-business-address@example.com',
#             'amount': 20,
#             'currency_code': 'EUR',
#             'item_name': 'Example item',
#             'invoice': 1234,
#             'notify_url': self.request.build_absolute_uri(reverse('paypal-ipn')),
#             'return_url': self.request.build_absolute_uri(reverse('paypal-return')),
#             'cancel_return': self.request.build_absolute_uri(reverse('paypal-cancel')),
#             'lc': 'EN',
#             'no_shipping': '1',
#         }

class NewDonationForm(forms.Form):
    first_name = forms.CharField(max_length=100, help_text='First Name')
    last_name = forms.CharField(max_length=100, help_text='Last Name')
    donation = forms.FloatField()

class NewPromoForm(forms.Form):
    value = forms.DecimalField(max_digits=5, decimal_places=2)
    date = forms.DateTimeField(
        input_formats=['%d/%m/%Y %H:%M'],
        widget=BootstrapDateTimePickerInput())