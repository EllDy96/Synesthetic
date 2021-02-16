# Welcome to the source code of Synesthetic

## How to start Synesthetic

Clone this repository or download it manually From a bash terminal, then ```cd``` yourself inside the ```src/``` folder. Run the command to instantiate the Flask server:

```bash
$ env FLASK_APP=flask_server.py flask run
```

The expected output is:

```bash
 * Serving Flask app "flask_server"
 * Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
 ```
 
If the server complains about missing Python dependencies, Synesthetic won't be able to start please install them with the ```pip3 dependency_name``` command in order to proceed. Once the server is started, you can navigate to the IP address given by the terminal.

## How do the backend and fronted interact

Flask is responsible for the interaction between the Python backend and the Javascript frontend. When Synesthetic starts, the user is greeted by a landing page which requires him to upload an audio track. After the track is loaded, the rhythmic analysis is performed. The result of the rhythmic analysis is then stored into a JSON file which looks something like this:

```javascript
{
    "n_windows": 2,
    "window_timings": [
        {
            "start": 0.0,
            "end": 10
        },
        {
            "start": 10.0,
            "end": 20.0
        }
    ],
    "window_content": [
        [
            {
                "BPM": 184.57,
                "offset": 0.31
            }
        ],
        [
            {
                "BPM": 191.40,
                "offset": 0.22
            },
            {
                "BPM": 53.83,
                "offset": 0.84
            }
        ]
    ]
}  
```
The rhythmic analysis is performed on non-overlapping windows of the audio track. The windows are delimited by the ```start``` and ```end``` timings, contained in the ```window_timings``` array, and are expressed in seconds. Each window has a corresponding element inside the ```window_content``` array, which contains the information about all the tempos that show up inside that window. The frequency of the tempos is expressed in beats per minute and the offset is expressed in seconds. In this way, we take into account the possibility that each window can contain a different number of tempos.


## Reference list:
* file uploads with Flask  
link: https://blog.miguelgrinberg.com/post/handling-file-uploads-with-flask

* manage static files in Flask  
link: https://www.youtube.com/watch?v=tXpFERibRaU

* routing method for reaching elements not in static directory (which is a Flask pre-routed path)  
link: https://www.youtube.com/watch?v=Y2fMCxLz6wM&list=LL&index=1

* Animations with p5.js (metronome example)  
link: https://compform.net/animation/
