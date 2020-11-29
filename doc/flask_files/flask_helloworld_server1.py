from flask import Flask
app = Flask(__name__)           #creare istanza flask

@app.route('/')                 #collegamento tra ('percorso url') e funzione view
                                #ce ne vuole uno diverso per ogni percorso url-funzione view
def home():                     #funzione view aka web page
     return "Hello, this is the fuckin <h1>VP main page</h1>"
