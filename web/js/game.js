const gameController = {
    words: {
        correct: 0,
        incorrect: 0,
        total: 0
    },
    time: 0,
    mode: "medium"
}

const gameElement = {
    words: document.getElementById("words"),
    totalWords: document.getElementById("total-words"),
    baseGame: document.getElementById("game"),
}