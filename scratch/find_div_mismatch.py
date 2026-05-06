import re

def find_mismatch(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    depth = 0
    lines = content.split('\n')
    for i, line in enumerate(lines):
        matches = re.finditer(r'<(div|/div)', line)
        for match in matches:
            tag = match.group(1)
            if tag == 'div':
                depth += 1
                print(f"L{i+1} OPEN depth {depth}")
            else:
                depth -= 1
                print(f"L{i+1} CLOSE depth {depth}")
    
    print(f"Final depth: {depth}")

find_mismatch('frontend/src/app/onboarding/start/page.tsx')
