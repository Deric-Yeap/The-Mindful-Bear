<div align="center">
   <img src="/readmeAssets/theMindfulBearLogo.png" width="200" alt="The Mindful Bear Logo"/>
</div>
<p align="center" style="margin-top: -15px;">A Mindfulness App Project in Collaboration with SGH</p>

<div align="justify">
The Mindful Bear is a comprehensive mobile wellness application designed for healthcare professionals at Singapore General Hospital, focusing on stress reduction and mindfulness enhancement. Built with React Native (Expo) and Django, it features guided mindfulness exercises, emotion-tracking journals with sentiment analysis, personalized article recommendations powered by semantic search, and an engaging avatar gacha system. The app employs advanced analytics to deliver actionable insights on user well-being, while maintaining high standards of data privacy and security. This solution aims to complement existing wellness programs by providing an accessible, scalable platform for mental health support in high-stress healthcare environments.
<br/><br/>

</div>

# Solution Architechture
<p align="center">
<img src="/readmeAssets/solutionArchitecture.png" style="border-radius:10px">
</p>

# Tools and Technologies
<p align="center">
<img src="/readmeAssets/toolsAndTechnologies.png" style="border-radius:10px">
</p>

# Dependencies
- **Python 3.12**: [Download here](https://www.python.org/downloads/)
- **Android Studio**: [Download here](https://developer.android.com/studio)
- **NodeJS**: [Download here](https://nodejs.org/en)
- **JavaJDK 22**: [Download here](https://www.oracle.com/java/technologies/downloads/?er=221886#jdk22)
- **Environment Files**: 
  The-MINDFUL_BEAR/:
    - .env
    - private_key.pem
    - public_key.pem
    - general-developer_accessKeys.csv
    - general-developer_credentials.csv
    - frontend/.env
---

### Initial Setup (One-time Only)

**1. Set Up the Environment:**
   - Navigate to the backend directory:
     ```bash
     cd backend
     ```
   - Create a virtual environment:
     ```bash
     python -m venv venv
     ```
**2. Set up the mobile android emulator and ANDROID_HOME environment variable:**
   - https://docs.expo.dev/get-started/set-up-your-environment/?platform=android&device=simulated&mode=development-build&buildEnv=local
   

---

### Running the Application

**1. Activate the Environment (if not already activated):**
   - macOS/Linux:
     ```bash
     source venv/bin/activate
     ```
   - Windows:
     ```bash
     venv\Scripts\activate
     ```

**2. Install Dependencies:**
   - Ensure all dependencies are installed:
     ```bash
     pip install -r requirements.txt
     ```

**3. Start the Server:**
   - Apply database migrations:
     ```bash
     python manage.py migrate
     ```
   - Run the development server:
     ```bash
     python manage.py runserver
     ```

**4. Verify:**
   - Django administration can be found at http://127.0.0.1:8000/admin/
   - API Documentation can be found at http://127.0.0.1:8000/redoc/


**5. Start the Application on Andriod Emulator**
   - On another terminal:
     ```bash
     cd frontend
     npm install
     npx expo run:android
     ```    

### Stopping the Application

**1. Exit the Environment:**
   - Deactivate the virtual environment:
     ```bash
     deactivate
     ```

## Deployment setup (AWS EC2)

**1. Connect to instance through console:**

https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-connect-methods.html

**2.Install AWS CLI and Docker in instance**
 
### Installing Docker
1. **Update the package list**:
   ```bash
   sudo apt update
   ```

2. **Install prerequisites**:
   ```bash
   sudo apt install -y apt-transport-https ca-certificates curl software-properties-common
   ```

3. **Add Docker’s official GPG key**:
   ```bash
   curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
   ```

4. **Add the Docker repository**:
   ```bash
   echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
   ```

5. **Update the package list again**:
   ```bash
   sudo apt update
   ```

6. **Install Docker**:
   ```bash
   sudo apt install -y docker-ce
   ```

7. **Start and enable Docker**:
   ```bash
   sudo systemctl start docker
   sudo systemctl enable docker
   ```

8. **Add your user to the Docker group** (optional, for running Docker without `sudo`):
   ```bash
   sudo usermod -aG docker ${USER}
   ```

9. **Verify the installation**:
   ```bash
   docker --version
   ```

---

### Installing AWS CLI
1. **Update the system**:
   ```bash
   sudo apt update
   ```

2. **Install dependencies**:
   ```bash
   sudo apt install -y unzip curl
   ```

3. **Download the AWS CLI installer**:
   ```bash
   curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
   ```

4. **Unzip the installer**:
   ```bash
   unzip awscliv2.zip
   ```

5. **Run the installation script**:
   ```bash
   sudo ./aws/install
   ```

6. **Verify the installation**:
   ```bash
   aws --version
   ```

7. **Configure AWS CLI**:
   ```bash
   aws configure
   ```

**3.Configure AWS Account Credentials**

    aws configure     

Access key ID and Secret access key can be found in ./general-developer_accessKeys.csv


## Deployment

### Build and Push Docker Image (Backend) to AWS ECR

First, log in to the AWS ECR registry. Replace `{version}` with your specific version (e.g., `UAT1.3`).

```sh
aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin 010928205024.dkr.ecr.ap-southeast-1.amazonaws.com
```

Next, build the Docker image:

```sh
docker build -t themindfulbear:{version} .
```

Tag the newly created image for ECR:

```sh
docker tag themindfulbear:{version} 010928205024.dkr.ecr.ap-southeast-1.amazonaws.com/themindfulbear:{version}
```

Push the Docker image to AWS ECR:

```sh
docker push 010928205024.dkr.ecr.ap-southeast-1.amazonaws.com/themindfulbear:{version}
```

## Deploy the Docker Container on EC2 Instance

Log in to AWS ECR on the EC2 Instance:

```sh
aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin 010928205024.dkr.ecr.ap-southeast-1.amazonaws.com
```

Pull the latest image from AWS ECR:

```sh
docker pull 010928205024.dkr.ecr.ap-southeast-1.amazonaws.com/themindfulbear:{version}
```

Stop the existing container (if running):

```sh
docker stop mindfulbear_container_ssl
```

Remove the old container:

```sh
docker rm mindfulbear_container_ssl
```

Remove the old images:

```sh
docker images
docker rmi {image_id}
```

Run the new container with SSL enabled:

```sh
docker run -d --name mindfulbear_container_ssl -p 443:443 --restart always 010928205024.dkr.ecr.ap-southeast-1.amazonaws.com/themindfulbear:{version}
```

See the logs:

```sh
docker logs -f mindfulbear_container_ssl
```
