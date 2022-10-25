import eel

from os import system
from random import choice
from datetime import datetime

from tinydb import TinyDB, Query

USER = TinyDB('user.json')
LEADERBOARD = TinyDB('leaderboard.json')

eel.init('web')

# Stort 20
# Medium 60
# Long 100
# Thicc 100+

system("cls")

def loadFile():
    with open('quotes.txt', "r") as f:
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

# Game Controller
@eel.expose
def resultCalc(correctChars: int, totalChars: int, time: int):
    wpm = (correctChars / 5) / (time / 60)
    accurary = (correctChars / totalChars) * 100
    cpm = correctChars / (time / 60)
    return wpm, accurary, cpm

# User Controller
@eel.expose
def checkUser(username: str):
    User = Query()
    result = USER.search(User.username == username)
    if len(result) == 0:
        return False
    else:
        return True

@eel.expose
def createUser(username: str):
    USER.insert({ "username": username, "history": [] })
    return True

@eel.expose
def getUserHistory(username: str):
    if checkUser(username):
        User = Query()
        result = USER.search(User.username == username)
        return result[0]["history"]
    else:
        return []

@eel.expose
def updateUserHistory(username: str, wpm: int, accurary: int, cpm: int):
    if not checkUser(username):
        return False
    User = Query()
    result = USER.search(User.username == username)
    
    history = result[0]["history"]
    # Check if wpm is higher than the last one
    if len(history) == 0:
        history.append({ "wpm": wpm, "accurary": accurary, "cpm": cpm, "date": datetime.now().strftime("%d/%m/%Y %H:%M:%S") })

        updateLeaderboard(username, wpm, accurary, cpm)
        return True
    else:
        history.append({ "wpm": wpm, "accurary": accurary, "cpm": cpm, "date": datetime.now().strftime("%d/%m/%Y %H:%M:%S") })

    USER.update({ "history": history }, Query().username == username)
    tempData = {}
    bestWpm = 0
    for data in history:
        if data["wpm"] > bestWpm:
            bestWpm = data["wpm"]
            tempData = {
                "wpm": data["wpm"],
                "accurary": data["accurary"],
                "cpm": data["cpm"],
                "date": data["date"]
            }

    updateLeaderboard(username, tempData["wpm"], tempData["accurary"], tempData["cpm"])

# Leaderboard Controller
@eel.expose
def getLeaderboard():
    return LEADERBOARD.all()

def updateLeaderboard(username: str, wpm: int, accurary: int, cpm: int):
    if LEADERBOARD.search(Query().username == username):
        LEADERBOARD.update({ "wpm": wpm, "accurary": accurary, "cpm": cpm, "date": datetime.now().strftime("%d/%m/%Y %H:%M:%S") }, Query().username == username)
    else:
        LEADERBOARD.insert({ "username": username, "wpm": wpm, "accurary": accurary, "cpm": cpm, "date": datetime.now().strftime("%d/%m/%Y %H:%M:%S") })

eel.start('index.html', size=(800, 600))