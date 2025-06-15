import pandas as pd
from pymongo import MongoClient
import re

# Load Excel and clean column headers
df = pd.read_excel(r"c:\\Users\\LENOVO\\Downloads\\2024-25 - Internship Candidates Details form (Responses) (1).xlsx")
df.columns = df.columns.str.strip().str.replace("\\n", " ").str.replace("  ", " ", regex=False)

# MongoDB connection
client = MongoClient("mongodb://localhost:27017")
db = client["inter"]
student_collection = db["students"]
internship_collection = db["internships"]

# Function to safely get value
def get_safe_value(row, column, default=None):
    value = row.get(column, default)
    if pd.isna(value):
        return default
    if isinstance(value, str):
        return value.strip()
    return value

def convert_to_none_if_nat(value):
    return None if isinstance(value, pd.Timestamp) and pd.isna(value) else value

def parse_number(text):
    """Extract number from a string like '2 Months' or '15000'"""
    if pd.isna(text):
        return None
    try:
        return float(re.findall(r"\\d+(?:\\.\\d+)?", str(text))[0])
    except:
        return None

# Drop rows with missing essential fields
df_cleaned = df.dropna(subset=["Roll No.", "Name of the Student"], how="any")
df_cleaned = df_cleaned[df_cleaned["Roll No."].astype(str).str.strip() != ""]
df_cleaned.drop_duplicates(subset="Roll No.", inplace=True)

# Ensure timezone-free datetime
for column in ["Starting Date", "Ending Date", "Timestamp"]:
    if column in df_cleaned.columns:
        def safe_tz_localize(x):
            try:
                if isinstance(x, pd.Timestamp) and x.tzinfo:
                    return x.tz_localize(None)
                else:
                    return convert_to_none_if_nat(x)
            except Exception:
                return convert_to_none_if_nat(x)
        df_cleaned.loc[:, column] = df_cleaned[column].apply(safe_tz_localize)

# Map Student
def map_student(row):
    return {
        "rollNo": get_safe_value(row, "Roll No."),
        "name": get_safe_value(row, "Name of the Student"),
        "semester": get_safe_value(row, "Semester"),
        "email": get_safe_value(row, "Email-id of student"),
        "course": get_safe_value(row, "Course"),
        "branch": get_safe_value(row, "Branch"),
        "section": get_safe_value(row, "Section"),
        "phoneNo": str(get_safe_value(row, "Mobile Number of Student", "")).replace(" ", "").strip(),
        "academicYear": get_safe_value(row, "Academic Year"),
        "password": "password123",  # Default password, hashed in Mongoose pre-save
        "role": "student"
    }
# Map Internship
def map_internship(row):
    return {
        "internshipID": get_safe_value(row, "Roll No.") + "_internship",
        "startingDate": convert_to_none_if_nat(get_safe_value(row, "Starting Date")),
        "endingDate": convert_to_none_if_nat(get_safe_value(row, "Ending Date")),
        "offerLetter": get_safe_value(row, "Internship Offer Letter - RollNo_ol.pdf Example - 22071A0508_ol.pdf"),
        "applicationLetter": get_safe_value(row, "Application to HoD by student Letter - RollNo_iapp.pdf Example - 22071A0508_iapp.pdf"),
        "noc": get_safe_value(row, "NOC by  HoD to student - RollNo_inoc.pdf Example - 22071A0508_inoc.pdf"),
        "rollNumber": get_safe_value(row, "Roll No."),
        "role": get_safe_value(row, "Role of student in Company"),
        "organizationName": get_safe_value(row, "Name of the Organization for Internship"),
        "hrName": get_safe_value(row, "HR-Name or Name of the Point of Contact(Parent or HR)"),
        "hrEmail": get_safe_value(row, "email-id of point of contact in the organization of internship"),
        "hrPhone": parse_number(get_safe_value(row, "Mobile Number of point of contact in the organization of internship")),
        "duration": parse_number(get_safe_value(row, "Duration of Internship - Ex: 1 Month, 2 Months, 1.5 Months, 2.5 Months")),
        "package": parse_number(get_safe_value(row, "Pay Package  per month Eg: 15000, 20000 etc.")),
        "semester": get_safe_value(row, "Semester"),
        "branch": get_safe_value(row, "Branch"),
        "status": "Pending"
    }

# Convert to documents
students_all = df_cleaned.apply(map_student, axis=1).tolist()
internships = df_cleaned.apply(map_internship, axis=1).tolist()

# Fetch existing rollNo and email values
existing_rolls = set(x.get("rollNo") for x in student_collection.find({}, {"rollNo": 1}) if x.get("rollNo"))
existing_emails = set(x.get("email") for x in student_collection.find({}, {"email": 1}) if x.get("email"))


# Filter out students already in DB
students = [s for s in students_all if s["rollNo"] not in existing_rolls and s["email"] not in existing_emails]

# Insert into MongoDB
try:
    if students:
        student_collection.insert_many(students, ordered=False)
    if internships:
        internship_collection.insert_many(internships, ordered=False)
    print(f"\u2705 Inserted {len(students)} new students and {len(internships)} internships.")
except Exception as e:
    print(f"\u274C Error occurred during insertion: {e}")
