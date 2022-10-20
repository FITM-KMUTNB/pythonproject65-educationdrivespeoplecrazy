from os import system
from random import choice
import eel

eel.init('web')

# Stort 20
# Medium 60
# Long 100
# Thicc 100+

system("cls")

def loadFile():
    with open('private/quotes.txt', "r") as f:
        return f.readlines()

quotes = loadFile()

# print(quotes[0])
def getQuoteLength():
    shortQuote = []
    mediumQuote = []
    longQuote = []
    thiccQuote = []
    for quote in quotes:
        quote = quote.strip("\n")
        tempQ = quote.split(" ")
        if len(tempQ) <= 5:
            continue
        elif len(tempQ) <= 20:
            shortQuote.append(quote)
        elif len(tempQ) <= 60:
            mediumQuote.append(quote)
        elif len(tempQ) <= 100:
            longQuote.append(quote)
        else:
            thiccQuote.append(quote)

    return shortQuote, mediumQuote, longQuote, thiccQuote

short, medium, long, thicc = getQuoteLength()

@eel.expose
def getShortQuote():
    # print(len(short))
    quote = choice(short)
    return quote

@eel.expose
def getMediumQuote():
    # print(len(medium))
    quote = choice(medium)
    return quote

@eel.expose
def getLongQuote():
    # print(len(long))
    quote = choice(long)
    return quote

@eel.expose
def getThiccQuote():
    # print(len(thicc))
    quote = choice(thicc)
    return quote

@eel.expose
def resultCalc(correctChars, totalChars, time):
    wpm = (correctChars / 5) / (time / 60)
    accurary = (correctChars / totalChars) * 100
    return wpm, accurary

eel.start('index.html', size=(800, 600), mode=None)