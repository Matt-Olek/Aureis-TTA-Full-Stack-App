from pathlib import Path
from datetime import timedelta
import os
from dotenv import load_dotenv

load_dotenv()
# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "django-insecure-tneln6)=bhhbk131(h)hy+2p6t(7z^maepx_^e+3_6kr7!_v6p"

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = [
    "localhost",
    "127.0.0.1",
    "37.187.49.148",
    "django",
    "nginx",
    "tta-ecole.com",
]

DOMAIN = os.getenv("DOMAIN", "http://localhost:5173")

STATIC_ROOT = BASE_DIR / "static"

# Application definition
INSTALLED_APPS = [
    "daphne",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "corsheaders",
    "django_filters",
    "api",  # App
    "frontend",  # App
    "matching",  # App
    "rest_framework_simplejwt",
]

# CORS configuration
CORS_ALLOWED_ORIGINS = [
    "http://37.187.49.148",  # Your frontend URL
    "http://localhost:5173",  # If you're also running locally for development
    "https://tta-ecole.com",
    "https://www.tta-ecole.com",
    "http://tta-ecole.com",
]


CORS_ALLOW_CREDENTIALS = True

# Security settings
SESSION_COOKIE_SECURE = False  # Change to True in production with HTTPS
SESSION_COOKIE_AGE = 1209600  # 2 weeks in seconds

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",  # Ensure security headers are applied first
    "corsheaders.middleware.CorsMiddleware",  # CORS middleware after SecurityMiddleware
    "django.contrib.sessions.middleware.SessionMiddleware",  # Handles session management
    "django.middleware.common.CommonMiddleware",  # Basic request/response management
    "django.middleware.csrf.CsrfViewMiddleware",  # Handles CSRF protection
    "django.contrib.auth.middleware.AuthenticationMiddleware",  # Handles user authentication
    "django.contrib.messages.middleware.MessageMiddleware",  # Enables Django's messaging framework
    "django.middleware.clickjacking.XFrameOptionsMiddleware",  # Protects against clickjacking
]


ROOT_URLCONF = "app.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "app.wsgi.application"

# Database
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

SESSION_ENGINE = "django.contrib.sessions.backends.db"

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

# Internationalization
LANGUAGE_CODE = "fr"
TIME_ZONE = "Europe/Paris"
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = "static/"

# Default primary key field type
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# REST Framework settings
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
}

AUTHENTICATION_BACKENDS = ("api.backend.EmailBackend",)
# JWT settings
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=360),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "UPDATE_LAST_LOGIN": False,
    "ALGORITHM": "HS256",
    "SIGNING_KEY": SECRET_KEY,
    "VERIFYING_KEY": None,
    "AUDIENCE": None,
    "ISSUER": None,
    "AUTH_HEADER_TYPES": ("Bearer",),
    "USER_ID_FIELD": "id",
    "USER_ID_CLAIM": "user_id",
    "AUTH_TOKEN_CLASSES": ("rest_framework_simplejwt.tokens.AccessToken",),
    "TOKEN_TYPE_CLAIM": "token_type",
}

# User model
AUTH_USER_MODEL = "api.CustomUser"

# Email settings
# EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"  # Change to "django.core.mail.backends.smtp.EmailBackend" in production
EMAIL_HOST = "smtp.gmail.com"
EMAIL_PORT = 587
EMAIL_HOST_USER = "trouvetonalternanceweb@gmail.com"
EMAIL_HOST_PASSWORD = "dgfw ycov trzq mpvi"
DEFAULT_FROM_EMAIL = "trouvetonalternanceweb@gmail.com"
EMAIL_USE_TLS = True  # Use TLS instead of SSL for Gmail

ASGI_APPLICATION = "app.asgi.application"
