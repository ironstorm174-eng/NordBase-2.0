import re

with open('src/components/LoginScreen.tsx', 'r') as f:
    content = f.read()

# We want to replace everything from the <div className="relative flex py-0.5 items-center">
# to the end of the <form> with nothing.
start_str = '<div className="relative flex py-0.5 items-center">'
end_str = '</form>'

start_idx = content.find(start_str)
end_idx = content.find(end_str)

if start_idx != -1 and end_idx != -1:
    new_content = content[:start_idx] + content[end_idx + len(end_str):]
    with open('src/components/LoginScreen.tsx', 'w') as f:
        f.write(new_content)
    print("Replaced!")
else:
    print("Not found")

