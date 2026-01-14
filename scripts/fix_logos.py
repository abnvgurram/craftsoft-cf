import os
import re

def process_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Determine relative path depth
    depth = file_path.count(os.sep) - 3 # Website root is 3 levels deep in "e:\Craft soft\Website"
    rel_prefix = "../" * depth if depth > 0 else "./"
    
    # Adjust depth calculation specifically for this repo structure
    # e:\Craft soft\Website\index.html depth 0 -> ./
    # e:\Craft soft\Website\about\index.html depth 1 -> ../
    # e:\Craft soft\Website\courses\ui-ux\index.html depth 2 -> ../../
    
    parts = file_path.split(os.sep)
    try:
        root_idx = parts.index("Website")
        depth = len(parts) - root_idx - 2
        rel_prefix = "../" * depth if depth > 0 else "./"
    except ValueError:
        return

    # 1. Inject Component Assets if missing
    logo_assets = f"""    <!-- Logo Component Assets -->
    <link rel="stylesheet" href="{rel_prefix}assets/components/logo-signature/logo-signature.css">
    <script src="{rel_prefix}assets/components/logo-signature/logo-signature.js"></script>"""

    if "logo-signature.css" not in content:
        content = re.sub(r'(<link rel="stylesheet" href="[^"]*master\.css[^"]*">)', r'\1\n' + logo_assets, content)

    # 2. Replace hardcoded navbar logo
    # Pattern for navbar logo
    navbar_pattern = r'<a href="[^"]*" class="logo">.*?<div class="logo-placeholder">.*?<i class="fas fa-graduation-cap"></i>.*?</div>.*?<span class="logo-text"><span class="logo-signature">Abhi\'s</span>.*?<span class="highlight">Craft\s+Soft</span></span>.*?</a>'
    
    # Use data-link attribute from the original href
    def replace_navbar(match):
        href_match = re.search(r'href="([^"]*)"', match.group(0))
        href = href_match.group(1) if href_match else rel_prefix
        return f'<div class="logo-signature-component" data-link="{href}"></div>'

    content = re.sub(navbar_pattern, replace_navbar, content, flags=re.DOTALL)

    # 3. Replace mobile menu header logo
    mobile_pattern = r'<div class="logo">\s*<div class="logo-placeholder"><i class="fas fa-graduation-cap"></i></div>\s*<span class="logo-text"><span class="logo-signature">Abhi\'s</span> <span class="highlight">Craft\s+Soft</span></span>\s*</div>'
    content = re.sub(mobile_pattern, lambda m: f'<div class="logo-signature-component" data-link="{rel_prefix}"></div>', content, flags=re.DOTALL)

    # 4. Replace footer logo
    footer_pattern = r'<div class="footer-brand">\s*<a href="[^"]*" class="logo"><span class="logo-text"><span class="logo-signature">Abhi\'s</span> <span\s+class="highlight">Craft\s+Soft</span></span>\s*</a>'
    def replace_footer(match):
        href_match = re.search(r'href="([^"]*)"', match.group(0))
        href = href_match.group(1) if href_match else rel_prefix
        return f'<div class="footer-brand">\n                    <div class="logo-signature-component" data-link="{href}" data-footer></div>'

    content = re.sub(footer_pattern, replace_footer, content, flags=re.DOTALL)

    # Specific footer pattern in some files
    footer_pattern_alt = r'<div class="footer-brand">\s*<a href="[^"]*" class="logo">\s*<div class="logo-placeholder"><i class="fas fa-graduation-cap"></i></div>\s*<span class="logo-text"><span class="logo-signature">Abhi\'s</span> <span class="highlight">Craft\s+Soft</span></span>\s*</a>'
    content = re.sub(footer_pattern_alt, replace_footer, content, flags=re.DOTALL)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

def main():
    base_dir = r"e:\Craft soft\Website"
    for root, dirs, files in os.walk(base_dir):
        if ".git" in root: continue
        for file in files:
            if file.endswith(".html"):
                process_file(os.path.join(root, file))

if __name__ == "__main__":
    main()
