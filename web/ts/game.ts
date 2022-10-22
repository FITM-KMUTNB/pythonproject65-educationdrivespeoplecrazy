import { GameController, Mode, ModeSelector } from "./types.game"

let eel: any

const gameController: GameController = {
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
}

const quote = {
    short: () => eel.getShortQuote()(),
    medium: () => eel.getMediumQuote()(),
    long: () => eel.getLongQuote()(),
    thicc: () => eel.getThiccQuote()()
}

const modeSelector: ModeSelector = {
    short: document.getElementById("mode-short") as HTMLElement,
    medium: document.getElementById("mode-medium") as HTMLElement,
    long: document.getElementById("mode-long") as HTMLElement,
    thicc: document.getElementById("mode-thicc") as HTMLElement,
    selector: ["short", "medium", "long", "thicc"]
}

modeSelector.selector.map(mode => {
    modeSelector[mode].addEventListener("click", async () => {
        gameController.mode = mode as Mode;
        modeSelector.selector.map(mode => modeSelector[mode].classList.remove("active"));
        modeSelector[mode].classList.add("active");
        gameSetup();
    });
});

["btn-restart", "restart-btn"].map(id => {
    document.getElementById(id).addEventListener("click", () => {
        gameSetup();
    });
});

const gameContainerElement = document.getElementById("game-container") as HTMLElement;
const resultElement = document.getElementById("result") as HTMLElement;

const gameElement = document.getElementById("game") as HTMLElement;
const gameInputElement = document.getElementById("game-input") as HTMLInputElement;

async function gameSetup() {
    gameReset();
    gameController.tempQuote = await quote[gameController.mode]();
    gameController.tempChar = String(gameController.tempQuote).split("");

    gameController.tempChar.map((char, index) => {
        const charElement = document.createElement("span");
        charElement.id = `char-${index}`;
        charElement.classList.add("word");
        charElement.innerText = char;
        gameElement.appendChild(charElement);
        gameController.baseChar += 1;
    });

    gameInputElement.focus();
    document.getElementById("char-0").classList.add("word-active");
}

function gameInterveal() {
    if (gameController.timeInterval <= 0) {
        gameController.timeInterval = setInterval(() => {
            if (gameController.start) {
                gameController.time++;
            }
        }, 1000);
        // window.localStorage.setItem(gameController.timeInterval.toString(), gameController.timeInterval.toString());
    }
}

function gamePause() {
    gameController.start = false;
    clearInterval(gameController.timeInterval);
    gameController.timeInterval = -1;
}

function gameResume() {
    gameController.start = true;
    gameInterveal();
}

function gameReset() {
    gameElement.innerHTML = "";
    gameInputElement.value = "";
    gameInputElement.disabled = false;

    // window.localStorage.clear();

    gameController.baseChar = 0;
    gameController.correctChar = 0;
    gameController.incorrectChar = 0;
    gameController.totalChar = 0;
    gameController.tempQuote = "";
    gameController.tempChar = [];
    gameController.time = 0;
    gameController.timeInterval = -1;
    gameController.start = false;

    gameContainerElement.classList.remove("d-none");
    resultElement.classList.add("d-none");
}

async function gameFinish() {
    gameContainerElement.classList.add("d-none");
    resultElement.classList.remove("d-none");

    const { correctChar, incorrectChar, time } = gameController;

    const [wpm, accuracy, cpm] = await eel.resultCalc(correctChar, (correctChar + incorrectChar), time)();
    
    const user = window.localStorage.getItem("user")
    if(user !== null) {
        await eel.updateUserHistory(user, wpm, accuracy, cpm)();
    }

    document.getElementById("wpm-result").innerText = String(wpm).slice(0, 5);
    document.getElementById("accuracy-result").innerText = String(accuracy).slice(0, 5);
}

gameInputElement.addEventListener("blur", () => {
    gamePause();
});

gameInputElement.addEventListener("keydown", ({ key }) => {
    if (!gameController.start && (key !== ("Backspace" || "Shift"))) {
        gameResume();
    }

    const { tempChar, totalChar, baseChar, correctChar, incorrectChar } = gameController;

    if (incorrectChar > (baseChar / 5)) {
        alert("You have made too many mistakes. Please try again.");
        return gameSetup();
    }
    if (baseChar == totalChar && correctChar > (totalChar / 2)) return gameFinish();

    const charElement = document.getElementById(`char-${totalChar}`) as HTMLElement;
    const beforeCharElement = document.getElementById(`char-${totalChar - 1}`) as HTMLElement;
    const afterCharElement = document.getElementById(`char-${totalChar + 1}`) as HTMLElement;

    if ((key !== "Shift") && afterCharElement !== null) {
        afterCharElement.classList.add("word-active");
        afterCharElement.scrollIntoView();
    }

    if (key === tempChar[totalChar]) {
        if(tempChar[totalChar] === " ") {
            gameController.totalChar++;
            gameController.correctChar++;
            charElement.classList.remove("word-correct");
            charElement.classList.remove("word-active");
            gameInputElement.value = "";
        } else {
            charElement.classList.add("word-correct");
            charElement.classList.remove("word-active");
            gameController.totalChar++;
            gameController.correctChar++;
        }
    } else if (key === "Backspace") {
        if (totalChar > 0) {
            gameController.totalChar--;
            
            if (beforeCharElement.classList.contains("word-correct")) {
                beforeCharElement.classList.remove("word-correct");
                beforeCharElement.classList.add("word-active");
                gameController.correctChar--;
            } else if (beforeCharElement.classList.contains("word-incorrect")) {
                beforeCharElement.classList.remove("word-incorrect");
                beforeCharElement.classList.add("word-active");
            }

            if (afterCharElement.classList.contains("word-correct")) {
                afterCharElement.classList.remove("word-correct");
            } else if (afterCharElement.classList.contains("word-incorrect")) {
                afterCharElement.classList.remove("word-incorrect");
            } else if (afterCharElement.classList.contains("word-active")) {
                afterCharElement.classList.remove("word-active");
            }

            tempChar.map((char, index) => {
                if (index >= totalChar) {
                    document.getElementById(`char-${index}`).classList.remove("word-correct");
                    document.getElementById(`char-${index}`).classList.remove("word-incorrect");
                    document.getElementById(`char-${index}`).classList.remove("word-active");
                }
            });
        }
    } else if (key == "Shift") {
        // do nothing
    } else {
        charElement.classList.remove("word-active");
        charElement.classList.add("word-incorrect");
        gameController.totalChar++;
        gameController.incorrectChar++;
    }
});

(gameSetup)()