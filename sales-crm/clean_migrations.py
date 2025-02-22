import os
import shutil

def clean_migrations():
    # Get all app directories
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Delete db.sqlite3 if it exists
    db_path = os.path.join(base_dir, 'db.sqlite3')
    if os.path.exists(db_path):
        os.remove(db_path)
        print("Removed db.sqlite3")

    # Walk through all directories
    for root, dirs, files in os.walk(base_dir):
        if 'migrations' in dirs:
            migrations_dir = os.path.join(root, 'migrations')
            # Remove all files in migrations except __init__.py
            for filename in os.listdir(migrations_dir):
                if filename != '__init__.py':
                    file_path = os.path.join(migrations_dir, filename)
                    if os.path.isfile(file_path):
                        os.remove(file_path)
                        print(f"Removed {file_path}")

if __name__ == "__main__":
    clean_migrations()
