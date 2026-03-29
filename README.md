# Gemini to PDF - Chrome Extension 

A lightweight, privacy-first Chrome extension that extracts, cleans, and exports your Google Gemini conversations into beautifully formatted, dark-mode PDFs entirely offline.

## i. Features
* **Privacy-First Architecture:** All extraction happens locally in your browser using standard DOM manipulation. No chat data is ever sent to an external server.
* **The "Smart Assassin" UI Cleaner:** Automatically identifies and strips out Google's web-only UI elements (copy buttons, edit icons, draft dropdowns) so they don't print on your PDF.
* **Intelligent Formatting:** Preserves `<pre>` code blocks, `<table>` data, and inline formatting without slicing them in half across PDF page breaks.
* **High-Contrast Dark Mode:** Injects custom CSS to ensure your study notes are easy on the eyes, forcing stubborn black text into readable white text.

## ii. Technologies Used
* **Vanilla JavaScript (ES6+):** For content scripts and asynchronous message passing.
* **Chrome Extension API (Manifest V3):** Utilizing `activeTab` and `scripting` permissions for secure, isolated DOM access.
* **html2pdf.js:** For rendering complex HTML canvases into paginated PDF documents.

## iii. How to Install (Developer Mode)
1. Download the `ChatExporter.zip` file from this repository and extract it to a folder.
2. Open your Chromium-based browser (Chrome, Brave, Edge) and navigate to `chrome://extensions/`.
3. Toggle **Developer mode** ON in the top right corner.
4. Click **Load unpacked** and select the folder you just extracted.
5. Pin the extension to your toolbar, open a Gemini chat, and hit Export!

## iv. The Engineering Challenge
The biggest hurdle in this project was preventing the PDF generator's mathematical slicer from cutting text in half, while simultaneously managing Chrome's strict 32K pixel canvas limit for massive, multi-page chats. This was solved by implementing "Flexible Armor" on critical elements (`<tr>`, `<img>`) and injecting an invisible buffer footer to protect the final line of text.
