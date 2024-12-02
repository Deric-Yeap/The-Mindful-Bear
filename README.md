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

1. **Python 3.12** 
   Required for running backend scripts and managing dependencies.  
   [Download Python 3.12](https://www.python.org/downloads/)

2. **Android Studio**  
   Necessary for Android development and testing.  
   [Download Android Studio](https://developer.android.com/studio)

3. **Node.js**  
   Used for managing frontend dependencies and building the application.  
   [Download Node.js](https://nodejs.org/en)

4. **Java JDK 22**  
   Required for building Android apps.  
   [Download Java JDK 22](https://www.oracle.com/java/technologies/downloads/?er=221886#jdk22)

5. **Environment Files**  
   The project folder `THE-MINDFUL_BEAR/` must include the following files:
   - `.env`: Environment configuration file for the backend.
   - `private_key.pem`: Private key for secure communications.
   - `public_key.pem`: Public key for secure communications.
   - `general-developer_accessKeys.csv`: Access keys for AWS or other services.
   - `general-developer_credentials.csv`: Developer credentials.
   - `frontend/.env`: Environment configuration file for the frontend.

6. **Domain**  
   The project uses the domain: **themindfulbear.xyz**.  

    #### Configuration:
   - Create an **A Record** in the domain's DNS settings:
     - **Name**: `@`
     - **Type**: `A`
     - **Value**: `<EC2 Instance Public IP>`
   - Ensure the DNS record points the domain to the EC2 instance's public IP.

   Certificates for SSL encryption (enables HTTPS) must be generated with the following files placed in THE-MINDFUL_BEAR/:
   - `sslprivate_key.pem`: used as the private key for SSL.
   - `sslcert.pem`: used as the SSL certificate.

---

## Initial Setup (One-time Only)

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

## Running the Application

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

- https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-connect-methods.html

**2. Install AWS CLI and Docker in instance**
 
#### Installing Docker
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
  - After this, log out and back in for the group change to take effect

---

####  Installing AWS CLI
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

**3. Configure AWS Account Credentials**

    aws configure     

Access key ID and Secret access key can be found in ./general-developer_accessKeys.csv

## Deployment (Backend)

### Build and Push Docker Image to ECR

1. Log in to the AWS ECR registry. Replace `{version}` with your specific version (e.g., `UAT1.3`):
   ```sh
   aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin 010928205024.dkr.ecr.ap-southeast-1.amazonaws.com
   ```

2. Build the Docker image:
   ```sh
   docker build -t themindfulbear:{version} .
   ```

3. Tag the newly created image for ECR:
   ```sh
   docker tag themindfulbear:{version} 010928205024.dkr.ecr.ap-southeast-1.amazonaws.com/themindfulbear:{version}
   ```

4. Push the Docker image to AWS ECR:
   ```sh
   docker push 010928205024.dkr.ecr.ap-southeast-1.amazonaws.com/themindfulbear:{version}
   ```

---

## Retrieve Image and Deploy Application on EC2 Instance

1. Log in to AWS ECR on the EC2 Instance:
   ```sh
   aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin 010928205024.dkr.ecr.ap-southeast-1.amazonaws.com
   ```

2. Pull the latest image from AWS ECR:
   ```sh
   docker pull 010928205024.dkr.ecr.ap-southeast-1.amazonaws.com/themindfulbear:{version}
   ```

3. Stop the existing container (if running):
   ```sh
   docker stop mindfulbear_container_ssl
   ```

4. Remove the old container:
   ```sh
   docker rm mindfulbear_container_ssl
   ```

5. Remove the old images:
   ```sh
   docker images
   docker rmi {image_id}
   ```

6. Run the new container with SSL enabled:
   ```sh
   docker run -d --name mindfulbear_container_ssl -p 443:443 --restart always 010928205024.dkr.ecr.ap-southeast-1.amazonaws.com/themindfulbear:{version}
   ```

7. See the logs:
   ```sh
   docker logs -f mindfulbear_container_ssl
   ```