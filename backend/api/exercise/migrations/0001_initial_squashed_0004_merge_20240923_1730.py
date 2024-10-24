# Generated by Django 5.1 on 2024-09-23 17:50

from django.db import migrations, models


class Migration(migrations.Migration):

    replaces = [('exercise', '0001_initial'), ('exercise', '0002_exercise_exercise_name'), ('exercise', '0003_alter_exercise_description'), ('exercise', '0003_alter_exercise_audio_url'), ('exercise', '0004_merge_20240923_1730')]

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Exercise',
            fields=[
                ('exercise_id', models.AutoField(primary_key=True, serialize=False)),
                ('audio_url', models.CharField(max_length=250)),
                ('description', models.TextField(default='null')),
                ('exercise_name', models.CharField(default='testExercise', max_length=250)),
            ],
        ),
    ]
