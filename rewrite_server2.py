import re

with open('server.ts', 'r') as f:
    content = f.read()

# Remove the memory version password check
content = re.sub(r"if \(existingRoleUser\.password && password && existingRoleUser\.password !== password\) \{[\s\S]*?\}", "", content)
content = re.sub(r"if \(!existingRoleUser\.password && password\) \{[\s\S]*?\}", "", content)
content = re.sub(r"if \(existingOtherUser && existingOtherUser\.password && password && existingOtherUser\.password !== password\) \{[\s\S]*?\}", "", content)

with open('server.ts', 'w') as f:
    f.write(content)
