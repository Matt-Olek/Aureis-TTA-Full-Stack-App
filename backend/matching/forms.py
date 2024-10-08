from django import forms
from matching.models import Applicant


class ApplicantForm(forms.ModelForm):
    class Meta:
        model = Applicant
        fields = [
            "user",
            "resume",
            "first_name",
            "last_name",
            "email",
            "city",
            "country",
            "phone",
            "diploma",
            "target_educational_level",
            "duration",
            "contract_type",
            "sector",
            "location",
            "kilometers_away",
            "skills",
        ]
        widgets = {
            "resume": forms.ClearableFileInput(attrs={"class": "form-control"}),
            "first_name": forms.TextInput(attrs={"class": "form-control"}),
            "last_name": forms.TextInput(attrs={"class": "form-control"}),
            "email": forms.EmailInput(attrs={"class": "form-control"}),
            "city": forms.TextInput(attrs={"class": "form-control"}),
            "country": forms.TextInput(attrs={"class": "form-control"}),
            "phone": forms.TextInput(attrs={"class": "form-control"}),
            "diploma": forms.TextInput(attrs={"class": "form-control"}),
            "target_educational_level": forms.Select(attrs={"class": "form-control"}),
            "duration": forms.Select(attrs={"class": "form-control"}),
            "contract_type": forms.Select(attrs={"class": "form-control"}),
            "sector": forms.SelectMultiple(attrs={"class": "form-control"}),
            "location": forms.TextInput(attrs={"class": "form-control"}),
            "kilometers_away": forms.Select(attrs={"class": "form-control"}),
            "skills": forms.SelectMultiple(attrs={"class": "form-control"}),
        }
