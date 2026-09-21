async function sendMessage() {
    const input = document.getElementById("user-input");
    const chatBox = document.getElementById("chat-box");

    const message = input.value.trim();

    if (message === "") {
        return;
    }

    // Show user message
    const userMessage = document.createElement("div");
    userMessage.className = "user-message";
    userMessage.textContent = message;
    chatBox.appendChild(userMessage);

    input.value = "";

    // Save user message
    saveMessage("user", message);

    // Send message to Python
    const response = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: message
        })
    });

    const data = await response.json();

    // Show bot response
    const botMessage = document.createElement("div");
    botMessage.className = "bot-message";
    botMessage.textContent = data.reply;
    chatBox.appendChild(botMessage);

    // Save bot response
    saveMessage("bot", data.reply);

    // Bot voice reply
    const speech = new SpeechSynthesisUtterance(data.reply);
    speech.lang = "en-US";
    speech.rate = 1;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);

    chatBox.scrollTop = chatBox.scrollHeight;
}
function startVoice() {

    const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        alert("Voice input is not supported in this browser.");
        return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.start();

    recognition.onresult = function(event) {
        const text = event.results[0][0].transcript;

        document.getElementById("user-input").value = text;
    };
}
function saveMessage(sender, message) {
    let history = JSON.parse(localStorage.getItem("chatHistory")) || [];

    history.push({
        sender: sender,
        message: message
    });

    localStorage.setItem("chatHistory", JSON.stringify(history));
}
window.onload = function () {

    const history =
        JSON.parse(localStorage.getItem("chatHistory")) || [];

    const chatBox = document.getElementById("chat-box");

    history.forEach(function(chat) {

        const message = document.createElement("div");

        message.className =
            chat.sender === "user"
                ? "user-message"
                : "bot-message";

        message.textContent = chat.message;

        chatBox.appendChild(message);
    });
};