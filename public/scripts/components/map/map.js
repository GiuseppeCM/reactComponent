class MyMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            closed: true,
            geoJson: [],
            map: {},
            draw: {},
            layerLoaded: {}
        };
    };

    componentDidMount() {
        mapboxgl.accessToken = 'pk.eyJ1IjoiZ2l1c2VwcGVtb250ZSIsImEiOiJjamRhMTJzcmI1M3YzMzNzNm11ZzJ5ZGphIn0.49tvN6m7Jp8Jr7go81VRGw';
        var map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v9',
            zoom: 10.5,
            center: {
                lat: 45.464211,
                lng: 9.191383
            }
        });

        //var selfMap = map
        var self = this;

        this.setState({
            map: map
        });
    };

    onclick(e) {
        console.log(e);
    };

    removePointsLayer(id) {
	this.state.map.removeLayer(id);
	this.state.map.removeLayer("clusters_" + id);
	this.state.map.removeLayer("cluster-count_" + id);
	this.state.map.removeSource("source_" + id);
    };

    addPointsLayer(id, data, color) {
	/** Add source */
	this.state.map.addSource("source_" + id, {
	    type: "geojson",
	    data: data,
	    cluster: true,
	    clusterMaxZoom: 14, // Max zoom to cluster points on
	    clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
	});
	/** Layer of cluster */
        this.state.map.addLayer({
            id: "clusters_" + id,
            type: "circle",
            source: "source_" + id,
            filter: ["has", "point_count"],
            paint: {
                "circle-color": color,
                "circle-radius": [
                    "step", ["get", "point_count"], 20, 10, 30, 50, 40
                ]
            }
        });

	/** Layer where is drawed the number of point  */
        this.state.map.addLayer({
            id: "cluster-count_" + id,
            type: "symbol",
            source: "source_" + id,
            filter: ["has", "point_count"],
            layout: {
                "text-field": "{point_count_abbreviated}",
                "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
                "text-size": 12,
                "icon-image": "{icon}-15"
            }
        });

	/** Layer of point */
	this.state.map.addLayer({
            id: id,
            type: "symbol",
            source: "source_" + id,
            filter: ["!has", "point_count"],
            layout: {
                "icon-image": "{icon}-15"
            }
        });
    };
    
    removePolygonsLayer() {
        //this.state.map.removeLayer('Quartieri_hover');
	this.state.map.removeLayer('Quartieri-line');
	this.state.map.removeLayer('Quartieri');
        this.state.map.removeSource('Quartieri');
    };
    
    addPolygonsLayer(data) { //, property, stops, highlightColor, hoverElement, unit) { 
        this.state.map.addSource('Quartieri', {type: 'geojson', data: data});
	
	var layers = this.state.map.getStyle().layers;
	// Find the index of the first symbol layer in the map style
	var firstSymbolId;
	for (var i = 0; i < layers.length; i++) {
	    if (layers[i].type === 'symbol') {
		firstSymbolId = layers[i].id;
		break;
	    }
	}
	
	this.state.map.addLayer({
	    id: 'Quartieri',
	    type: 'fill',
	    paint: {'fill-opacity': 1},
	    layout: {},
	    source: 'Quartieri'
	}, firstSymbolId);
/*
	map.setPaintProperty('Quartieri', 'fill-color', {
	    property: property,
	    stops: stops
	});

	map.addLayer({
	    id: 'Quartieri-hover',
	    type: "fill",
	    source: 'Quartieri',
	    layout: {},
	    paint: {"fill-color": highlightColor, "fill-opacity": 1},
	    filter: ["==", unit, hoverElement]
	}, firstSymbolId);
*/
	this.state.map.addLayer({
	    id: 'Quartieri-line',
	    type: 'line',
	    paint: {'line-opacity': 0.25},
	    source: 'Quartieri'
	}, firstSymbolId);

    };
	
    render() {

        var map = this.state.map;

        /** cicle for layers to draw */
        var layers = this.props.layers
        for (var i = 0; i < layers.length; i++) {
            var receivedLayer = layers[i];
            
            /** delete if exists */
            if (map.getSource("source_" + receivedLayer.id) !== undefined) {
		this.removePointsLayer(receivedLayer.id);
            }
	    if (map.getSource("Quartieri") !== undefined) {
		this.removePolygonsLayer();
	    }
	    
            /** draw the layers if draw parameter is set to true */
            if (receivedLayer.draw === true) {
		if (receivedLayer.type === "points") {
                    this.addPointsLayer(receivedLayer.id, receivedLayer.data.Data, receivedLayer.color);
		} else if (receivedLayer.type === "polygons") {
		    this.addPolygonsLayer(receivedLayer.data);//, property, stops, highlightColor, hoverElement, unit)
		}
            }

            map.on('click', receivedLayer.id, function (e) {
                // console.log(e)
                var popup = populatePopup(e.features[0].properties);
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

            function populatePopup(prop) {
                var toreturn = "";
                for (var key in prop) {
                    if (key != "icon") {
                        switch (key) {
                            case "Title":
                            toreturn += "<h2>" + prop[key] + "</h2>";
                            break;
                        case "Description":
                            toreturn += "<h3>" + prop[key] + "</h3>";
                            break;
                        default:
                            toreturn += "<p><strong>" + key + ": </strong>" + prop[key] + "</p>";
                            break;
                        }
                    }
                }
                return toreturn;
            }
        }

        const mapToInsert = React.createElement('div', {
            id: "map"
        });
	
        return mapToInsert;
    }
}
