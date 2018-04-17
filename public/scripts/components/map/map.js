class MyMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            closed: true,
            geoJson: [],
            map: {},
            draw: {},
            layerLoaded: {},
            polygon: {}
        };
    }

    componentDidMount() {
        mapboxgl.accessToken = 'pk.eyJ1IjoiZ2l1c2VwcGVtb250ZSIsImEiOiJjamRhMTJzcmI1M3YzMzNzNm11ZzJ5ZGphIn0.49tvN6m7Jp8Jr7go81VRGw';
        var map = new mapboxgl.Map({
            container: 'map',
            //style: 'mapbox://styles/mapbox/streets-v9',
            style: 'mapbox://styles/mapbox/light-v9',   
            zoom: 11,
            center: {
                lat: 41.89,
                lng: 12.49
            }
        });

        //var selfMap = map
        var self = this
        var draw = new MapboxDraw({
            displayControlsDefault: false,
            boxSelect: false,
            controls: {
                polygon: true,
                line: true,
                line_string: true,
                trash: true
            },
            style: [{
                'id': 'custom-polygon',
                'type': 'fill',
                'filter': ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']],
                'paint': {
                  'fill-color': '#f16852',
                  'fill-opacity': 0.1
                },
                'interactive': false
              }]
        });

        map.addControl(draw);

        map.on('draw.create', createArea);

        map.on('draw.delete', deleteArea);

        function deleteArea(e) {
            self.props.mapCleared()
        }

        function createArea(e) {
            //prendo tutti i poligoni disegnati
            var data = draw.getAll();
            //            ALGORITMO PER ELIMINAZIONE ULTIMO poligono
            //solo se è già presente un poligono
            if (data.features.length > 1) {
                //prendo il poligono disegnato per primo
                var id = data.features[0].id
                //elimino il primo poligono
                draw.delete(id)
                //cambio variabile data dopo averlo rimosso con il poligono corrente
                data = draw.getAll()
            }
            var polygonData = {};
            polygonData.id = data.features[0].id;
            polygonData.geometry = data.features[0].geometry;
            polygonData.polygon = data.features[0].type;

            //metodo parent
            self.setState({
                polygon: polygonData
            });
            self.props.mapDrawed(polygonData)
            //            FINE
        }

        this.setState({
            draw: draw
        });

        this.setState({
            map: map
        });



    }

    onclick(e) {
        console.log(e);
    }

    render() {

        var map = this.state.map;
        var draw = this.state.draw;

        /** cicle for layers to draws */
        var layers = this.props.layers
        for (var i = 0; i < layers.length; i++) {
            var receivedLayer = layers[i];

            /** delete the draw if exists */
            var s = map.getSource("source_" + receivedLayer.id);
            if (s != undefined) {
                map.removeLayer(receivedLayer.id);
                map.removeLayer("clusters_" + receivedLayer.id);
                map.removeLayer("cluster-count_" + receivedLayer.id);
                map.removeSource("source_" + receivedLayer.id);
            }

            /** draw the layers if draw parameter is set to true */
            if (receivedLayer.draw == true) {
                /** Add source */
                map.addSource("source_" + receivedLayer.id, {
                    type: "geojson",
                    data: receivedLayer.data.Data,
                    cluster: true,
                    clusterMaxZoom: 14, // Max zoom to cluster points on
                    clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
                });

                /** Layer of cluster */
                map.addLayer({
                    id: "clusters_" + receivedLayer.id,
                    type: "circle",
                    source: "source_" + receivedLayer.id,
                    filter: ["has", "point_count"],
                    paint: {
                        "circle-color": receivedLayer.color,
                        "circle-radius": [
                            "step", ["get", "point_count"], 20, 10, 30, 50, 40
                        ]
                    }
                });

                /** Layer where is drawed the number of point  */
                map.addLayer({
                    id: "cluster-count_" + receivedLayer.id,
                    type: "symbol",
                    source: "source_" + receivedLayer.id,
                    filter: ["has", "point_count"],
                    layout: {
                        "text-field": "{point_count_abbreviated}",
                        "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
                        "text-size": 12,
                        "icon-image": "{icon}-15"
                    }
                });

                /** Layer of point */
                map.addLayer({
                    id: receivedLayer.id,
                    type: "symbol",
                    source: "source_" + receivedLayer.id,
                    filter: ["!has", "point_count"],
                    layout: {
                        "icon-image": "{icon}-15"
                    }
                });
            }

            map.on('click', receivedLayer.id, function (e) {
                // console.log(e)
                var popup = popolatePopup(e.features[0].properties)
                new mapboxgl.Popup()
                    .setLngLat(e.features[0].geometry.coordinates)
                    .setHTML(popup)
                    .addTo(map);
            });

            map.on('mouseenter', receivedLayer.id, function () {
                map.getCanvas().style.cursor = 'pointer';
            });

            map.on('mouseleave', receivedLayer.id, function () {
                map.getCanvas().style.cursor = '';
            });


            function popolatePopup(prop) {
                var string = ""
                for (var key in prop) {
                    if (key != "icon") {
                        switch (key) {
                            case "Title":
                                string += "<h2>" + prop[key] + "</h2>"
                                break;
                            case "Description":
                                string += "<h3>" + prop[key] + "</h3>"
                                break;
                            default:
                                string += "<p><strong>" + key + ": </strong>" + prop[key] + "</p>"
                                break;
                        }
                    }
                }
                return string
            }

        }

        const mapToInsert = React.createElement('div', {
            id: "map"
        });
        return mapToInsert;
    }


}