import re

with open('server.ts', 'r') as f:
    content = f.read()

# Remove the password verification
content = re.sub(r"// Verify password if provided[\s\S]*?if \(!existingRoleUser\.password && password\) \{[\s\S]*?\}", "", content)

# Remove the other password verification block for existingOtherUser
content = re.sub(r"if \(existingOtherUser && existingOtherUser\.password && password && existingOtherUser\.password !== password\) \{[\s\S]*?\}", "", content)

with open('server.ts', 'w') as f:
    f.write(content)

