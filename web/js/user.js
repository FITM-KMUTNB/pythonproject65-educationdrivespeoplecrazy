const userInputElement = document.getElementById('user-input');
const userSigninCache = window.localStorage.getItem('user');

if (userSigninCache) {
    userInputElement.value = userSigninCache;
    databaseCheck();
} else {
    document.getElementById("history-btn").classList.add("d-none");
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
    leaderboard = leaderboard.sort((a, b) => {
        return b.wpm - a.wpm;
    });
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
            if (index === 0) {
                li.classList.add("first");
                const img = document.createElement("img");
                img.src = "./images/gold-medal.png";
                img.style.width = "30px";
                img.style.marginLeft = "2px";
                li.appendChild(img);
            }
            else if (index === 1) {
                li.classList.add("second");
                const img = document.createElement("img");
                img.src = "./images/silver-medal.png";
                img.style.width = "30px";
                img.style.marginLeft = "2px";
                li.appendChild(img);
            }
            else if (index === 2) {
                li.classList.add("third");
                const img = document.createElement("img");
                img.src = "./images/bronze-medal.png";
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
            span.innerText = `${String(entry.wpm).slice(0, 5)} WPM / ${String(entry.accurary).slice(0, 5)}% ACC / ${String(entry.cpm).slice(0, 5)} CPM`;
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
            span.innerText = `${String(entry.wpm).slice(0, 5)} WPM / ${String(entry.accurary).slice(0, 5)}% ACC / ${String(entry.cpm).slice(0, 5)} CPM`;
            div.appendChild(fontBold);
            div.appendChild(span);
            li.appendChild(div);
            historyOL.appendChild(li);
        });
    }
});

document.getElementById("user-save").addEventListener("click", () => {
    databaseCheck();
    window.location.reload();
});
(databaseCheck)()