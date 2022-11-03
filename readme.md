# Typing speedtest with Python eel

## Navigation
[1] [Installation](#installation)  
[2] [Usage](#usage)  
[3] [License](#license)

## Setup
- [Install Python 3.6 or higher](https://www.python.org/downloads/)
- [Create virtual environment and activate it](#create-virtual-environment)
- [Install requirements.txt](#install-requirements)
- Run `python main.py`

## Create virtual environment
### Windows `(Git Bash)`
- use `py -m venv env` to create virtual environment
- use `source ./env/Scripts/activate` to activate virtual environment
- use `deactivate` to deactivate virtual environment

### Linux
- use `python3 -m venv env` to create virtual environment
- use `source ./env/bin/activate` to activate virtual environment
- use `deactivate` to deactivate virtual environment

#### Check if virtual environment is activated
- `which python` should show the path to the virtual environment
- `python --version` should show the version of the virtual environment
- `pip list` should show the packages installed in the virtual environment

## Install requirements.txt
- use `pip install -r requirements.txt` to install all requirements

## Usage
- Run `python main.py` to start the application
- If you want to build an executable file, run `py -m eel main.py web --onefile --noconsole --icon=./web/favicon.ico`
- executable file will be in the `dist` folder

### On startup
- First time you start the application, application will create a `user.json` and `leaderboard.json` file to store user data and leaderboard data
- If you want to reset the application, delete the `user.json` and `leaderboard.json` file and restart the application

### Game
![typingeedit!](/images/typingedit1.png)

This is a game that tells your typing speed and accuracy.
There is also a leaderboard to compete with your friends who is faster.

- Game starts when you press any key on your keyboard `Check an input element is focused`
- Game ends when you finish the text
- Game will show your typing speed in `WPM` (words per minute) and `Accuracy` (percentage of correct characters)

1. You can view your leaderboard in navigation bar on leaderboard menu
2. You can view your statistics in navigation bar on history menu
3. Enter your name in the box and press save before typing.
Your name will be on the leaderboard after typing.
4. Game reset when you press `Esc` key or click on `Reset` button
5. You can choose between 4 different game modes [ `Short`, `Medium`, `Long`, `Thicc` ]
6. You can restart quotes by pressing Restart button.




## License
[MIT](https://choosealicense.com/licenses/mit/)