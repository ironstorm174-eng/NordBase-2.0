import re

with open('src/components/AdminDashboard.tsx', 'r') as f:
    content = f.read()

# Remove state
content = re.sub(r"const \[newOpPassword, setNewOpPassword\] = useState\(\"\"\);\n", "", content)

# Remove from user object
content = re.sub(r"password: newOpPassword,\n", "", content)

# Remove reset
content = re.sub(r"setNewOpPassword\(\"\"\);\n", "", content)

# Remove handleUpdatePassword function
content = re.sub(r"const handleUpdatePassword = \(id: string, newPass: string\) => \{[\s\S]*?\}\s*;\s*", "", content)

# Remove from form
content = re.sub(r"<div>\s*<label className=\"block text-xs font-bold text-slate-400 mb-1\">\s*Temporary Password[\s\S]*?</div>", "", content)

# Remove rendering list item block
pattern = r"<div>\s*<div className=\"text-xs text-slate-500 font-bold mb-1\">\s*Password\s*</div>.*?</div>\s*</div>"
content = re.sub(pattern, "", content, flags=re.DOTALL)

with open('src/components/AdminDashboard.tsx', 'w') as f:
    f.write(content)
