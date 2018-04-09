
class GeoMapContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            menus: [],
            layers : []
        };

        this.menuClicked = this.menuClicked.bind(this);
        this.loadRemoteData = this.loadRemoteData.bind(this);
    }

    setMenus(menus){
        this.setState({ menus : menus });
    }

    addLayer(layer){
        var l = this.state.layers;
        l.push(layer);
        this.setState({ layers : l });        
    }

    render() {
        //var toolbar = React.createElement(Toolbar, {});

        const root = React.createElement('div', {}, React.createElement('div', { className: 'main' }, 
            React.createElement(SlideMenu, { menus : this.state.menus, menuClicked : this.menuClicked } )),
            React.createElement(MyMap, { layers : this.state.layers })
        );
        return root;
    }
    
    componentDidMount(){
        this.loadRemoteMenu();
	
    }

    /** Handling menu clicked event from slide menu component */
    menuClicked(menu){
        var index = _.findIndex(this.state.menus, m => m.id == menu.id);
        if(index > -1){
            var menus = this.state.menus;
            menus[index] = menu;
            this.setMenus(menus);
        }

        if(menu.selected == true)
            setTimeout(this.loadRemoteData(menu), 300);
        else if(menu.selected == false){
            var index = _.findIndex(this.state.layers, l => l.id == menu.id);
            if(index > -1){
                this.state.layers[index].draw = menu.selected;
            }            
        }    
    }

    /** Load remote json data using proxy dedicated */
    loadRemoteData(menu, success){
        var self = this;
        //create remote data proxy
        const remoteProxy = new RemoteDataProxy();
        //request remote data json
        remoteProxy.getRemoteData(menu.url, function(data) {
            var layer =  _.remove(self.state.layers, l => l.id == menu.id);
	    
            if(layer.length > 0){
                layer = layer[0]; 
            }else{
                layer = {};
                layer.id = menu.id;
            }
            layer.draw = menu.selected;
            layer.color = data.Color;
            layer.type = menu.type;
	    if (layer.type === "polygons") {
		const remoteProxy2 = new RemoteDataProxy();
	
		remoteProxy2.getRemoteData(menu.geojsonUrl, function(geojson) {
		    var features = geojson.features;
		    var quartieri = data.map((d) => d["NIL"]);
		    features.forEach((d) => {
			var index = quartieri.indexOf(d.properties["NIL"]);
			d.properties["tipiAlloggio"] = data[index]["tipiAlloggio"];
		    });
		    features = features.sort((a, b) => b.properties["tipiAlloggio"] - a.properties["tipiAlloggio"]);
		    layer.data = {type: "FeatureCollection", features: features};
		    self.addLayer(layer); 
		});
	    } else {
		layer.data = data;
		self.addLayer(layer);
	    }
        },
        function(err){
            console.log(JSON.stringify(err));
        });
    }
    
    /** Load remote menu json using proxy dedicated */
    loadRemoteMenu(){
        var self = this;
        //create menu proxy
        var options = {
            url : this.props.host + this.props.url 
        };
        const menuProxy = new MenuProxy(options);
        //request remote menu json
        menuProxy.getMenuJsonData(function(jsonMenu){
            self.setMenus(jsonMenu);
        },
        function(err){
            console.log(JSON.stringify(err));
        });
    }
}


