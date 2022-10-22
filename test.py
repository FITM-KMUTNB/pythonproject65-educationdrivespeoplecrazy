from tinydb import TinyDB, Query

db = TinyDB("private/db.json")

db.insert({ "name": "A", "history": [] })