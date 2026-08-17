with open('src/components/SuperAdminDashboard.tsx', 'r') as f:
    lines = f.readlines()

new_lines = []
skip = False
for line in lines:
    if "Password" in line and "text-xs text-slate-500 font-bold mb-1" in lines[lines.index(line)-1]:
        # we found the block
        # we need to remove the wrapping <div> as well
        new_lines.pop() # remove the <div>
        skip = True
        continue
    if skip:
        if "Hidden" in line:
            pass
        elif line.strip() == "</div>":
            # wait, there are multiple </div>.
            pass
            
