from django.db import models
from django.conf import settings

class Customer(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="customer_profile"
    )
    address = models.CharField(max_length=255, null=True, blank=True)
    
    class Meta:
        db_table = 'Customer_Table'
        verbose_name = 'Customer'
        verbose_name_plural = 'Customers'
        ordering = ['-id']

    def __str__(self):
        return self.customer_name or "Unnamed Customer"



