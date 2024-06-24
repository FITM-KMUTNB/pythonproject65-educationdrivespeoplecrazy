const gameController = {
    mode: "medium",
    correctChar: 0,
    incorrectChar: 0,
    totalChar: 0,
    tempChar: [],
    time: 0,
    timeInterval: null,
    start: false
}

const quote = {
    short: () => eel.getShortQuote()(),
    medium: () => eel.getMediumQuote()(),
    long: () => eel.getLongQuote()(),
    thicc: () => eel.getThiccQuote()()
}

const selector = ["short", "medium", "long", "thicc"];
selector.map(mode => {
    const element = document.getElementById(`mode-${mode}`);
    element.addEventListener("click", async () => {
        gameController.mode = mode;
        selector.map(modeTemp => document.getElementById(`mode-${modeTemp}`).classList.remove("active"));
        element.classList.add("active");
        gameSetup();
    });
});

["btn-restart", "restart-btn"].map(id => document.getElementById(id).addEventListener("click", gameSetup));

const gameContainerElement = document.getElementById("game-container");
const resultElement = document.getElementById("result");
const gameElement = document.getElementById("game");
const gameInputElement = document.getElementById("game-input");
const timeDisplay = document.getElementById("time-display");

async function gameSetup() {
    gameReset();
    const tempQuote = await quote[gameController.mode]();
    gameController.tempChar = String(tempQuote).split("");
    gameController.tempChar.map((char, index) => {
        const charElement = document.createElement("span");
        charElement.id = `char-${index}`;
        charElement.classList.add("word");
        charElement.innerText = char;
        gameElement.appendChild(charElement);
    });
    gameInputElement.focus();
    document.getElementById("char-0").classList.add("word-active");

    gameController.timeInterval = setInterval(() => {
        if (gameController.start) {
            gameController.time += 1;
            timeDisplay.innerText = gameController.time;
        }
    }, 1000);
}

function gameReset() {
    clearInterval(gameController.timeInterval);
    gameElement.innerHTML = "";
    gameInputElement.value = "";
    gameInputElement.disabled = false;
    gameController.correctChar = 0;
    gameController.incorrectChar = 0;
    gameController.totalChar = 0;
    gameController.tempChar = [];
    gameController.time = 0;
    gameController.timeInterval = null;
    gameController.start = false;
    
    gameContainerElement.classList.remove("d-none");
    resultElement.classList.add("d-none");
    timeDisplay.innerText = 0;
}

async function gameFinish() {
    gameContainerElement.classList.add("d-none");
    resultElement.classList.remove("d-none");
    const { correctChar, incorrectChar, time } = gameController;
    const [wpm, accuracy, cpm] = await eel.resultCalc(correctChar, (correctChar + incorrectChar), time)();
    const user = window.localStorage.getItem("user");
    if (user?.length > 4) {
        await eel.updateUserHistory(user, wpm, accuracy, cpm)();
    }
    document.getElementById("wpm-result").innerText = wpm;
    document.getElementById("accuracy-result").innerText = accuracy;
}

gameInputElement.addEventListener("blur", () => {
    gameController.start = false;
});

gameInputElement.addEventListener("keydown", ({ key }) => {
    if (!gameController.start && (key.length != 1 || key === " ")) gameController.start = true;

    const classList = ["word-active", "word-correct", "word-incorrect"];
    const { tempChar, totalChar, correctChar, incorrectChar } = gameController;

    if (incorrectChar > (tempChar.length / 5)) {
        alert("You have made too many mistakes. Please try again.");
        return gameSetup();
    }

    if (tempChar.length == (totalChar + 1) && correctChar > (totalChar / 2)) return gameFinish();

    const charElement = document.getElementById(`char-${totalChar}`);
    const beforeCharElement = document.getElementById(`char-${totalChar - 1}`);
    const afterCharElement = document.getElementById(`char-${totalChar + 1}`);

    if (!(key == "Shift" || key == "Tab" || key == "CapsLock" || key == "Control" || key == "Alt" || key == "Meta" || key == "ArrowLeft" || key == "ArrowRight" || key == "ArrowUp" || key == "ArrowDown" || key === "Backspace") && afterCharElement !== null) {
        afterCharElement.classList.add("word-active");
        afterCharElement.scrollIntoView();
    }

    if (key === "Backspace") {
        if (totalChar > 0) {
            gameController.totalChar--;
            if (beforeCharElement) {
                beforeCharElement.classList.remove(...classList);
                beforeCharElement.classList.add("word-active");
                gameController.correctChar--;
            }
            tempChar.filter((char, index) => index != totalChar).map((char, index) => index >= totalChar ? document.getElementById(`char-${index}`).classList.remove(...classList) : null);
        }
    }
    else if (key === tempChar[totalChar]) {
        if (tempChar[totalChar] === " ") {
            gameController.totalChar++;
            gameController.correctChar++;
            gameInputElement.value = "";
        }
        else {
            charElement.classList.add("word-correct");
            gameController.totalChar++;
            gameController.correctChar++;
        }
        charElement.classList.remove("word-active");
    }
    else if (key == "Shift" || key == "Tab" || key == "CapsLock" || key == "Control" || key == "Alt" || key == "Meta" || key == "ArrowLeft" || key == "ArrowRight" || key == "ArrowUp" || key == "ArrowDown") {
        // do nothing
    }
    else if (key == "Escape") {
        gameSetup();
    }
    else {
        charElement.classList.remove("word-active");
        charElement.classList.add("word-incorrect");
        gameController.totalChar++;
        gameController.incorrectChar++;
    }
});

(gameSetup)();
