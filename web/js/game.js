const gameController = {
    mode: "medium",
    baseChar: 0,
    correctChar: 0,
    incorrectChar: 0,
    totalChar: 0,
    tempQuote: "",
    tempChar: [],
    time: 0,
    timeInterval: -1,
    start: false
};
const modeSelector = {
    short: document.getElementById("mode-short"),
    medium: document.getElementById("mode-medium"),
    long: document.getElementById("mode-long"),
    thicc: document.getElementById("mode-thicc"),
};
const modeSelectorList = ["short", "medium", "long", "thicc"];
modeSelectorList.map(mode => {
    modeSelector[mode].addEventListener("click", () => {
        gameController.mode = mode;
        for (let tempMode in modeSelectorList) {
            modeSelector[modeSelectorList[tempMode]].classList.remove("active");
        }
        modeSelector[mode].classList.add("active");
        gameController.mode = mode;
        gameSetup();
    });
});
const gameElement = document.getElementById("game");
const gameInputElement = document.getElementById("game-input");
gameInputElement.onfocus = () => {
    modeSelectorList.map(mode => {
        modeSelector[mode].classList.add("disabled");
    });
    const tempChar = document.getElementById(`char-${gameController.totalChar}`);
    tempChar.classList.add("word-active");
    if (gameController.timeInterval <= 0) {
        gameController.timeInterval = setInterval(() => {
            if (gameController.start) {
                gameController.time++;
            }
        }, 1000);
    }
};
gameInputElement.onblur = () => {
    modeSelectorList.map(mode => {
        modeSelector[mode].classList.remove("disabled");
    });
    gameController.start = false;
};
gameInputElement.onkeydown = (e) => {
    if (!gameController.start && (e.key !== ("Backspace" || "Shift"))) {
        gameController.start = true;
    }
    const tempChar = document.getElementById(`char-${gameController.totalChar}`);
    const tempCharR1 = document.getElementById(`char-${gameController.totalChar - 1}`);
    const tempChar1 = document.getElementById(`char-${gameController.totalChar + 1}`);
    if (tempChar1 != null) {
        tempChar1.classList.add("word-active");
    }
    if (gameController.totalChar + 1 === gameController.baseChar) {
        gameFinish();
        return;
    }
    else {
        if (e.key === "Backspace") {
            if (gameController.totalChar === 0)
                return;
            gameController.totalChar--;
            if (tempCharR1.classList.value.includes("word-correct")) {
                gameController.correctChar--;
            }
            else {
                gameController.incorrectChar--;
            }
            tempCharR1.classList.remove("word-correct");
            tempCharR1.classList.remove("word-incorrect");
            tempChar.classList.remove("word-active");
            if (tempChar1 != null)
                tempChar1.classList.remove("word-active");
            return;
        }
        if (e.key === tempChar.innerText) {
            tempChar.classList.add("word-correct");
            gameController.correctChar++;
            gameController.totalChar++;
        }
        else if (e.key !== "Shift") {
            tempChar.classList.add("word-incorrect");
            gameController.incorrectChar++;
            gameController.totalChar++;
        }
    }
};
async function gameFinish() {
    const lastestGame = { ...gameController };
    gameController.start = false;
    clearInterval(gameController.timeInterval);
    modeSelectorList.map(mode => {
        modeSelector[mode].classList.remove("disabled");
    });
    const result = await eel.resultCalc(gameController.correctChar, gameController.baseChar, gameController.time)();
    gameController.time = 0;
    gameController.correctChar = 0;
    gameController.incorrectChar = 0;
    gameController.totalChar = 0;
    gameController.baseChar = 0;
    gameController.timeInterval = -1;
    gameElement.innerHTML = "";
    gameInputElement.value = "";
    gameInputElement.disabled = true;
    const resultElement = document.createElement("div");
    resultElement.classList.value = "d-flex flex-column justify-content-center align-content-center";
    resultElement.innerHTML = "<h4>Result</h4>";
    const wpmElement = document.createElement("span");
    wpmElement.innerText = `WPM: ${String(result[0]).slice(0, 5)}`;
    const accuracyElement = document.createElement("span");
    accuracyElement.innerText = `Accuracy: ${result[1]}%`;
    const timeElement = document.createElement("span");
    timeElement.innerText = `Time: ${lastestGame.time}s`;
    resultElement.appendChild(wpmElement);
    resultElement.appendChild(accuracyElement);
    resultElement.appendChild(timeElement);
    gameElement.appendChild(resultElement);
}
async function gameSetup() {
    let quotesTemp;
    switch (gameController.mode) {
        case "short":
            quotesTemp = await eel.getShortQuote()();
            break;
        case "medium":
            quotesTemp = await eel.getMediumQuote()();
            break;
        case "long":
            quotesTemp = await eel.getLongQuote()();
            break;
        case "thicc":
            quotesTemp = await eel.getThiccQuote()();
            break;
    }
    gameController.tempQuote = await quotesTemp;
    gameElement.innerHTML = "";
    gameInputElement.value = "";
    gameController.time = 0;
    gameController.correctChar = 0;
    gameController.incorrectChar = 0;
    gameController.totalChar = 0;
    gameController.baseChar = 0;
    gameController.timeInterval = -1;
    const chars = String(gameController.tempQuote).split("");
    chars.map(char => {
        const tempCharElement = document.createElement("span");
        tempCharElement.classList.add("word");
        tempCharElement.innerText = char;
        tempCharElement.id = `char-${gameController.baseChar}`;
        gameElement.appendChild(tempCharElement);
        gameController.baseChar++;
    });
}
(gameSetup)();
