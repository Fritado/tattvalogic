import re

def find_mismatch(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Simple tag balancer for common tags
    tags_to_check = ['div', 'span', 'button', 'p', 'h1', 'h2', 'h3', 'h4', 'label', 'section', 'header', 'footer']
    
    for tag_name in tags_to_check:
        depth = 0
        lines = content.split('\n')
        for i, line in enumerate(lines):
            # Regex to find <tag or </tag but ignore self-closing or other tags
            # This is a bit rough but works for simple JSX
            matches = re.finditer(f'<{tag_name}|</{tag_name}', line)
            for match in matches:
                tag = match.group(0)
                if tag.startswith('</'):
                    depth -= 1
                else:
                    # Check if it's self-closing like <span />
                    if not re.search(f'<{tag_name}[^>]*/>', line[match.start():]):
                        depth += 1
                
                if depth < 0:
                    print(f"Extra </{tag_name}> at line {i+1}")
                    depth = 0
        
        if depth > 0:
            print(f"Unclosed <{tag_name}> (depth {depth})")

find_mismatch('frontend/src/app/onboarding/start/page.tsx')
