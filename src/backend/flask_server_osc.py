import os
from flask import Flask, render_template

template_dir = os.path.abspath('../frontend/templates')
app= Flask(__name__, template_folder=template_dir)

@app.route('/')
def osc():
   return render_template('metronome.html')

