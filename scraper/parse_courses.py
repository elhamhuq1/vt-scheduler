import json
import re
from bs4 import BeautifulSoup

with open("all_courses_raw.json", "r", encoding="utf-8") as f:
    raw_data = json.load(f)

parsed_courses = []

for subject_code, html in raw_data.items():
    soup = BeautifulSoup(html, "html.parser")
    rows = soup.find_all("tr")

    for row in rows:
        cols = row.find_all("td")

        # ✅ Handle comment rows first
        if len(cols) >= 2 and "Comments for CRN" in cols[0].get_text():
            try:
                # Extract CRN from first column
                match = re.search(r"CRN (\d+):", cols[0].get_text())
                if match:
                    crn_target = match.group(1)
                    # Combine all <b> tags in the second column
                    comment_bolds = cols[1].find_all("b")
                    comment_text = " ".join(tag.get_text(strip=True) for tag in comment_bolds)

                    # Attach to last-matching course
                    for course in reversed(parsed_courses):
                        if course["crn"] == crn_target:
                            course["comments"] = comment_text
                            break
            except Exception as e:
                print(f"Error processing comment row: {e}")
            continue  # ✅ Skip to next row

        # ✅ Handle regular course rows
        if len(cols) < 12:
            continue

        try:
            crn_tag = cols[0].find("b")
            crn = crn_tag.get_text(strip=True) if crn_tag else cols[0].get_text(strip=True)
            course_full = cols[1].get_text(strip=True)
            subject, course_number = course_full.split('-')
            title = cols[2].get_text(strip=True)
            modality = cols[4].get_text(strip=True)
            credit_hours = cols[5].get_text(strip=True)
            capacity_text = cols[6].get_text(strip=True)
            capacity = int(capacity_text) if capacity_text.isdigit() else 0
            instructor = cols[7].get_text(strip=True)
            days = cols[8].get_text(strip=True)
            begin_time = cols[9].get_text(strip=True)
            end_time = cols[10].get_text(strip=True)
            location = cols[11].get_text(strip=True)

            parsed_courses.append({
                "crn": crn,
                "subject": subject,
                "course_number": course_number,
                "title": title,
                "modality": modality,
                "credit_hours": credit_hours,
                "capacity": capacity,
                "instructor": instructor,
                "days": days,
                "begin_time": begin_time,
                "end_time": end_time,
                "location": location,
                "comments": ""
            })

        except Exception as e:
            print(f"Skipping row due to error: {e}")
            continue

# ✅ Save final parsed data
with open("courses.json", "w", encoding="utf-8") as out:
    json.dump(parsed_courses, out, indent=2)

print(f"Parsed and saved {len(parsed_courses)} courses.")
