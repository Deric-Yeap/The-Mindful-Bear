# Generated by Django 5.1 on 2024-09-23 19:46

from django.db import migrations, models


class Migration(migrations.Migration):

    replaces = [('optionSet', '0001_initial'), ('optionSet', '0002_remove_optionset_questionid')]

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='OptionSet',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.CharField(max_length=100)),
            ],
        ),
    ]
