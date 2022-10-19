import eel

eel.init('web')

@eel.expose
def getQuote():
    return "Hello from Python!"

eel.start('index.html', size=(800, 600))