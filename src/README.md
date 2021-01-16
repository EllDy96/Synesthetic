# Backend

## Server instantiation 

From a bash terminal, run the command:

```bash
$ env FLASK_APP=flask_server.py flask run
```

Expected output:

```bash
 * Serving Flask app "flask_server"
 * Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
 ```

 1) activate Flask environment (if you use conda)
 2) run "flask_server.py"
 3) select a track to upload from your pc
 4) you will be redirect to the oscillator
 5) write "/metronomo" in the search bar in order to see a metronome @ 60 BPM

REFERENCES LIST:
file uploads with Flask 
link: https://blog.miguelgrinberg.com/post/handling-file-uploads-with-flask

manage static files in Flask
link: https://www.youtube.com/watch?v=tXpFERibRaU

routing method for reaching elements not in static directory (which is a Flask pre-routed path)
link: https://www.youtube.com/watch?v=Y2fMCxLz6wM&list=LL&index=1


Animations with p5.js (metronome example)
link: https://compform.net/animation/

Molinari notes:
# Da js facciamo richieste HTTP
# Richiesta POST su server
# qua potrete trovare un esempio di un semplice HTTP 
# server scritto in Python che accetta chiamate GET e POST da un client che fa richieste su 
# http://localhost:8080. Quindi voi dovreste scrivere la parte client come sapete fare e, 
# quando avrete bisogno di fare un chiamata al server (per esempio per chiedere di processare un segnale), 
# fare da Javascript una chiamata POST al server sulla porta 8080 contenente i dati che il server necessita 
# e aspettare la sua risposta (il segnale processato).
