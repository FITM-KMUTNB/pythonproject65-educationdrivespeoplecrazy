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
    accuracy = (correctChars / totalChars) * 100
    cpm = correctChars / (time / 60)
    return round(wpm, 2), round(accuracy, 2), round(cpm, 2)

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
    if not checkUser(username) and len(username) > 4:
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
def updateUserHistory(username: str, wpm: int, accuracy: int, cpm: int):
    firstTime = False
    if not checkUser(username):
        return False
    User = Query()
    result = USER.search(User.username == username)
    
    history = result[0]["history"]
    # Check if wpm is higher than the last one
    if len(history) == 0:
        updateLeaderboard(username, wpm, accuracy, cpm)
        firstTime = True
    history.append({ "wpm": wpm, "accuracy": accuracy, "cpm": cpm, "date": datetime.now().strftime("%d/%m/%Y %H:%M:%S") })

    USER.update({ "history": history }, User.username == username)
    
    if not firstTime:
        High = Query()
        result = LEADERBOARD.search(High.username == username)
        if result[0]["wpm"] < wpm:
            updateLeaderboard(username, wpm, accuracy, cpm)

# Leaderboard Controller
@eel.expose
def getLeaderboard():
    return sorted(LEADERBOARD.all(), key=lambda k: k['wpm'], reverse=True)

def updateLeaderboard(username: str, wpm: int, accuracy: int, cpm: int):
    if LEADERBOARD.search(Query().username == username):
        LEADERBOARD.update({ "wpm": wpm, "accuracy": accuracy, "cpm": cpm, "date": datetime.now().strftime("%d/%m/%Y %H:%M:%S") }, Query().username == username)
    else:
        LEADERBOARD.insert({ "username": username, "wpm": wpm, "accuracy": accuracy, "cpm": cpm, "date": datetime.now().strftime("%d/%m/%Y %H:%M:%S") })

eel.start('index.html', size=(800, 600))