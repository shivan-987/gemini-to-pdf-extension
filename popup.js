// --- THE RADIO RECEIVER ---
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

  if (message.action === "sendChatToPopup") {

    document.getElementById("exportBtn").innerText = "Data Secured! Building PDF...";
    document.getElementById("exportBtn").style.backgroundColor = "#0f9d58";

    console.log("Mothership: Briefcase received! It contains " + message.data.length + " messages.");

    // --- THE PDF FACTORY ---
    let pdfContainer = document.createElement("div");
    pdfContainer.style.padding = "20px";
    pdfContainer.style.fontFamily = "'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
    pdfContainer.style.textAlign = "left";
    pdfContainer.style.backgroundColor = "#1e1e1e";
    pdfContainer.style.color = "#d4d4d4";

    let globalStyle = document.createElement("style");
    globalStyle.innerHTML = `
        summary::-webkit-details-marker { display: none !important; }
        summary::marker { display: none !important; }
        details > summary { list-style: none !important; }
    `;
    pdfContainer.appendChild(globalStyle);

    let title = document.createElement("h2");
    title.innerText = "Gemini Chat Export";
    title.style.borderBottom = "2px solid #0f9d58";
    title.style.paddingBottom = "10px";
    title.style.color = "#ffffff";
    pdfContainer.appendChild(title);

    // --- THE ASSEMBLY LINE ---
    message.data.forEach((chat) => {
      let chatContent = document.createElement("div");
      chatContent.innerHTML = chat.html;

      let preBlocks = chatContent.querySelectorAll('pre');
      preBlocks.forEach(pre => {
        pre.style.whiteSpace = "pre-wrap";
        pre.style.fontFamily = "monospace";
        pre.style.backgroundColor = "#000000";
        pre.style.padding = "10px";
        pre.style.borderRadius = "5px";
        pre.style.display = "block";
        pre.style.overflowX = "auto";
      });

      let inlineCodes = chatContent.querySelectorAll('code');
      inlineCodes.forEach(code => {
        if (code.parentElement && code.parentElement.tagName.toLowerCase() === 'pre') return;
        code.style.fontFamily = "monospace";
        code.style.backgroundColor = "#383838";
        code.style.color = "#ffcc00";
        code.style.padding = "2px 6px";
        code.style.borderRadius = "4px";
        code.style.display = "inline";
      });

      let images = chatContent.querySelectorAll('img');
      images.forEach(img => { img.style.maxWidth = "100%"; img.style.height = "auto"; });

      let horizontalRules = chatContent.querySelectorAll('hr');
      horizontalRules.forEach(hr => {
        hr.style.border = "none"; hr.style.borderTop = "1px solid #555555";
        hr.style.margin = "20px 0"; hr.style.height = "1px";
      });

      let links = chatContent.querySelectorAll('a');
      links.forEach(link => {
        link.style.color = "#8ab4f8"; link.style.textDecoration = "underline";
        link.style.wordWrap = "break-word"; link.style.display = "inline-block";
        link.style.maxWidth = "100%";
      });

      let tables = chatContent.querySelectorAll('table');
      tables.forEach(table => {
        table.style.borderCollapse = "collapse"; table.style.width = "100%"; table.style.margin = "20px 0";
      });

      let tableCells = chatContent.querySelectorAll('th, td');
      tableCells.forEach(cell => {
        cell.style.border = "1px solid #555555"; cell.style.padding = "10px"; cell.style.textAlign = "left";
      });

      let detailsTags = chatContent.querySelectorAll('details');
      detailsTags.forEach(detail => detail.setAttribute('open', 'true'));

      let summaryTags = chatContent.querySelectorAll('summary');
      summaryTags.forEach(summary => {
        summary.style.listStyle = "none"; summary.style.display = "block";
        summary.style.fontWeight = "bold"; summary.style.color = "#8ab4f8";
        summary.style.marginBottom = "10px";
      });

      // =========================================================
      // THE NEW FIX: High-Contrast Paintbrush
      // Forces all hidden headings and bold text to be pure white
      // =========================================================
      let headings = chatContent.querySelectorAll('h1, h2, h3, h4, h5, h6');
      headings.forEach(h => {
        h.style.color = "#ffffff";
      });

      let boldText = chatContent.querySelectorAll('strong, b');
      boldText.forEach(b => {
        b.style.color = "#ffffff";
      });

      let paragraphsAndLists = chatContent.querySelectorAll('p, li, span');
      paragraphsAndLists.forEach(el => {
        // If Google explicitly hardcoded pitch black text, override it!
        if (el.style.color === 'rgb(0, 0, 0)' || el.style.color === 'black' || el.style.color === '#000000') {
          el.style.color = '#d4d4d4';
        }
      });
      // =========================================================

      let webButtons = chatContent.querySelectorAll('button');
      webButtons.forEach(btn => btn.remove());

      // TARGETED ASSASSIN: Kills SVG icons but protects Math symbols
      let svgs = chatContent.querySelectorAll('svg');
      svgs.forEach(svg => {
        if (!svg.closest('.katex') && !svg.closest('math')) {
          svg.remove();
        }
      });

      let googleIcons = chatContent.querySelectorAll('.material-symbols-outlined, .google-symbols');
      googleIcons.forEach(icon => icon.remove());

      let allElements = chatContent.querySelectorAll('*');
      allElements.forEach(el => {
        if (!chatContent.contains(el)) return;
        let text = el.textContent ? el.textContent.trim() : "";
        if (text === "Export to Sheets" || text === "Show drafts") {
          let parent = el.parentElement;
          if (parent && parent.textContent.trim() === text) { parent.remove(); }
          else { el.remove(); }
        }
      });

      let protectedElements = chatContent.querySelectorAll('pre, code, img, table, tr, h2, h3');
      protectedElements.forEach(el => {
        el.style.pageBreakInside = "avoid"; el.style.breakInside = "avoid";
      });

      let cleanText = chatContent.textContent.trim();
      let hasMedia = chatContent.querySelectorAll('img, table, canvas, pre, code, .katex, math').length > 0;
      if (cleanText.length === 0 && !hasMedia) return;

      let chatBubble = document.createElement("div");
      chatBubble.style.marginBottom = "20px";
      chatBubble.style.padding = "15px";
      chatBubble.style.borderRadius = "8px";
      chatBubble.style.lineHeight = "1.6";

      if (chat.sender === "You") {
        chatBubble.style.backgroundColor = "#2d2d30"; chatBubble.style.borderLeft = "4px solid #1a73e8";
      } else {
        chatBubble.style.backgroundColor = "#252526"; chatBubble.style.borderLeft = "4px solid #0f9d58";
      }

      let senderLabel = document.createElement("strong");
      senderLabel.innerText = chat.sender + ":"; senderLabel.style.display = "block";
      senderLabel.style.marginBottom = "10px";
      senderLabel.style.color = chat.sender === "You" ? "#61afef" : "#98c379";
      chatBubble.appendChild(senderLabel);

      chatBubble.appendChild(chatContent);
      pdfContainer.appendChild(chatBubble);
    });

    // =========================================================
    // THE SAFE PRINTING PRESS 
    // =========================================================
    let opt = {
      margin: [15, 15, 15, 15],
      filename: 'gemini-study-notes.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'] }
    };

    html2pdf().set(opt).from(pdfContainer).save().then(() => {
      let btn = document.getElementById("exportBtn");
      btn.innerText = "Success! PDF Downloaded.";

      setTimeout(() => {
        btn.innerText = "Export to PDF";
        btn.style.backgroundColor = "#1a73e8";
      }, 3000);
    });

  }
});

// --- THE CLICK LISTENER ---
document.getElementById("exportBtn").addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (tab.url.includes("gemini.google.com")) {
    document.getElementById("exportBtn").innerText = "Extracting...";

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"]
    });
  } else {
    alert("Please open a Google Gemini chat to use this extension!");
  }
});