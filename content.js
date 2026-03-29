// Wrap everything in an IIFE (The Cloak of Invisibility)
(function() {
    console.log("Sniper activated. Scanning for target classes...");

    let chatHistory = []; 
    let chatBlocks = document.querySelectorAll(".query-text, .markdown");

    chatBlocks.forEach((block) => {
        // SHIELD 1: Is it hidden by Google? (Ghost Node)
        if (block.offsetParent === null) return;

        // SHIELD 2: Is it an empty placeholder block?
        let textCheck = block.innerText || "";
        let hasMedia = block.querySelectorAll('img, table, svg, pre, code').length > 0;
        
        // If there is no text and no media, skip it completely!
        if (textCheck.trim() === "" && !hasMedia) return;

        if (block.classList.contains("query-text")) {
            chatHistory.push({
                sender: "You",
                html: block.innerHTML 
            });
        } 
        else if (block.classList.contains("markdown")) {
            chatHistory.push({
                sender: "Gemini",
                html: block.innerHTML
            });
        }
    });

    console.log("Mission Accomplished! Here is the captured chat:");
    console.log(chatHistory);

    // Transmit to mothership
    chrome.runtime.sendMessage({
        action: "sendChatToPopup",
        data: chatHistory
    });

    console.log("Spy: Briefcase transmitted! Bubble popping...");
})();