from flask import Flask, escape, request

app = Flask(__name__)

@app.route('/')
def hello():
    name = request.args.get("name", "World")
    return f'Hello, {escape(name)}!'

# Da js facciamo richieste HTTP
# Richiesta POST su server
# qua potrete trovare un esempio di un semplice HTTP 
# server scritto in Python che accetta chiamate GET e POST da un client che fa richieste su 
# http://localhost:8080. Quindi voi dovreste scrivere la parte client come sapete fare e, 
# quando avrete bisogno di fare un chiamata al server (per esempio per chiedere di processare un segnale), 
# fare da Javascript una chiamata POST al server sulla porta 8080 contenente i dati che il server necessita 
# e aspettare la sua risposta (il segnale processato).
