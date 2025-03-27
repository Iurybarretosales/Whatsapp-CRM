// Melhorando o layout Kanban para se assemelhar à imagem fornecida
const kanban = document.createElement("div");
kanban.id = "kanban-panel";
kanban.innerHTML = `
    <style>
        #kanban-panel {
            position: fixed;
            top: 10px;
            right: 10px;
            width: 90vw;
            height: 90vh;
            background: white;
            border-radius: 10px;
            box-shadow: 0px 4px 10px rgba(0,0,0,0.3);
            padding: 10px;
            overflow-x: auto;
            display: flex;
        }
        .kanban-column {
            flex: 1;
            background: #f9f9f9;
            padding: 10px;
            border: 1px solid #ddd;
            min-height: 80vh;
            border-radius: 8px;
            margin: 0 5px;
            overflow-y: auto;
        }
        .message {
            background: white;
            display: flex;
            align-items: center;
            padding: 10px;
            margin: 5px 0;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            cursor: grab;
        }
        .message img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            margin-right: 10px;
        }
        .message .info {
            flex-grow: 1;
        }
    </style>
    <div class="kanban-column" id="leads"><strong>Leads</strong></div>
    <div class="kanban-column" id="negociando"><strong>Negociando</strong></div>
    <div class="kanban-column" id="ganhou"><strong>Ganhou</strong></div>
    <div class="kanban-column" id="perdeu"><strong>Perdeu</strong></div>
`;

document.body.appendChild(kanban);

function captureMessages() {
    const chatList = document.querySelectorAll("div[role='listitem']");
    chatList.forEach((chat, index) => {
        const contactName = chat.querySelector("._21S-L")?.innerText || "Desconhecido";
        const contactNumber = chat.querySelector("[role='button'] span[title]")?.getAttribute("title") || "Número desconhecido";
        const profilePicture = chat.querySelector("img")?.src || "https://via.placeholder.com/40";
        
        const messageElement = document.createElement("div");
        messageElement.classList.add("message");
        messageElement.draggable = true;
        messageElement.id = `msg-${index}`;
        messageElement.innerHTML = `
            <img src="${profilePicture}" alt="Foto de perfil">
            <div class="info">${contactName} (${contactNumber})</div>
        `;

        messageElement.ondragstart = (event) => event.dataTransfer.setData("text/plain", event.target.id);
        document.getElementById("leads").appendChild(messageElement);
    });
}

setTimeout(captureMessages, 3000);