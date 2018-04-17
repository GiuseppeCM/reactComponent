# SlideMenu

Questo progetto contiene un insieme di componenti React per la visualizzazione di marker su di una mappa di tipo  MapBox GL. </br>
Il progetto nasce con lo scopo di dimostrare come sia possibile utilizzare React nativo per la costruzione di componenti web grafici di tipo slide menu e mappe di geolocalizzazione dati. </br></br>

I componenti principali in questione sono:

1) Slidemenu
2) Map
3) Container

## Slidemenu
E' un componente react che permette di ricreare un hamburgher menu verticale posizionato nella parte sinistra della pagina. I menu che vengono visualizzati al suo interno sono di tipo switch con due possibili valori alternati (ON/OFF).<br>
Il menu è possibile popolarlo con voci di menu passando come prop React un json strutturato in questo modo:

```
[
    {
        "id" : "idVoceMenu",
        "title" : "Titolo menu",
        "description" : "Descrizione",
        "url" : "http://example.com",
        "selected" : false
    }, 
    ...
]
```
Per ogni oggetto json verrà ricreata una voce di menu che richiamerà l'url specificata al momento dello switch al valore ON.


## Map
E' un componente react che contiene al suo interno una istanza di MapBox GL. Questo componente contiene tutte le funzionalità native di MapBox e comunica per la visualizzazione dei marker tramite il componente react Container.
Il caricamento dei dati geospaziali nella mappa avviene sempre passando un json come prop React strutturato in questo modo:

```
{
    "Theme": "Oggeto della query",
    "Dataset": "Nome o titolo della query",
    "Color":"colore esadecimale del cluster dati MapBox",
    "Data": popolare con una struttura GeoJSON contenente i dati geo
}
```
## Container
E' un componente react che gestisce la comunicazione tra i due sotto componenti react Menu e Map.


## Inizia

Il progetto viene rilasciato come una applicazione web nodejs autoconsistente.</br>
Attenzione queto progetto non si occupa minimamente della fornitura dei dati geospaziali da visualizzare nella mappa e dei menu da visualizzare nello slidemenu.



### Prerequisiti

1) Installare nodejs dalla versione 7.10.0
2) E' necessaria una connessione internet per poter utilizzare MapBox GL.
3) E' necessario scaricare una licence key per MapBox GL che va inserita nella inizializzazione della mappa nel componente react Map.


### Istallazione

Scaricare il progetto in una cartella sul file system, posizionarsi all'interno della cartella slidemenu e da prompt dei comandi eseguire: 

```
npm install 
```

Questo comando scarica tutti i moduli e pacchetti npm necessari.

Una volta scaricati i moduli avviare l'applicazione con il seguente comando:

```
node server.js
```

## Implementato con

* [Nodejs](https://nodejs.org/it/) - Javascript runtime utilizzato
* [Expressjs](http://expressjs.com/it) - Web framework utilizzato
* [MapBox GL](https://www.mapbox.com/mapbox-gl-js/api/) - Map framework utilizzato
