# Final Year Project
<div align="center">
   <img src="/readmeAssets/theMindfulBearLogo.png" width="200" alt="The Mindful Bear Logo"/>
</div>
<p align="center" style="margin-top: -15px;">A Mindfulness App Project in Collaboration with SGH</p>

<div align="justify">
The Mindful Bear is a comprehensive mobile wellness application designed for healthcare professionals at Singapore General Hospital, focusing on stress reduction and mindfulness enhancement. Built with React Native (Expo) and Django, it features guided mindfulness exercises, emotion-tracking journals with sentiment analysis, personalized article recommendations powered by semantic search, and an engaging avatar gacha system. The app employs advanced analytics to deliver actionable insights on user well-being, while maintaining high standards of data privacy and security. This solution aims to complement existing wellness programs by providing an accessible, scalable platform for mental health support in high-stress healthcare environments.
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

**3. Start the Servers:**
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
---

**5. Start the Andriod Emulator**
   - On another terminal:
   - ```bash
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
1.connect to instance
2.install aws cli and docker in instance
3.run
    ```bash
    aws configure     
     ```
- Access key ID,Secret access key can be found in ./general-developer_accessKeys.csv

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

## Deploy the Docker Container on Host

Log in to AWS ECR on the host machine:

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
# Contributors
<table>
    <tr>
        <td align="center"><img src="" width="150px"/><br /><sub><b>Bryen Yeoh</b></sub></a></td>
        <td align="center"><img src="" width="150px"/><br /><sub><b>Yeap Kian Lee Deric</b></sub></a></td>
        <td align="center"><img src="" width="150px"/><br /><sub><b>Poh Hui Min</b></sub></a></td>
        <td align="center"><img src="" width="150px"/><br /><sub><b>Tiffany Hu</b></sub></a></td>
        <td align="center"><img src="" width="150px"/><br /><sub><b>Lee Wan Qi</b></sub></a></td>
         <td align="center"><img src="" width="150px"/><br /><sub><b>Ong Wei Guang</b></sub></a></td>
    </tr>
</table>
See the logs:

```sh
docker logs -f mindfulbear_container_ssl
```
