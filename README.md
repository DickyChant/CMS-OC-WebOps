# Offline and Computing (O&C) WebOps

This project provides a set of Google Chrome extensions designed to enhance the workflow of the CMS Offline and Computing group. These extensions streamline access to essential tools and resources, making your daily tasks more efficient and productive.

## Extensions

### 1. Open Dimas Page

The "Open Dimas Page" extension simplifies the process of accessing Dimas pages, enabling you to quickly navigate to relevant information and resources related to your work.

![Open Dimas Page](./extensions/dimas-page/dimas-page.gif)

### 2. Open ReqMgr2

The "Open ReqMgr2" extension provides a one-click solution for accessing ReqMgr2, an essential tool for managing CMS requests. Save time and effort by eliminating the need to search for ReqMgr2 in your bookmarks or history.

![Open ReqMgr2](./extensions/ReqMgr2/reqmgr2-page.gif)

### 3. Open Unified

The "Open Unified Pages" extension provides a quick and convenient way to access Unified Pages, the Unified Log of a Workflow and the Error Report of a workflow.

![Open Unified Pages](./extensions/unified/unified.gif)

### 4. Open Rucio Web UI

The "Open Rucio Web UI" extension allows you to easily access the Rucio Web UI, a vital resource for managing CMS data. This extension simplifies the process of navigating to the Rucio Web UI and helps you stay organized.

![Open Rucio Web UI](./extensions/rucio/open-rucio.gif)

### 5. Jira Search

The "Jira Search" extension provides a quick and convenient way to search and access Jira issues and projects relevant to your work. Easily stay on top of project management and issue tracking within Jira.

![Jira Search](./extensions/jira-search/jira-search.gif)

### 6. Wmcore Microservices

The "Wmcore Microservices" extension allows you to efficiently access Wmcore microservices, an essential component of CMS Offline and Computing. Simplify your workflow by quickly navigating to these microservices from your browser.

![Wmcore Microservices](./extensions/wmcore-microservices/open-mspileup.gif)

### 7. pMp - PdmV Pages

The "pMp - PdmV Pages" extension provides a quick and convenient way to access PdmV pages relevant to your work. For now there is only option to open pMp Historical page.

![Wmcore Microservices](./extensions/pdmv/pmp.gif)

### 8. WebOps - All in One - (Combined Extension of all the above)

The "WmOps - All in One" extension combines all of the above extensions into a single extension. This extension provides a convenient way to access all of the essential tools and resources you need to get your work done.

![Wmcore Microservices](./WebOps/webops.gif)


## Installation

### Chrome / Firefox Extensions

You can either install each extension individually, or you can install all of them at once combined.

1. Clone this repository to your local machine, or you can download the zip file and extract it.
2. Open Google Chrome and go to `chrome://extensions/`.
3. Enable "Developer mode" in the top-right corner.
4. Click the "Load unpacked" button and select the directory of the extension you want to install.
    - If you want to install all of the extensions as a single extension, select the **WmOps** Folder.
    - If you want to install each extension individually, then just select the folder of the extension you want to install from the extensions folder. i.e 'dimas-page', 'jira-search', etc.
5. The extensions should now appear in you extensions page.

### Tampermonkey Userscripts

All of the above extensions are also available as [Tampermonkey](https://www.tampermonkey.net/) userscripts. This lets you use the same functionality without installing a browser extension — Tampermonkey works in Chrome, Firefox, Edge, and Safari.

#### How it works

When you select text on any webpage, a small floating popup appears near your cursor listing all available CMS actions. Click an action to open the corresponding page in a new tab with the selected text inserted automatically. Press **Escape** or click anywhere outside the popup to dismiss it.

#### Installation

1. Install the [Tampermonkey browser extension](https://www.tampermonkey.net/) if you have not already.
2. Clone this repository (or download the zip).
3. Open the Tampermonkey dashboard and click **Utilities → Install from file**, then select one of the scripts from the `tampermonkey/` folder:

| Script | What it opens |
|--------|--------------|
| `CMS-OC-WebOps.user.js` | **All-in-One** – all shortcuts in a single script, with a configurable shortcut manager |
| `dimas-page.user.js` | Dima's CMS production monitor |
| `ReqMgr2.user.js` | ReqMgr2 request page |
| `unified.user.js` | Unified Error Report and Unified Logs |
| `rucio.user.js` | Rucio Web UI search |
| `jira-search.user.js` | Jira issue search (CMSPROD / CMSCOMPPR) |
| `wmcore-microservices.user.js` | MS Pileup and MS Transferor |
| `pdmv.user.js` | pMp PdmV historical page |
| `das.user.js` | CMS Data Aggregation System (DAS) |
| `reqmgr_campaignconfig.user.js` | ReqMgr2 campaign configuration |

> **Tip:** Install only `CMS-OC-WebOps.user.js` to get all shortcuts in one place.

#### Managing shortcuts (All-in-One script)

The combined `CMS-OC-WebOps.user.js` script supports adding, editing, and deleting shortcuts, just like the WebOps Chrome extension options page:

1. Click the Tampermonkey icon in your browser toolbar.
2. Select **CMS-OC WebOps - All in One → Manage Shortcuts**.
3. Add, edit, or remove shortcuts and click **Save**.

Use `{text}` anywhere in a URL as a placeholder for the selected text (it will be URL-encoded automatically).


## Chrome Extension Generator

The utility, `create_new_extension.py`, is designed to automate the creation of new Chrome extensions. It will generate the necessary JavaScript code for the extension, a `manifest.json` file, and will also copy an `icon.png` from a specified source folder.

## Tampermonkey Userscript Generator

The utility, `generate_tampermonkey.py`, generates a single-action Tampermonkey userscript for any CMS WebOps shortcut.

## Prerequisites

- Ensure you have Python 3.x installed on your machine.
- Clone the repository.

## Usage

### Chrome Extension Generator

Run the script using the following command:

    python ./utils/create_new_extension.py [extension_folder] [extension_name] [base_url]

- extension_folder: The name of the folder where the extension files will be saved.
- extension_name: The name of the extension (also used as the context menu title).
- base_url: The base URL to open with the selected text.

### Tampermonkey Userscript Generator

Run the script using the following command:

    python ./utils/generate_tampermonkey.py [script_name] [title] [base_url]

- script_name: The file name for the userscript (without `.user.js` extension).
- title: The human-readable label shown on the popup button.
- base_url: The URL to open, using `{text}` as the placeholder for the selected text.

Example:

    python ./utils/generate_tampermonkey.py my-tool "Open My Tool" "https://example.com/search?q={text}"

The generated `.user.js` file is saved to the `tampermonkey/` folder.

## Suggestions and Contributions

I welcome your suggestions and contributions to improve these extensions. Feel free to submit issues, feature requests, or pull requests to help make this project even more valuable to the CMS Offline and Computing community.

