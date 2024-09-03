from django.urls import path, include
import frontend.views as views

urlpatterns = [
    path('', views.index, name='index'),
    path('login/', views.user_login, name='login'),
    path('logout/', views.user_logout, name='logout'),
    path('register/', views.register, name='register'), 
    path('forgot-password/', views.forgot_password, name='forgot_password'),
    
    path('applicant_management/', views.applicant_management, name='applicant_management'),
    path('add_applicant/', views.add_applicant, name='add_applicant'),
    
    path('company_management/', views.company_management, name='company_management'),
    path('add_company/', views.add_company, name='add_company'),
    
    path('register-applicant/<str:token>/', views.register_applicant, name='register_applicant'),
]