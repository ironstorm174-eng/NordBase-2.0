import re

with open('src/components/SuperAdminDashboard.tsx', 'r') as f:
    content = f.read()

# Using python re to match the block
pattern = r"<div>\s*<div className=\"text-xs text-slate-500 font-bold mb-1\">\s*Password\s*</div>.*?Hidden\s*</div>\s*</div>\s*</div>"
content = re.sub(pattern, "", content, flags=re.DOTALL)

with open('src/components/SuperAdminDashboard.tsx', 'w') as f:
    f.write(content)
