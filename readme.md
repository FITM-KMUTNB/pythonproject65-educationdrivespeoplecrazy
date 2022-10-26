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

## License
[MIT](https://choosealicense.com/licenses/mit/)