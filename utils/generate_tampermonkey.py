"""
generate_tampermonkey.py
------------------------
Utility to generate a single-action Tampermonkey userscript for a CMS WebOps shortcut.

Usage:
    python ./utils/generate_tampermonkey.py <script_name> <title> <base_url>

Arguments:
    script_name  File name for the userscript (without .user.js extension).
    title        Human-readable label shown on the popup button.
    base_url     URL to open, with {text} as a placeholder for the selected text.

Example:
    python ./utils/generate_tampermonkey.py \\
        my-tool "Open My Tool" "https://example.com/search?q={text}"

The generated .user.js file is saved to the tampermonkey/ folder in the repository root.
"""

import os
import argparse


def generate_userscript(script_name: str, title: str, base_url: str) -> str:
    """
    Return the content of a Tampermonkey userscript for a single CMS WebOps shortcut.

    Args:
        script_name: Short identifier used as the file name (without extension).
        title: Human-readable label shown on the floating popup button.
        base_url: Destination URL with ``{text}`` as the selected-text placeholder.

    Returns:
        JavaScript source code for the userscript.
    """
    return f"""// ==UserScript==
// @name         CMS-OC WebOps - {title}
// @namespace    https://github.com/DickyChant/CMS-OC-WebOps
// @version      1.0
// @description  Open {title} with the selected text
// @author       CMS OC WebOps
// @match        *://*/*
// @grant        GM_openInTab
// ==/UserScript==

(function () {{
    'use strict';

    const TITLE = {repr(title)};
    const BASE_URL = {repr(base_url)};

    let popup = null;

    function createPopup(x, y, selectedText) {{
        removePopup();

        popup = document.createElement('div');
        popup.style.cssText = `
            position: fixed;
            z-index: 2147483647;
            background: #ffffff;
            border: 1px solid #dee2e6;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            padding: 4px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            font-size: 13px;
        `;

        const btn = document.createElement('button');
        btn.textContent = TITLE;
        btn.style.cssText = `
            display: block;
            padding: 6px 12px;
            background: none;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            color: #212529;
            font-size: 13px;
            white-space: nowrap;
        `;
        btn.onmouseover = () => {{ btn.style.background = '#e9ecef'; }};
        btn.onmouseout = () => {{ btn.style.background = 'none'; }};
        btn.onclick = () => {{
            const url = BASE_URL.replace('{{text}}', encodeURIComponent(selectedText));
            GM_openInTab(url, {{ active: true }});
            removePopup();
        }};

        popup.appendChild(btn);
        document.body.appendChild(popup);
        positionPopup(x, y);
    }}

    function positionPopup(x, y) {{
        const rect = popup.getBoundingClientRect();
        let left = x + 10;
        let top = y + 10;
        if (left + rect.width > window.innerWidth) left = x - rect.width - 10;
        if (top + rect.height > window.innerHeight) top = y - rect.height - 10;
        popup.style.left = `${{Math.max(0, left)}}px`;
        popup.style.top = `${{Math.max(0, top)}}px`;
    }}

    function removePopup() {{
        if (popup) {{ popup.remove(); popup = null; }}
    }}

    document.addEventListener('mouseup', function (e) {{
        if (popup && popup.contains(e.target)) return;
        setTimeout(() => {{
            const sel = window.getSelection().toString().trim();
            if (sel) createPopup(e.clientX, e.clientY, sel);
            else removePopup();
        }}, 50);
    }});

    document.addEventListener('mousedown', function (e) {{
        if (popup && !popup.contains(e.target)) removePopup();
    }});

    document.addEventListener('keydown', function (e) {{
        if (e.key === 'Escape') removePopup();
    }});
}})();
"""


def main():
    parser = argparse.ArgumentParser(
        description="Generate a Tampermonkey userscript for a CMS WebOps shortcut."
    )
    parser.add_argument(
        "script_name",
        help="File name for the userscript (without .user.js extension).",
    )
    parser.add_argument(
        "title",
        help="Human-readable label shown on the popup button.",
    )
    parser.add_argument(
        "base_url",
        help="URL to open, with {text} as the placeholder for the selected text.",
    )

    args = parser.parse_args()

    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    output_dir = os.path.join(base_dir, "tampermonkey")
    os.makedirs(output_dir, exist_ok=True)

    output_path = os.path.join(output_dir, f"{args.script_name}.user.js")
    content = generate_userscript(args.script_name, args.title, args.base_url)

    with open(output_path, "w") as f:
        f.write(content)

    print(f"\nGenerated Tampermonkey userscript: {output_path}")
    print(
        "\nTo install: open the file in your browser or drag it into the Tampermonkey dashboard."
    )


if __name__ == "__main__":
    main()
