with open('src/store.ts', 'r') as f:
    lines = f.readlines()

new_lines = []
for i, line in enumerate(lines):
    if line.strip() == ";" and i+1 < len(lines) and lines[i+1].strip() == "}":
        print("Skipping stray block in store.ts")
        continue
    if line.strip() == "}" and i > 0 and lines[i-1].strip() == ";":
        continue
    new_lines.append(line)

with open('src/store.ts', 'w') as f:
    f.writelines(new_lines)

