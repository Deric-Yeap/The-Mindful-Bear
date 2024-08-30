from django.db import models

class Form(models.Model):
    form_name = models.CharField('Form Name', max_length=120)
    store_responses = models.BooleanField('Store Responses', null=False, default=False)


    
    def __str__(self):
        return str(self.id)
    
    




