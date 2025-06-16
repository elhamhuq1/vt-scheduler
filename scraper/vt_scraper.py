import requests
from bs4 import BeautifulSoup
import json
import time

# 🔹 Step 1: Get list of subject codes (departments)
def get_subject_codes():
    return [
    "AAD", "AAEC", "ACIS", "ADS", "ADV", "AFST", "AHRM", "AINS", "AIS", "ALCE", "ALS", "AOE", "APS", "APSC", "ARBC", "ARCH", "ART", "AS",
    "ASPT", "AT", "BC", "BCHM", "BDS", "BIOL", "BIT", "BMES", "BMSP", "BMVS", "BSE", "CEE", "CEM", "CHE", "CHEM", "CHN", "CINE", "CLA", 
    "CMDA", "CMST", "CNST", "COMM", "CONS", "COS", "CRIM", "CS", "CSES", "DANC", "DASC", "ECE", "ECON", "EDCI", "EDCO", "EDCT", "EDEL", 
    "EDEP", "EDHE", "EDIT", "EDP", "EDRE", "EDTE", "ENGE", "ENGL", "ENGR", "ENSC", "ENT", "ESM", "FIN", "FIW", "FL", "FMD", "FR", "FREC", 
    "FST", "GBCB", "GEOG", "GEOS", "GER", "GIA", "GR", "GRAD", "HD", "HEB", "HIST", "HNFE", "HORT", "HTM", "HUM", "IDS", "IS", "ISC", "ISE", 
    "ITAL", "ITDS", "JMC", "JPN", "JUD", "LAHS", "LAR", "LAT", "LDRS", "MACR", "MATH", "ME", "MGT", "MINE", "MKTG", "MN", "MS", "MSE", "MTRG", 
    "MUS", "NANO", "NEUR", "NR", "NSEG", "PAPA", "PHIL", "PHS", "PHYS", "PM", "PORT", "PPE", "PPWS", "PR", "PSCI", "PSVP", "PSYC", "REAL", 
    "RED", "RLCL", "RTM", "RUS", "SBIO", "SOC", "SPAN", "SPES", "SPIA", "STAT", "STL", "STS", "SYSB", "TA", "TBMH", "UAP", "UH", "UNIV", "VM", 
    "WATR", "WGS"
]




# 🔹 Step 2: Fetch course HTML for a subject code
def fetch_courses_by_subject(subj_code):
    data = {
        'CAMPUS': '0',
        'TERMYEAR': '202509',
        'CORE_CODE': 'AR%',
        'subj_code': subj_code,
        'SCHDTYPE': '%',
        'CRSE_NUMBER': '',
        'crn': '',
        'open_only': '',
        'disp_comments_in': 'Y',
        'sess_code': '%',
        'BTN_PRESSED': 'FIND class sections',
        'inst_name': '',
    }

    headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0',
    }

    response = requests.post(
        'https://selfservice.banner.vt.edu/ssb/HZSKVTSC.P_ProcRequest',
        headers=headers,
        data=data
    )

    return response.text


# 🔹 Step 3: Loop over all subjects, collect data
def main():
    all_courses = {}
    subject_codes = get_subject_codes()

    print(f"Found {len(subject_codes)} subjects. Scraping...")

    for code in subject_codes:
        print(f"Fetching: {code}")
        html = fetch_courses_by_subject(code)

        # Store raw HTML per subject (or parse later)
        all_courses[code] = html

        time.sleep(1)  # avoid overloading the server

    # 🔹 Save result to file
    with open("all_courses_raw.json", "w", encoding="utf-8") as f:
        json.dump(all_courses, f, indent=2)

    print("Done! Saved to all_courses_raw.json")


# 🔹 Entry point
if __name__ == "__main__":
    main()