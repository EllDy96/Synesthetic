from flask import Flask, redirect, url_for,render_template,request       #importare le funzioni che utilizziamo nel codice

app = Flask(__name__)           #creare istanza flask

@app.route('/')                 #collegamento tra ('percorso url') e funzione view
                                #ce ne vuole uno diverso per ogni percorso url-funzione view
def home():                     #funzione view aka web page
     return "Hello, this is the fuckin <h1>Main page</h1>"

#@app.route('/admin')            #just an example on how redirecting works in Flask(un utente non può finire su pagina /admin)
#def admin():
#    return redirect(url_for("home"))

#@app.route('/<name>')           #just a simple example of extracting url stuff and write it into web page
#def user(name):
#    return f"Hello {name}!"

#@app.route('/<name>')            #render an html template. In order to do that, create a "template" folder in the same directory of the current flask.py file
#def page(name):                  #passing html template a list, then use python inside html
#    return render_template("index.html", content=["Francesco Bruschi","Mauro Molinari", "Vincenzo Rana"], title=name) 

#GET (we basically see everytime this method -look in terminal-) & POST method: a simple form 

@app.route("/getpost_method", methods=['POST','GET'])
def post():
    if request.method =='POST':   #when you click submit 
        user=request.form["nm"]
        return redirect(url_for("user", usr=user))
    else:                         #go to the form page
        return render_template("post.html")

@app.route("/<usr>")
def user(usr):
    return f"<h1>{usr} acquired</h1>"
