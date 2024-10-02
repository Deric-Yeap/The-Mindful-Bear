# Use the official Python image from the Docker Hub
FROM python:3.9-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV PYTHONPATH="/app/backend" 

# Set the working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Copy the Django project
COPY backend /app/backend
COPY .env /app/
COPY private_key.pem /app/

# Install Python dependencies
RUN pip install --upgrade pip
RUN pip install -r /app/backend/requirements.txt

# Expose the port the app runs on
EXPOSE 8000

# Run the Django development server
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--chdir", "/app/backend", "backend.wsgi:application"]

