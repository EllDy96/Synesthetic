import os
#from python_modules import tempo_detection as td
from flask import Flask, render_template, request, redirect, url_for, abort, send_from_directory
from werkzeug.utils import secure_filename

template_dir = os.path.relpath('./templates') #reference template, in case you want to change the standard path
app= Flask(__name__, template_folder=template_dir)
app.config['MAX_CONTENT_LENGTH']=20*1024*1024 #fix the max size of the uploaded files at 20MB
app.config['UPLOAD_EXTENSIONS']=['.mp3', '.wav', '.flac']
app.config['UPLOAD_PATH']='static/assets/' #where to save the rhythmic track
app.config["CACHE_TYPE"] = "null"

@app.route('/')         #collegamento tra ('percorso url') e ...                        
def upload():           #... funzione view
   return render_template('upload.html')
	
@app.route('/', methods = ['POST'])
def upload_file():
   uploaded_file = request.files['file'] 
   filename = secure_filename(uploaded_file.filename) #secured version of the filename of the track uploaded by the user
   if filename != '':
      file_ext=os.path.splitext(filename)[1] #restituisce l'estensione del file
      if file_ext not in app.config['UPLOAD_EXTENSIONS']:
         abort(400)
      uploaded_file.save(os.path.join(app.config['UPLOAD_PATH'], filename)) #salva il file nel path specificato in app.config (deve esistere una cartella con quel nome)

   track_path = os.path.join(app.config['UPLOAD_PATH'], filename)
   #td.driver_function(track_path, 'static/assets/rhythm_file.json')

   return render_template('mondrian_animation.html')

@app.route('/ <filename>')      #new method returns the track (uploaded in 'static/assets' folder)
def send_track(filename):
   return send_from_directory("static/assets/", filename)


