chrome.runtime.onInstalled.addListener(() => {
    console.log("WhatsApp Kanban CRM instalado!");
});
chrome.action.onClicked.addListener(() => {
    chrome.tabs.create({ url: chrome.runtime.getURL("popup.html") });
});

// Listener para mensagens vindas de outros scripts (content scripts ou popup)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "checkStatus") {
        console.log("Verificando status...");
        sendResponse({ status: "OK" });
    }
});
