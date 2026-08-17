import re

with open('src/components/LoginScreen.tsx', 'r') as f:
    content = f.read()

# Remove states
states_to_remove = [
    r"const \[authMode[\s\S]*?;",
    r"const \[name, setName[\s\S]*?;",
    r"const \[phone, setPhone[\s\S]*?;",
    r"const \[password, setPassword[\s\S]*?;",
    r"const \[confirmPassword, setConfirmPassword[\s\S]*?;",
    r"const \[showPassword, setShowPassword[\s\S]*?;",
    r"const \[showConfirmPassword, setShowConfirmPassword[\s\S]*?;",
    r"const \[adminUsername, setAdminUsername[\s\S]*?;",
    r"const \[adminDashboardNumber, setAdminDashboardNumber[\s\S]*?;"
]

for s in states_to_remove:
    content = re.sub(s, "", content)

# Remove functions
content = re.sub(r"const handleAdminLogin = async \(e: React.FormEvent\) => \{[\s\S]*?\n  \};\n", "", content)
content = re.sub(r"const checkPasswordValidation = \(pwd: string\) => \{[\s\S]*?\n  \};\n", "", content)
content = re.sub(r"const handlePhoneSubmit = async \(e: React.FormEvent\) => \{[\s\S]*?\n  \};\n", "", content)

# Update handleCredentialResponse arguments
old_call = """        const user = await onLoginSuccess(
          decoded.email,
          phone.trim() || '',
          userName,
          roleToUse,
          undefined,
          false,
          (expectedRole === 'operator' || expectedRole === 'regional_admin') ? adminDashboardNumber.trim() : undefined
        );"""

new_call = """        const user = await onLoginSuccess(
          decoded.email,
          '',
          userName,
          roleToUse,
          undefined,
          false,
          undefined
        );"""

content = content.replace(old_call, new_call)
content = content.replace("Google authorization error. Please use phone login instead!", "Google authorization error. Please try again.")

# Remove `phone` from useEffect dependencies
content = content.replace("}, [step, onLoginSuccess, phone]);", "}, [step, onLoginSuccess]);")

with open('src/components/LoginScreen.tsx', 'w') as f:
    f.write(content)

