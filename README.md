## VisualParasyte

# Due parti principali:
1. Python/Backend: Prendere pezzo, analizzarlo, estrarre informazioni
2. JavaScript/Frontend: Prendere le info in javascript, generare elementi visivi e visualizzarli assieme al brano

# Python
Pre-analisi/estrazione delle informazioni fondamentali dalla traccia audio:
* Tempo (tempogram)
* Ritmo (matrice poliritmica)
* Armonia
* Frequenze (spectrogram)

Tutte le informazioni sono elaborate in back end per cercare di ottimizzare l’aspetto real time della visualizzazione tramite js. 
Forniamo a Js le informazioni estratte in una serie di array  da interpretare durante la riproduzione della traccia musicale. Come fare per sincronizzare la lettura degli array da parte di JS con la riproduzione audio?

# Javascript

Visualizzare in maniera diversa:
* Tempo: Associato a pulsazioni dello sfondo
* Ritmo: Possono esserci diversi ritmi, ogni ritmo sarà associato ad una figura geometrica. Esse appariranno e pulseranno seguendo il relativo ritmo.
* Analisi Armonica: colore dello sfondo e di altri elementi. Possibile interpretazione geometrica dei modi (minore/maggiore).
* Frequenze/Spettro: lo spettro delle frequenze influenza altri elementi grafici generici (es saturazione di una parte del video)

Texture di fondo da selezionare in base al pezzo.

