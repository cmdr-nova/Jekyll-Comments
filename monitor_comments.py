import time
import json
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

# Ensure the paths are correct
COMMENTS_FILE = os.path.join(os.path.dirname(__file__), 'comments.json')
EMAIL_ADDRESS = 'your@gmail.com'
EMAIL_PASSWORD = 'app pass word'
SMTP_SERVER = 'smtp.gmail.com'
SMTP_PORT = 587

def get_comments():
    try:
        with open(COMMENTS_FILE, 'r') as file:
            return json.load(file)
    except json.JSONDecodeError:
        print(f"Error reading comments file: File is empty or malformed")
        return {}
    except Exception as e:
        print(f"Error reading comments file: {e}")
        return {}

def send_email(comment):
    msg = MIMEMultipart()
    msg['From'] = EMAIL_ADDRESS
    msg['To'] = EMAIL_ADDRESS
    msg['Subject'] = 'New Comment on Your Blog'

    body = f"New comment by {comment['author']}:\n\n{comment['content']}\n\nFediverse: {comment.get('fediverse', 'N/A')}"
    msg.attach(MIMEText(body, 'plain'))

    try:
        print("Attempting to send email...")
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
        text = msg.as_string()
        server.sendmail(EMAIL_ADDRESS, EMAIL_ADDRESS, text)
        server.quit()
        print("Email sent successfully")
    except Exception as e:
        print(f"Error sending email: {e}")

def check_for_new_comments(last_comments):
    current_comments = get_comments()
    new_comments = []

    for post_id, post_comments in current_comments.items():
        if post_id in last_comments:
            if len(post_comments) > len(last_comments[post_id]):
                new_comments.extend(post_comments[len(last_comments[post_id]):])
        else:
            new_comments.extend(post_comments)

    for new_comment in new_comments:
        print(f"New comment detected: {new_comment}")
        send_email(new_comment)

    return current_comments

if __name__ == "__main__":
    last_comments = get_comments()
    print(f"Initial comment count: {sum(len(comments) for comments in last_comments.values())}")

    while True:
        last_comments = check_for_new_comments(last_comments)
        time.sleep(60)  # Check every 60 seconds

