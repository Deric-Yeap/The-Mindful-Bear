# Generated by Django 5.1 on 2024-09-10 11:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('form', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='form',
            name='is_compulsory',
            field=models.BooleanField(default=False, verbose_name='Is Compulsory?'),
        ),
        migrations.AddField(
            model_name='form',
            name='is_postsession',
            field=models.BooleanField(default=False, verbose_name='Is Post-Session?'),
        ),
        migrations.AddField(
            model_name='form',
            name='is_presession',
            field=models.BooleanField(default=False, verbose_name='Is Pre-Session?'),
        ),
    ]
