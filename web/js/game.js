const gameController = {
    words: {
        base: 0,
        correct: 0,
        incorrect: 0,
        total: 0
    },
    time: {
        base: 30,
        total: 0
    },
    mode: "30s"
}

const gameElement = {
    time: document.getElementById("time"),
    words: document.getElementById("words"),
    totalWords: document.getElementById("total-words"),
    baseGame: document.getElementById("game"),
}

const gameModeElement = {
    mode30s: document.getElementById("mode-30s"),
    mode60s: document.getElementById("mode-60s"),
    modeWords: document.getElementById("mode-words"),
    modeQuote: document.getElementById("mode-quote")
}

gameModeElement.mode30s.onclick = () => {
    gameModeElement.mode30s.classList.add("active");

    gameModeElement.mode60s.classList.remove("active");
    gameModeElement.modeWords.classList.remove("active");
    gameModeElement.modeQuote.classList.remove("active");

    gameController.mode = "30s";
    gameController.time.base = "30s";
    resetGame();
}

gameModeElement.mode60s.onclick = () => {
    gameModeElement.mode60s.classList.add("active");

    gameModeElement.mode30s.classList.remove("active");
    gameModeElement.modeWords.classList.remove("active");
    gameModeElement.modeQuote.classList.remove("active");

    gameController.mode = "60s";
    gameController.time.base = "60s";
    resetGame();
}

gameModeElement.modeWords.onclick = () => {
    gameModeElement.modeWords.classList.add("active");

    gameModeElement.mode30s.classList.remove("active");
    gameModeElement.mode60s.classList.remove("active");
    gameModeElement.modeQuote.classList.remove("active");

    gameController.mode = "words";
    gameController.words.base = 30;
    resetGame();
}

gameModeElement.modeQuote.onclick = () => {
    gameModeElement.modeQuote.classList.add("active");

    gameModeElement.mode30s.classList.remove("active");
    gameModeElement.mode60s.classList.remove("active");
    gameModeElement.modeWords.classList.remove("active");

    gameController.mode = "quote";
    resetGame();
}

function resetGame(){
    switch(gameController.mode){
        case "30s":
            gameController.time.base = 30;
        case "60s":
            gameController.time.base = 60;
        case "words":
            gameController.words.base = 30;
        case "quote":
            gameController.words.base = 0;
        default:
            gameController.time.base = 30;
    }
    return gameController.mode;
}

function gameInit(){
    const mode = resetGame();

    gameElement.baseGame.innerHTML = "<h3 style='text-align: center'>Waiting . . .</h3>";

    if(mode == "30s" || mode == "60s"){
        document.getElementById("time").innerHTML = gameController.time.base;
    } else if (mode == "words"){
        document.getElementById("words").innerHTML = gameController.words.base;
    } else if (mode == "quote"){
        const data = loadQuote();
        data.then((quote) => {
            for(words in quote.split(" ")){
                const ele = document.createElement("span");
                ele.innerHTML = words;
                ele.id = "word-" + words;
                ele.classList.add("word");
                document.getElementById("quote").appendChild(ele);
                gameController.words.base++;
            }
        });
    }
}

async function loadQuote(){
    const quote = await eel.getQuote()();
    return quote;
}