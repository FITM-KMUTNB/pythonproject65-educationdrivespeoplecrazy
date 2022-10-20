from os import system
from random import choice
import eel

# eel.init('web')

# @eel.expose
# def getQuote():
#     return "Hello from Python!"

# eel.start('index.html', size=(800, 600))

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

def getShortQuote():
    print(len(short))
    quote = choice(short)
    return quote, len(quote.split(" "))

def getMediumQuote():
    print(len(medium))
    quote = choice(medium)
    return quote, len(quote.split(" "))

def getLongQuote():
    print(len(long))
    quote = choice(long)
    return quote, len(quote.split(" "))

def getThiccQuote():
    print(len(thicc))
    quote = choice(thicc)
    return quote, len(quote.split(" "))

print("Short:", getShortQuote())
print("Medium:", getMediumQuote())
print("Long:", getLongQuote())
print("Thicc:", getThiccQuote())