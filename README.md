# The Mindful Bear  
*A Mindfulness App Project in Collaboration with SGH*

### Dependencies
- **Python 3.12**: [Download here](https://www.python.org/downloads/)

---

### Initial Setup (One-time Only)

**1. Setting Up the Environment:**
   - Navigate to the backend directory:
     ```bash
     cd backend
     ```
   - Create a virtual environment:
     ```bash
     python3.12 -m venv venv
     ```

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

### Stopping the Application

**1. Exit the Environment:**
   - Deactivate the virtual environment:
     ```bash
     deactivate
     ```