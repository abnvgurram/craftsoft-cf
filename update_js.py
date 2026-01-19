import os

path = r"e:\Craft soft\Website\assets\js\main.js"
with open(path, "r", encoding="utf-8") as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if "const cards = document.querySelectorAll('.unified-card');" in line:
        new_lines.append(line.replace("('.unified-card')", "('.unified-card, .unified-method-card, .unified-form-side')"))
    else:
        new_lines.append(line)

with open(path, "w", encoding="utf-8") as f:
    f.writelines(new_lines)

print("Replacement successful")
