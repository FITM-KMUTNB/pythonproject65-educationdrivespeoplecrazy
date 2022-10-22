const userInputElement = document.getElementById('user-input');
const userSigninCache = window.localStorage.getItem('user');
if (userSigninCache) {
    userInputElement.value = userSigninCache;
}
else {
    userInputElement.value = "Guest";
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
    document.getElementById("loading").style.display = "none";
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
        }
        else if (index === 1) {
            li.classList.add("second");
        }
        else if (index === 2) {
            li.classList.add("third");
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
});
// document.getElementById("history-btn").addEventListener("click", async () => {
//     const history = await getUserHistory() as HistoryEntry[];
//     const historyOL = document.getElementById("history-ol");
//     historyOL.innerHTML = "";
//     history.map((entry) => {
//         const li = document.createElement("li");
//         li.classList.add("list-group-item");
//         li.classList.add("d-flex");
//         li.classList.add("justify-content-between");
//         li.classList.add("align-items-center");
//         const fontBold = document.createElement("div");
//         fontBold.classList.add("fw-bold");
//         fontBold.innerText = entry.date;
//         const span = document.createElement("span");
//         span.classList.add("badge");
//         span.classList.add("bg-primary");
//         span.classList.add("rounded-pill");
//         span.innerText = `${entry.wpm} WPM / ${entry.accurary}% ACC / ${entry.cpm} CPM | ${entry.date}`;
//         li.appendChild(fontBold);
//         li.appendChild(span);
//         historyOL.appendChild(li);
//     });
// });
document.getElementById("user-save").addEventListener("click", () => databaseCheck());
