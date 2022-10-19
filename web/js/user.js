const navbar = document.getElementById('jsMainNavbar');

const user = {
    name: window.localStorage.getItem('name') || 'Guest',
    history: JSON.parse(window.localStorage.getItem('history')) || [],
}

const userInput = document.getElementById("username");

if (user.name !== 'Guest') {
    userInput.value = user.name;
} else {
    userInput.value = '';
}

function loadHistory() {
    const historyElement = document.getElementById("history");
    historyElement.innerHTML = '';
    user.history.forEach((item, index) => {
        const historyItem = document.createElement("li");
        historyItem.classList.add("list-group-item");
        historyItem.innerHTML = `${item.name} - ${item.score}`;
        historyElement.appendChild(historyItem);
    });
}