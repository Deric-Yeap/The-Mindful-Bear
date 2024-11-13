# Use the official Python image from the Docker Hub
FROM python:3.9-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV PYTHONPATH="/app/backend"
ENV NLTK_DATA=/usr/share/nltk_data

# Set the working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Install NLTK and download data to the specified NLTK data path
RUN pip install --upgrade pip
RUN pip install nltk==3.8.1
RUN mkdir -p /usr/share/nltk_data
RUN python -m nltk.downloader -d /usr/share/nltk_data punkt wordnet stopwords averaged_perceptron_tagger

# Set permissions to ensure data is readable
RUN chmod -R 755 /usr/share/nltk_data

# Copy the Django project and related files
COPY backend /app/backend
COPY .env /app/
COPY sslprivate_key.pem /app/
COPY sslcert.pem /app/
COPY private_key.pem /app/

# Install Python dependencies

RUN pip install -r /app/backend/requirements.txt

# Expose the port the app runs on
EXPOSE 443

# Start Gunicorn with the NLTK data path explicitly set in case the environment variable doesn't propagate
CMD ["sh", "-c", "export NLTK_DATA=/usr/share/nltk_data && gunicorn --bind 0.0.0.0:443 --certfile=/app/sslcert.pem --keyfile=/app/sslprivate_key.pem --chdir /app/backend --timeout 120 --access-logfile '-' --error-logfile '-' backend.wsgi:application"]
