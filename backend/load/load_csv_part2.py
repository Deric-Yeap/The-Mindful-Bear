import pandas as pd
# from sqlalchemy import create_engine
# import os
from load_csv_part1 import load_csv_files


# Part 2 tables (with dependencies)
part_2_tables = [
    'journal_journal.csv',
    'journal_journal_emotion_id.csv',
    # 'userSession_usersession_existing.csv',
    # 'userSession_usersession_mock.csv'
]


# Step 3: Load Part 2 tables (dependent on Part 1)
print("Loading Part 2 tables...")
load_csv_files(part_2_tables)

print("Data loading : Part 2 completed.")
