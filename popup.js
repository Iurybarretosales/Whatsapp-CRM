document.getElementById("ativar").addEventListener("click", () => {
    console.log("Botão Ativar clicado!");
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: ativarKanban
        });
    });
});

function ativarKanban() {
    console.log("Função ativarKanban chamada!");

    // Criar a nova aba para o Kanban
    const newWindow = window.open("about:blank", "_blank");
    if (!newWindow) {
        alert("Por favor, permita pop-ups para usar a funcionalidade do Kanban.");
        return;
    }

    newWindow.document.title = "Kanban CRM";
    newWindow.document.body.innerHTML = `
       <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

    :root {
        --primary-color: #25D366;
        --secondary-color: #F8F9FA;
        --text-color: #222;
        --border-radius: 10px;
        --shadow-light: 0px 2px 6px rgba(0, 0, 0, 0.08);
        --shadow-medium: 0px 4px 10px rgba(0, 0, 0, 0.12);
        --shadow-heavy: 0px 6px 16px rgba(0, 0, 0, 0.18);
    }

    body {
        font-family: 'Inter', sans-serif;
        background: #f4f5f7;
        margin: 0;
        padding: 20px;
    }

    /* Painel principal */
    #kanban-panel {
        margin: auto;
        max-width: 100%;
        height: 90vh;
        background: white;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-medium);
        padding: 20px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
    }

    /* Cabeçalho */
    .kanban-title {
        font-size: 26px;
        font-weight: bold;
        text-align: center;
        margin-bottom: 15px;
        color: var(--text-color);
        padding-bottom: 12px;
        border-bottom: 2px solid var(--secondary-color);
    }

    /* Área das colunas */
    #kanban-columns {
        display: flex;
        gap: 18px;
        justify-content: flex-start; /* Ajusta as colunas para começar à esquerda */
        flex-wrap: nowrap; /* Permite ajuste responsivo */
        padding-top: 10px;
    }

    /* Estilo das colunas */
    .kanban-column {
        flex: 0 0 300px; /* Cresce, encolhe e ocupa no mínimo 300px */
        max-width: 320px;
        background: var(--secondary-color);
        padding: 18px;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-light);
        text-align: center;
        transition: all 0.3s ease-in-out;
        border-top: 4px solid var(--primary-color);
    }

    .kanban-column strong {
        font-size: 18px;
        color: var(--text-color);
    }

    .column-subtitle {
        font-size: 14px;
        color: #555;
        margin-top: 5px;
    }

    /* Cartões */
    .message {
        background: white;
        margin: 10px 0;
        padding: 14px;
        border-radius: var(--border-radius);
        cursor: grab;
        font-size: 15px;
        box-shadow: var(--shadow-light);
        transition: transform 0.2s ease-in-out, box-shadow 0.3s;
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .message:hover {
        box-shadow: var(--shadow-medium);
    }

    /* Efeito ao arrastar */
    .message:active {
        transform: scale(1.05);
        box-shadow: var(--shadow-heavy);
    }

    /* Imagem do contato */
    .message img {
        width: 45px;
        height: 45px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid var(--primary-color);
    }

    /* Nome do contato */
    .message .contact-info {
        font-weight: bold;
        color: var(--text-color);
        flex-grow: 1;
        text-align: left;
    }

    /* Botão */
    button {
        background-color: var(--primary-color);
        color: white;
        border: none;
        padding: 12px 20px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        border-radius: var(--border-radius);
        transition: all 0.3s ease;
    }

    button:hover {
        background-color: #1EBE5D;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
    }

    button:active {
        background-color: #18A84C;
        box-shadow: inset 0px 2px 5px rgba(0, 0, 0, 0.2);
    }

    /* Responsividade */
    @media (max-width: 768px) {
        #kanban-columns {
            flex-direction: column;
            align-items: center; /* Alinha as colunas ao centro em telas pequenas */
        }

        .kanban-column {
            max-width: 100%; /* Faz com que as colunas ocupem 100% da largura em telas pequenas */
        }
    }
        .delete-btn {
            background: none;
            border: none;
            color: red;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
            margin-left: auto;
        }

        .delete-btn:hover {
            color: darkred;
        }


</style>
</head>
<body>
    <div id="kanban-panel">
        <div class="kanban-header">
            <h3 class="kanban-title">Kanban CRM</h3>
            <button id="add-column">➕ Nova Coluna</button>
            <a href="https://iurygestor.github.io/Simulador/" target="_blank"><button id="simulador">Simulador</button></a>
        </div>

        <div id="kanban-columns">
            <div id="novos" class="kanban-column" ondragover="event.preventDefault()" ondrop="drop(event)">
                <h1>📥 Novos</h1>
                <p class="column-subtitle">Leads recém-adicionados</p>
            </div>
        </div>
    </div>
    

</body>

`;
//adicionar coluna 
newWindow.document.getElementById("add-column").addEventListener("click", function() {
    const kanbanColumns = newWindow.document.getElementById("kanban-columns");
    const newColumn = newWindow.document.createElement("div");
    newColumn.classList.add("kanban-column");
    newColumn.setAttribute("ondragover", "event.preventDefault()");
    newColumn.setAttribute("ondrop", "drop(event)");

    // Criar o título da coluna com conteúdo editável
    const title = newWindow.document.createElement("strong");
    title.textContent = "Nova Coluna";
    title.setAttribute("contenteditable", "true");
    newColumn.appendChild(title);

    // Criar o botão X para remover a coluna
    const closeButton = newWindow.document.createElement("button");
    closeButton.innerHTML = "❌";
    closeButton.classList.add("delete-btn");
    closeButton.addEventListener("click", function() {
        newColumn.remove(); // Remove a coluna
    });

    // Adicionar o botão X à nova coluna
    newColumn.appendChild(closeButton);

    // Adicionar a nova coluna ao painel Kanban
    kanbanColumns.appendChild(newColumn);

    // Garantir que as colunas possam ser arrastadas e soltas
    initializeDragAndDrop();
});
// Adiciona eventos de drop para todas as colunas (inclusive novas)

function initializeDragAndDrop() {
    const kanbanColumns = newWindow.document.querySelectorAll(".kanban-column");
    
    kanbanColumns.forEach(column => {
        column.addEventListener("dragover", event => event.preventDefault());
        column.addEventListener("drop", drop);
    });
}

// Função para iniciar o arrasto
function drag(event) {
    event.dataTransfer.setData("text/plain", event.target.id);
    event.target.classList.add("dragging"); // Adiciona classe para efeito visual
}

// Função para soltar em outra coluna
function drop(event) {
    event.preventDefault();
    
    const data = event.dataTransfer.getData("text");
    const draggedElement = newWindow.document.getElementById(data);
    
    let targetColumn = event.target;
    while (!targetColumn.classList.contains("kanban-column")) {
        targetColumn = targetColumn.parentElement;
    }

    targetColumn.appendChild(draggedElement);
    draggedElement.classList.remove("dragging");
}

    // Atualiza as mensagens e adiciona eventos de arrastar
function captureMessages() {
    const chatList = document.querySelectorAll("div[role='listitem']");
    const kanbanColumn = newWindow.document.getElementById("novos");
    
    kanbanColumn.innerHTML = ""; // Remove mensagens antigas antes de adicionar novas

    chatList.forEach((chat, index) => {
        const contactNameElement = chat.querySelector("span[title]");
        const contactName = contactNameElement ? contactNameElement.innerText : "Desconhecido";
    
        const lastMessageElement = chat.querySelector("div[role='gridcell']:nth-child(2) span");
        const lastMessage = lastMessageElement ? lastMessageElement.innerText : "Sem mensagem";
    
        const contactNumber = contactNameElement ? contactNameElement.getAttribute("title") : "Número desconhecido";
    
        const profilePicture = chat.querySelector("img")?.src || "https://via.placeholder.com/40";

        const messageElement = document.createElement("div");
        messageElement.classList.add("message");
        messageElement.draggable = true;
        messageElement.id = `msg-${index}`;

        // Criar botão X para remover
        const closeButton = document.createElement("button");
        closeButton.innerHTML = "❌";
        closeButton.classList.add("delete-btn");
        closeButton.addEventListener("click", function() {
            messageElement.remove(); // Remove a mensagem
        });

        messageElement.innerHTML = `
            <img src="${profilePicture}" alt="Foto de perfil">
            <div class="contact-info">${contactName} (${contactNumber})</div>
        `;
         // Adicionar botão X na div
         messageElement.appendChild(closeButton);

        kanbanColumn.appendChild(messageElement);
        messageElement.addEventListener("dragstart", drag);
    });

    // Garante que as colunas sempre tenham os eventos de drag & drop
    initializeDragAndDrop();
}

    // Capturar mensagens após um delay para garantir que o WhatsApp Web carregou
    setTimeout(() => {
        captureMessages();
    }, 2000);


    setInterval(() => {
        captureMessages();
    }, 2000);
}
