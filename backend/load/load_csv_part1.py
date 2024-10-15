import pandas as pd
from sqlalchemy import create_engine
import os

# Path to your SQLite database
sqlite_file = 'db.sqlite3'
engine = create_engine(f'sqlite:///{sqlite_file}')

csv_folder = 'csv'
# Define tables for initial loading without dependencies
initial_tables = [
    # 'auth_group.csv',
    # 'django_content_type.csv',
    # 'auth_permission.csv',
    # 'auth_group_permissions.csv',
    # 'user_customuser_existing.csv',
    # 'user_customuser_mock.csv',
    # 'django_migrations.csv',
    # # 'django_admin_log.csv',
    # 'user_customuser_groups_existing.csv',
    # 'user_customuser_groups_mock.csv',
    # 'color_color.csv'
]



# Part 1 tables (independent and with dependencies)
part_1_tables = [
    # 'emotion_emotion.csv',
    # 'gender_gender.csv',
    # 'department_department.csv',
    # 'optionSet_optionset.csv',
    # 'option_option.csv',
    # 'question_question.csv',
    # 'session_session_existing.csv',
    'session_session_mock.csv',
    # 'form_form.csv',
    # 'formQuestion_formquestion.csv',
    # 'exercise_exercise.csv',
    # 'landmark_landmark.csv'
]



# Function to load data from a list of CSV files
def load_csv_files(file_list):
    for csv_file in file_list:
        try:
            # Construct the full path to the CSV file
            full_path = os.path.join(csv_folder, csv_file)
            
            # Read the CSV file
            df = pd.read_csv(full_path)  # Reading CSV
            
            # Determine the table name based on the file name
            if '_existing' in csv_file:
                table_name = csv_file.split('_existing')[0]  # Get the prefix
            elif '_mock' in csv_file:
                table_name = csv_file.split('_mock')[0]  # Get the prefix
            else:
                table_name = os.path.splitext(csv_file)[0]  # Get the file name without extension
            
            # Write to SQLite
            df.to_sql(table_name, con=engine, if_exists='append', index=False)
            
            print(f"Successfully loaded data from {csv_file} into the table '{table_name}'.")
        except Exception as e:
            print(f"Failed to load data from {csv_file}: {e}")

# Step 1: Load initial tables
print("Loading initial tables...")
load_csv_files(initial_tables)

# # Step 2: Load Part 1 tables
print("Loading Part 1 tables...")
load_csv_files(part_1_tables)

print("Data loading : Part 1 completed.")
