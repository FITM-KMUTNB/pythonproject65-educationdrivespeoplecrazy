def loadQuotes():
    with open("private/quotes.txt", "r") as f:
        quotes = f.read().splitlines()
        f.close()
    return quotes

def loadWords():
    with open("private/words.txt", "r") as f:
        words = f.read().splitlines()
        f.close()
    return words