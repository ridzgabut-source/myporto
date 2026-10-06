import urllib.request
import re
import os
import hashlib

def download_file(url, dest_path):
    print(f"Downloading {url} to {dest_path}")
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req) as response:
            data = response.read()
            os.makedirs(os.path.dirname(dest_path), exist_ok=True)
            with open(dest_path, "wb") as f:
                f.write(data)
            return data
    except Exception as e:
        print(f"Failed to download {url}: {e}")
        return None

def verify_hash(data, expected_hash):
    actual_hash = hashlib.sha256(data).hexdigest()
    if actual_hash == expected_hash:
        print("Hash verified!")
    else:
        print(f"WARNING: Hash mismatch! Expected {expected_hash}, got {actual_hash}")

# Download the HTML file
html_path = "public/landing-pages/meng-to-sketchbook.html"
html_url = "https://threeui.com/landing-pages/meng-to-sketchbook.html"
html_expected_hash = "e0330548b1ac905cf1b81698163ffa29f8a3a8c39b8d39f9b71ba5b9255b6dd1"
data = download_file(html_url, os.path.join("d:/myporto", html_path))
if data:
    verify_hash(data, html_expected_hash)

# Parse prompt.md for binary assets
prompt_path = "d:/myporto/prompt.md"
with open(prompt_path, "r", encoding="utf-8") as f:
    content = f.read()

# Regex to match the markdown table for binary assets
pattern = r"\|\s*`(public/landing-pages/[^`]+)`\s*\|\s*[^|]+\s*\|\s*\d+\s*\|\s*`([a-f0-9]{64})`\s*\|"
matches = re.findall(pattern, content)

for path, expected_hash in matches:
    # Remove 'public/' for the URL
    url_path = path.replace("public/", "", 1)
    url = f"https://threeui.com/{url_path}"
    dest = os.path.join("d:/myporto", path)
    data = download_file(url, dest)
    if data:
        verify_hash(data, expected_hash)

print("Done downloading assets.")
