// ==UserScript==
// @name         CMS-OC WebOps - pMp PdmV Pages
// @namespace    https://github.com/DickyChant/CMS-OC-WebOps
// @version      1.0
// @description  Open pMp historical page with the selected campaign or request name
// @author       CMS OC WebOps
// @match        *://*/*
// @grant        GM_openInTab
// ==/UserScript==

(function () {
    'use strict';

    const TITLE = 'Open pMp';
    const BASE_URL = 'https://cms-pdmv-prod.web.cern.ch/pmp/historical?r={text}';

    let popup = null;

    function createPopup(x, y, selectedText) {
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
        btn.onmouseover = () => { btn.style.background = '#e9ecef'; };
        btn.onmouseout = () => { btn.style.background = 'none'; };
        btn.onclick = () => {
            const url = BASE_URL.replace('{text}', encodeURIComponent(selectedText));
            GM_openInTab(url, { active: true });
            removePopup();
        };

        popup.appendChild(btn);
        document.body.appendChild(popup);
        positionPopup(x, y);
    }

    function positionPopup(x, y) {
        const rect = popup.getBoundingClientRect();
        let left = x + 10;
        let top = y + 10;
        if (left + rect.width > window.innerWidth) left = x - rect.width - 10;
        if (top + rect.height > window.innerHeight) top = y - rect.height - 10;
        popup.style.left = `${Math.max(0, left)}px`;
        popup.style.top = `${Math.max(0, top)}px`;
    }

    function removePopup() {
        if (popup) { popup.remove(); popup = null; }
    }

    document.addEventListener('mouseup', function (e) {
        if (popup && popup.contains(e.target)) return;
        setTimeout(() => {
            const sel = window.getSelection().toString().trim();
            if (sel) createPopup(e.clientX, e.clientY, sel);
            else removePopup();
        }, 50);
    });

    document.addEventListener('mousedown', function (e) {
        if (popup && !popup.contains(e.target)) removePopup();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') removePopup();
    });
})();
