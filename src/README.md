# Backend

## Server instantiation 

From a bash terminal, run the command:

```bash
$ env FLASK_APP=helloworld.py flask run
```

Expected output:

```bash
 * Serving Flask app "helloworld"
 * Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
 ```

 1) activate Flask environment
 2) run "flask_server2.py"
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


# Frontend
All the templates of the project are moved to the frontend part

Animations with p5.js (metronome example)
link: https://compform.net/animation/