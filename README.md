# The Mindful Bear  
*A Mindfulness App Project in Collaboration with SGH*

### Dependencies
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