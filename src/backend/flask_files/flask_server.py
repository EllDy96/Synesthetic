from flask import Flask, render_template, request     #inizializzazione
from werkzeug.utils import secure_filename
app = Flask(__name__)

@app.route('/')                                 #homepage->upload.html
def upload():
   return render_template('upload_server1.html')
	
@app.route('/uploader', methods = ['GET', 'POST'])
def upload_file():
   if request.method == 'POST':
      f = request.files['file']                #this is the uploaded file
      f.save(secure_filename(f.filename))      #save the uploaded file in the current directory
      return 'file uploaded successfully'
		
if __name__ == '__main__':
   app.run(debug = True)