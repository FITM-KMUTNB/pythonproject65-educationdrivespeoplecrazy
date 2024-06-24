const userInputElement = document.getElementById('user-input');
const userSigninCache = window.localStorage.getItem('user');

userInputElement.addEventListener("keydown", key => {
    if (key.key === "Enter") {
        databaseCheck();
        window.location.reload();
    }
});

document.getElementById("user-save").addEventListener("click", () => {
    databaseCheck();
    window.location.reload();
});

document.getElementById("user-reset").addEventListener("click", () => {
    window.localStorage.removeItem('user');
    window.location.reload();
});

if (userSigninCache) {
    userInputElement.value = userSigninCache;
    databaseCheck();
} else {
    document.getElementById("history-btn").classList.add("d-none");
    document.getElementById("user-reset").classList.add("d-none");
}

async function databaseCheck() {
    const userResponse = await eel.checkUser(userInputElement.value)();
    if (userResponse) {
        window.localStorage.setItem('user', userInputElement.value);
    }
    else {
        await eel.createUser(userInputElement.value)();
        window.localStorage.setItem('user', userInputElement.value);
    }
}

async function getUserHistory() {
    const userHistory = await eel.getUserHistory(userInputElement.value)();
    return userHistory;
}

async function getLeaderboard() {
    let leaderboard = await eel.getLeaderboard()();
    return leaderboard;
}

document.getElementById("leaderboard-btn").addEventListener("click", async () => {
    const leaderboard = await getLeaderboard();
    const leaderboardOL = document.getElementById("leaderboard-ol");
    leaderboardOL.innerHTML = "";
    if (leaderboard.length === 0) {
        leaderboardOL.classList.remove("list-group-numbered");
        leaderboardOL.innerHTML = "<li class='list-group-item'>No data available</li>";
    } else {
        leaderboardOL.classList.add("list-group-numbered");
        leaderboard.map((entry, index) => {
            const li = document.createElement("li");
            li.classList.add("list-group-item");
            li.classList.add("d-flex");
            li.classList.add("justify-content-between");
            li.classList.add("align-items-center");
            const div = document.createElement("div");
            div.classList.add("d-flex");
            div.classList.add("justify-content-between");
            div.classList.add("align-items-center");
            div.style.width = "100%";
            if (index < 3) {
                li.classList.add(index == 0 ? "first" : index == 1 ? "second" : "third");
                const img = document.createElement("img");
                img.src = `./images/${index == 0 ? "gold" : index == 1 ? "silver" : "bronze"}-medal.png`;
                img.style.width = "30px";
                img.style.marginLeft = "2px";
                li.appendChild(img);
            }
            const fontBold = document.createElement("div");
            fontBold.classList.add("fw-bold");
            fontBold.innerText = entry.username;
            const span = document.createElement("span");
            span.classList.add("badge");
            span.classList.add("bg-primary");
            span.classList.add("rounded-pill");
            span.innerText = `${entry.wpm} WPM / ${entry.accuracy}%`;
            div.appendChild(fontBold);
            div.appendChild(span);
            li.appendChild(div);
            leaderboardOL.appendChild(li);
        });
    }
});

document.getElementById("history-btn").addEventListener("click", async () => {
    const history = await getUserHistory();
    const historyOL = document.getElementById("history-ol");
    historyOL.innerHTML = "";
    if (history.length === 0) {
        historyOL.classList.remove("list-group-numbered");
        historyOL.innerHTML = "<li class='list-group-item'>No data available</li>";
    } else {
        historyOL.classList.add("list-group-numbered");
        history.map((entry) => {
            const li = document.createElement("li");
            li.classList.add("list-group-item");
            li.classList.add("d-flex");
            li.classList.add("justify-content-between");
            li.classList.add("align-items-center");
            const div = document.createElement("div");
            div.classList.add("d-flex");
            div.classList.add("justify-content-between");
            div.classList.add("align-items-center");
            div.style.width = "100%";
            const fontBold = document.createElement("div");
            fontBold.classList.add("fw-bold");
            fontBold.innerText = entry.date;
            const span = document.createElement("span");
            span.classList.add("badge");
            span.classList.add("bg-primary");
            span.classList.add("rounded-pill");
            span.innerText = `${entry.wpm} WPM / ${entry.accuracy}%`;
            div.appendChild(fontBold);
            div.appendChild(span);
            li.appendChild(div);
            historyOL.appendChild(li);
        });
    }
});

(databaseCheck)()