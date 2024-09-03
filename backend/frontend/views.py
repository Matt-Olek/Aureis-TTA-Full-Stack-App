from django.shortcuts import render
from django.shortcuts import redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from matching.models import Applicant, TempApplicant, Company, Sector, TempCompany
from matching.forms import ApplicantForm

# Home Views

def index(request):
    return render(request, 'frontend/index.html')

# Authentication Views

def user_login(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        # Authenticate User
        user = authenticate(username=email, password=password)
        print(user)
        if user is not None:
            login(request=request, user=user)
            return redirect('index')
        else:
            return render(request, 'frontend/login.html', {'error': 'Invalid Credentials'})                                                  
    return render(request, 'frontend/login.html')

@login_required
def user_logout(request):
    logout(request)
    return redirect('index')

def register(request):
    return render(request, 'frontend/register.html')

def forgot_password(request):
    return render(request, 'frontend/forgot-password.html')

def applicant_management(request):
    if request.user.is_superuser:
        if request.method == 'POST':
            first_name = request.POST.get('first_name')
            last_name = request.POST.get('last_name')
            email = request.POST.get('email')
            
            temp_applicant = TempApplicant(first_name=first_name, last_name=last_name, email=email)
            temp_applicant.save()
            # Send email to user
            
            return redirect('applicant_management')
        all_applicants = Applicant.objects.all()
        temp_applicants = TempApplicant.objects.filter(applicant=None)
        return render(request, 'admin_dashboard/applicant_management.html', {'applicants': all_applicants, 'temp_applicants': temp_applicants})
    else:
        return render(request, 'frontend/login.html', {'error': 'You are not authorized to view this page'})

@login_required
def add_applicant(request):
    if request.user.is_superuser:
        print(request.method)
        if request.method == 'POST':
            first_name = request.POST.get('first_name')
            last_name = request.POST.get('last_name')
            email = request.POST.get('email')
            
            temp_applicant = TempApplicant(first_name=first_name, last_name=last_name, email=email)
            temp_applicant.save()
            # Send email to user
            
            return redirect('applicant_management')
        return render(request, 'admin_dashboard/applicant_management.html')
    else:
        return render(request, 'frontend/login.html', {'error': 'You are not authorized to view this page'})


@login_required
def company_management(request):
    if request.user.is_superuser:
        if request.method == 'POST':
            name = request.POST.get('name')
            email = request.POST.get('email')
            
            temp_company = TempCompany(name=name, email=email)
            temp_company.save()
            # Send email to user
            
            return redirect('company_management')
        all_companies = Company.objects.all()
        temp_companies = TempCompany.objects.filter(company=None)
        return render(request, 'admin_dashboard/company_management.html', {'companies': all_companies, 'temp_companies': temp_companies})
    else:
        return render(request, 'frontend/login.html', {'error': 'You are not authorized to view this page'})
    
@login_required
def add_company(request):
    if request.user.is_superuser:
        if request.method == 'POST':
            name = request.POST.get('name')
            email = request.POST.get('email')
            
            temp_company = TempCompany(name=name, email=email)
            temp_company.save()
            # Send email to user
            
            return redirect('company_management')
        return render(request, 'admin_dashboard/company_management.html')
    else:
        return render(request, 'frontend/login.html', {'error': 'You are not authorized to view this page'})
    
    
def register_applicant(request, token):
    temp_applicant = TempApplicant.objects.get(token=token)
    if request.method == 'POST':
        form = ApplicantForm(request.POST)
        if form.is_valid():
            applicant = form.save()
            temp_applicant.applicant = applicant
            temp_applicant.save()
        
        return redirect('index')
    sectors = Sector.objects.all()
    return render(request, 'frontend/register-applicant.html', {'temp_applicant': temp_applicant, 'form': ApplicantForm()})