# Generated by Django 5.0.7 on 2024-09-11 10:10

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("emotion", "0004_alter_emotion_value"),
        ("journal", "0003_rename_audio_to_text_journal_journal_text"),
    ]

    operations = [
        migrations.AlterField(
            model_name="journal",
            name="emotion_id",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to="emotion.emotion"
            ),
        ),
    ]
