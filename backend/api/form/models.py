from django.db import models

class Form(models.Model):
    form_name = models.CharField('Form Name', max_length=120)
    store_responses = models.BooleanField('Store Responses', null=False, default=False)
    is_compulsory = models.BooleanField('Is Compulsory?', null=False, default=False)
    is_presession = models.BooleanField('Is Pre-Session?', null=False, default=False)
    is_postsession = models.BooleanField('Is Post-Session?', null=False, default=False)

    def __str__(self):
        return str(self.id)


