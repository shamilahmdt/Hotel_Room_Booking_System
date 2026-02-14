from django.db import models
from django.contrib.auth.models import AbstractUser
import random
from users.manager import UserManager


class User(AbstractUser):
    username = None
    email = models.EmailField(unique=True,max_length=256,error_messages={'unique' : 'Email is already exist'})
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    profile_image = models.ImageField(upload_to="profile_images/", blank=True, null=True)
    is_customer = models.BooleanField(default=False)
    is_store = models.BooleanField(default=False)
    is_agent = models.BooleanField(default=False)
    is_manager = models.BooleanField(default=False)

    otp = models.CharField(max_length=6,blank=True,null=True)
    is_verified = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    class Meta:
        db_table = 'User_Table'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        ordering = ['-id']

    def __str__(self):
        return self.email
    
    def generate_otp(self):
        self.otp = f'{random.randint(100000,999999)}'
        self.save()
