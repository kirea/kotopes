import os
import re
from urllib.parse import urlparse, unquote

def test_static_files():
    root_dir = "/Users/eugenekirvas/Projects/Daria-Diploma/repo/kotopes"
    html_files = []
    
    # 1. Find all HTML files
    for root, dirs, files in os.walk(root_dir):
        if "node_modules" in root or ".git" in root or ".idea" in root or ".agents" in root or ".claude" in root or "docs" in root:
            continue
        for file in files:
            if file.endswith(".html"):
                html_files.append(os.path.join(root, file))
                
    print(f"Found {len(html_files)} HTML files to audit.")
    errors = 0
    
    # 2. Check each HTML file
    for filepath in html_files:
        rel_path = os.path.relpath(filepath, root_dir)
        print(f"\nAuditing: {rel_path}")
        
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
            
        # Check for leading slashes in src or href
        slashed_links = re.findall(r'(href|src)="\s*/[^"]*"', content)
        if slashed_links:
            print(f"  [ERROR] Found absolute links (starting with /): {slashed_links}")
            errors += len(slashed_links)
            
        # Check for MS Word classes
        word_classes = re.findall(r'class="Mso[^"]*"', content)
        if word_classes:
            print(f"  [ERROR] Found Word Mso classes: {word_classes}")
            errors += len(word_classes)
            
        # Check all href links
        hrefs = re.findall(r'href="([^"]*)"', content)
        for href in hrefs:
            # Ignore external links, mailto, anchor links, manifest, and sitemaps
            if href.startswith(("http", "mailto:", "#")) or href.endswith(".webmanifest") or href.endswith(".xml"):
                continue
                
            # Strip query params
            clean_href = href.split("?")[0]
            
            # Resolve relative link
            current_dir = os.path.dirname(filepath)
            target_path = os.path.normpath(os.path.join(current_dir, clean_href))
            
            if not os.path.exists(target_path):
                print(f"  [ERROR] Broken link: {href} -> resolved to {target_path} (does not exist)")
                errors += 1
                
        # Check all image tags
        imgs = re.findall(r'src="([^"]*)"', content)
        for img in imgs:
            if img.startswith("http"):
                continue
            # Resolve relative image link
            current_dir = os.path.dirname(filepath)
            target_path = os.path.normpath(os.path.join(current_dir, img))
            
            if not os.path.exists(target_path):
                print(f"  [ERROR] Broken image src: {img} -> resolved to {target_path} (does not exist)")
                errors += 1
                
    if errors == 0:
        print("\nAll checks passed! No broken links, absolute paths, or Word artifacts found.")
    else:
        print(f"\nAudit completed with {errors} errors.")

if __name__ == "__main__":
    test_static_files()
