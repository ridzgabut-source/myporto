import urllib.request
import json
import os
import hashlib

def download_json(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as response:
        return json.loads(response.read())

bundle_url = "https://threeui.com/source-code/meng-to-sketchbook-landing-page.json"
print("Downloading bundle...")
bundle = download_json(bundle_url)

required_files = [
    "src/shaders/landing-pages/LandingPages.tsx",
    "src/shaders/landing-pages/pageTypography.ts",
    "src/shaders/landing-pages/pageRecipes.ts",
    "src/shaders/landing-pages/LandingPageFrame.tsx",
    "public/landing-pages/meng-to-sketchbook.html",
    "src/shaders/threeui.css"
]

dest_dir = "d:/myporto"

for file in bundle.get("files", []):
    path = file["path"]
    if path in required_files:
        print(f"Found {path}, extracting...")
        full_path = os.path.join(dest_dir, path)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        
        if "code" in file:
            with open(full_path, "w", encoding="utf-8", newline="") as f:
                f.write(file["code"])
        else:
            print(f"WARNING: No 'code' key for {path}. Skipping extraction from JSON.")
            continue
        
        # Verify SHA-256
        with open(full_path, "rb") as f:
            file_hash = hashlib.sha256(f.read()).hexdigest()
        print(f"SHA-256: {file_hash}")
        if file_hash == file.get("sha256"):
            print("Hash verified!")
        else:
            print(f"WARNING: Hash mismatch for {path}")
            print(f"Expected: {file.get('sha256')}")

print("Done extracting source files.")
