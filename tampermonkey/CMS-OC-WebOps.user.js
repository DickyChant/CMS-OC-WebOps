// ==UserScript==
// @name         CMS-OC WebOps - All in One
// @namespace    https://github.com/DickyChant/CMS-OC-WebOps
// @version      1.1
// @description  CMS Offline and Computing WebOps - open CMS tools with selected text. Supports configurable shortcuts via the Tampermonkey menu.
// @author       CMS OC WebOps
// @match        *://*/*
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function () {
    'use strict';

    // -------------------------------------------------------------------------
    // Default shortcuts (mirrors WebOps Chrome extension predefined shortcuts)
    // -------------------------------------------------------------------------
    const DEFAULT_SHORTCUTS = [
        { id: 'openDimaPage',          title: "Open Dima's Page",         url: 'https://dmytro.web.cern.ch/dmytro/cmsprodmon/workflows.php?prep_id={text}' },
        { id: 'openReqMgr2',           title: 'Open ReqMgr2',             url: 'https://cmsweb.cern.ch/reqmgr2/fetch?rid={text}' },
        { id: 'openUnifiedErrorReport',title: 'Open Unified Error Report', url: 'https://cms-unified.web.cern.ch/cms-unified/report/{text}' },
        { id: 'openUnifiedLogs',       title: 'Open Unified Logs',        url: 'https://cms-unified.web.cern.ch/cms-unified/showlog/?search={text}' },
        { id: 'openMSPileup',          title: 'Open MS Pileup',           url: 'https://cmsweb.cern.ch/ms-pileup/data/pileup?pileupName={text}' },
        { id: 'openMSTransferor',      title: 'Open MS Transferor',       url: 'https://cmsweb.cern.ch/ms-transferor/data/info?request={text}' },
        { id: 'openJira',              title: 'Open Jira',                url: 'https://its.cern.ch/jira/issues/?jql=text~{text}%20AND%20(project%20%3D%20CMSPROD%20OR%20project%20%3D%20CMSCOMPPR)' },
        { id: 'openPMP',               title: 'Open pMp',                 url: 'https://cms-pdmv-prod.web.cern.ch/pmp/historical?r={text}' },
        { id: 'openRucioWebUi',        title: 'Open Rucio Web UI',        url: 'https://cms-rucio-webui.cern.ch/search?pattern=cms:{text}' },
        { id: 'openDASPage',           title: 'Open DAS Page',            url: 'https://cmsweb.cern.ch/das/request?view=list&limit=50&instance=prod%2Fglobal&input={text}' },
        { id: 'openCampaignConfig',    title: 'Open Campaign Config',     url: 'https://cmsweb.cern.ch/reqmgr2/data/campaignconfig/{text}' },
    ];

    // -------------------------------------------------------------------------
    // Storage helpers (use Tampermonkey GM_getValue/GM_setValue as storage)
    // -------------------------------------------------------------------------
    function getShortcuts() {
        const stored = GM_getValue('shortcuts', null);
        return stored ? JSON.parse(stored) : DEFAULT_SHORTCUTS.map(s => Object.assign({}, s));
    }

    function saveShortcuts(shortcuts) {
        GM_setValue('shortcuts', JSON.stringify(shortcuts));
    }

    // -------------------------------------------------------------------------
    // Floating popup – shown when text is selected on the page
    // -------------------------------------------------------------------------
    let popup = null;

    function createPopup(x, y, selectedText) {
        removePopup();
        const shortcuts = getShortcuts();

        popup = document.createElement('div');
        popup.id = 'cms-webops-popup';
        popup.style.cssText = `
            position: fixed;
            z-index: 2147483647;
            background: #ffffff;
            border: 1px solid #dee2e6;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            padding: 6px;
            min-width: 210px;
            max-width: 320px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            font-size: 13px;
        `;

        // Header
        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 4px;
            padding-bottom: 4px;
            border-bottom: 1px solid #dee2e6;
        `;
        const title = document.createElement('span');
        title.textContent = 'CMS WebOps';
        title.style.cssText = 'color: #0d6efd; font-weight: 600; font-size: 12px;';

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.cssText = `
            background: none; border: none; cursor: pointer;
            font-size: 16px; color: #6c757d; padding: 0 2px; line-height: 1;
        `;
        closeBtn.onclick = removePopup;

        header.appendChild(title);
        header.appendChild(closeBtn);
        popup.appendChild(header);

        // Action buttons
        shortcuts.forEach(shortcut => {
            const btn = document.createElement('button');
            btn.textContent = shortcut.title;
            btn.style.cssText = `
                display: block;
                width: 100%;
                text-align: left;
                padding: 5px 8px;
                margin: 1px 0;
                background: none;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                color: #212529;
                font-size: 13px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            `;
            btn.onmouseover = () => { btn.style.background = '#e9ecef'; };
            btn.onmouseout = () => { btn.style.background = 'none'; };
            btn.onclick = () => {
                const url = shortcut.url.replace('{text}', encodeURIComponent(selectedText));
                GM_openInTab(url, { active: true });
                removePopup();
            };
            popup.appendChild(btn);
        });

        document.body.appendChild(popup);
        positionPopup(x, y);
    }

    function positionPopup(x, y) {
        const rect = popup.getBoundingClientRect();
        let left = x + 12;
        let top = y + 12;
        if (left + rect.width > window.innerWidth) left = x - rect.width - 12;
        if (top + rect.height > window.innerHeight) top = y - rect.height - 12;
        popup.style.left = `${Math.max(0, left)}px`;
        popup.style.top = `${Math.max(0, top)}px`;
    }

    function removePopup() {
        if (popup) { popup.remove(); popup = null; }
    }

    // Show popup after text selection (mouseup)
    document.addEventListener('mouseup', function (e) {
        if (popup && popup.contains(e.target)) return;
        setTimeout(() => {
            const sel = window.getSelection().toString().trim();
            if (sel) createPopup(e.clientX, e.clientY, sel);
            else removePopup();
        }, 50);
    });

    // Dismiss popup on outside click
    document.addEventListener('mousedown', function (e) {
        if (popup && !popup.contains(e.target)) removePopup();
    });

    // Dismiss popup on Escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') removePopup();
    });

    // -------------------------------------------------------------------------
    // Settings panel – opened via the Tampermonkey menu command
    // -------------------------------------------------------------------------
    GM_registerMenuCommand('Manage Shortcuts', openSettingsPanel);

    function openSettingsPanel() {
        removePopup();
        if (document.getElementById('cms-webops-settings')) return;

        const shortcuts = getShortcuts();

        const overlay = document.createElement('div');
        overlay.id = 'cms-webops-settings';
        overlay.style.cssText = `
            position: fixed; inset: 0; z-index: 2147483647;
            background: rgba(0,0,0,0.5);
            display: flex; align-items: center; justify-content: center;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        `;

        const panel = document.createElement('div');
        panel.style.cssText = `
            background: #fff; border-radius: 12px; padding: 24px;
            width: 90%; max-width: 640px; max-height: 80vh; overflow-y: auto;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        `;

        // Panel header
        const panelHeader = document.createElement('div');
        panelHeader.style.cssText = 'display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;';
        panelHeader.innerHTML = '<h2 style="margin:0;color:#0d6efd;font-size:20px;">Manage Shortcuts</h2>';
        const panelCloseBtn = document.createElement('button');
        panelCloseBtn.textContent = '×';
        panelCloseBtn.style.cssText = 'background:none;border:none;font-size:26px;cursor:pointer;color:#6c757d;line-height:1;';
        panelCloseBtn.onclick = () => overlay.remove();
        panelHeader.appendChild(panelCloseBtn);
        panel.appendChild(panelHeader);

        const hint = document.createElement('p');
        hint.textContent = 'Add, edit, or delete shortcuts. Use {text} in URLs to insert the selected text.';
        hint.style.cssText = 'color:#6c757d; font-size:13px; margin-bottom:16px;';
        panel.appendChild(hint);

        const listEl = document.createElement('div');
        listEl.id = 'cms-webops-shortcut-list';
        panel.appendChild(listEl);

        // Render shortcut rows
        function renderShortcuts(list) {
            listEl.innerHTML = '';
            list.forEach((s, i) => {
                const row = document.createElement('div');
                row.setAttribute('data-shortcut-row', '');
                row.setAttribute('data-shortcut-id', s.id || `custom_${Date.now()}_${i}`);
                row.style.cssText = `
                    display: flex; gap: 8px; align-items: center;
                    padding: 8px; margin-bottom: 6px;
                    background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 6px;
                    flex-wrap: wrap;
                `;
                row.innerHTML = `
                    <input data-field="title" placeholder="Title" value="${escapeAttr(s.title)}"
                        style="flex:1;min-width:110px;padding:6px;border:1px solid #ced4da;border-radius:4px;font-size:13px;">
                    <input data-field="url" placeholder="URL (use {text})" value="${escapeAttr(s.url)}"
                        style="flex:3;min-width:160px;padding:6px;border:1px solid #ced4da;border-radius:4px;font-size:13px;">
                    <button data-action="delete" style="padding:6px 10px;background:#dc3545;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:13px;white-space:nowrap;">✕ Remove</button>
                `;
                row.querySelector('[data-action="delete"]').onclick = () => {
                    list.splice(i, 1);
                    renderShortcuts(list);
                };
                listEl.appendChild(row);
            });
        }

        renderShortcuts(shortcuts);

        // Action buttons
        const actions = document.createElement('div');
        actions.style.cssText = 'display:flex; gap:8px; justify-content:center; margin-top:16px; flex-wrap:wrap;';

        const addBtn = document.createElement('button');
        addBtn.textContent = '+ Add Shortcut';
        addBtn.style.cssText = 'padding:8px 16px;background:#0d6efd;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:13px;';
        addBtn.onclick = () => {
            shortcuts.push({ id: `custom_${Date.now()}`, title: '', url: '' });
            renderShortcuts(shortcuts);
        };

        const saveBtn = document.createElement('button');
        saveBtn.textContent = '✔ Save';
        saveBtn.style.cssText = 'padding:8px 16px;background:#198754;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:13px;';
        saveBtn.onclick = () => {
            const rows = listEl.querySelectorAll('[data-shortcut-row]');
            const updated = [];
            rows.forEach(row => {
                const id = row.getAttribute('data-shortcut-id');
                const title = row.querySelector('[data-field="title"]').value.trim();
                const url = row.querySelector('[data-field="url"]').value.trim();
                if (title && url) updated.push({ id, title, url });
            });
            saveShortcuts(updated);
            overlay.remove();
            showNotification('Shortcuts saved!', '#198754');
        };

        const resetBtn = document.createElement('button');
        resetBtn.textContent = '↺ Reset Defaults';
        resetBtn.style.cssText = 'padding:8px 16px;background:#6c757d;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:13px;';
        resetBtn.onclick = () => {
            if (confirm('Reset all shortcuts to the default set?')) {
                saveShortcuts(DEFAULT_SHORTCUTS.map(s => Object.assign({}, s)));
                overlay.remove();
                showNotification('Shortcuts reset to defaults.', '#6c757d');
            }
        };

        actions.appendChild(addBtn);
        actions.appendChild(saveBtn);
        actions.appendChild(resetBtn);
        panel.appendChild(actions);

        overlay.appendChild(panel);
        document.body.appendChild(overlay);

        // Close when clicking the backdrop
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) overlay.remove();
        });
    }

    // -------------------------------------------------------------------------
    // Utility helpers
    // -------------------------------------------------------------------------
    function escapeAttr(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    function showNotification(message, color) {
        const note = document.createElement('div');
        note.textContent = message;
        note.style.cssText = `
            position: fixed; bottom: 24px; right: 24px; z-index: 2147483647;
            background: ${color}; color: #fff;
            padding: 10px 20px; border-radius: 8px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            font-size: 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            transition: opacity 0.4s;
        `;
        document.body.appendChild(note);
        setTimeout(() => {
            note.style.opacity = '0';
            setTimeout(() => note.remove(), 400);
        }, 2500);
    }
})();
