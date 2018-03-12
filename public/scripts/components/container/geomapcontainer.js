
class GeoMapContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            menus: [],
            layers : [],
            mapDrawed : {},
            mapCleared : {},
            polygonMapInfo : { drawed : false, data : [] },
        };

        this.menuClicked = this.menuClicked.bind(this);
        this.loadRemoteData = this.loadRemoteData.bind(this);
        this.mapDrawed = this.mapDrawed.bind(this); 
        this.mapCleared = this.mapCleared.bind(this); 
    }

    setMenus(menus){
        this.setState({ menus : menus });
    }

    setPolygonMapInfo(info){
        this.setState({ polygonMapInfo : info });        
    }


    addLayer(layer){
        var l = this.state.layers;
        l.push(layer);
        this.setState({ layers : l });        
    }


    render() {
        //var toolbar = React.createElement(Toolbar, {});

        const root = React.createElement('div', {}, React.createElement('div', {className: 'main'}, 
            React.createElement(SlideMenu, { menus : this.state.menus, menuClicked : this.menuClicked } )),
            React.createElement(MyMap,{ layers : this.state.layers, mapDrawed : this.mapDrawed, mapCleared : this.mapCleared })
        );
        return root;
    }

    
    componentDidMount(){
        this.loadRemoteMenu();
    }


    /** Handling menu clicked event from slide menu component */
    menuClicked(menu){
        var index =  _.findIndex(this.state.menus ,m => m.id == menu.id);
        if(index > -1){
            var menus = this.state.menus;
            menus[index] = menu;
            this.setMenus(menus);
        }

        if(menu.selected == true && this.state.polygonMapInfo.drawed == true)
            setTimeout(this.loadRemoteData(menu),300);
        else if(menu.selected == false){
            var index =  _.findIndex(this.state.layers ,l => l.id == menu.id);
            if(index > -1){
                this.state.layers[index].draw = menu.selected;
            }            
        }    
    }


    /** Handling polygon drawed event from map component */    
    mapDrawed(data){
        var polygonInfo = {};
        polygonInfo.drawed = true;
        polygonInfo.data = data;
        this.setPolygonMapInfo(polygonInfo);

        for(var i=0 ; i < this.state.menus.length; i++){
            var menu = this.state.menus[i];
            if(menu.selected == true)
                setTimeout(this.loadRemoteData(menu),300);
        }
    }

    /** Handling polygon cleared event from map component */ 
    mapCleared(){
        var polygonInfo = {};
        polygonInfo.drawed = false;
        polygonInfo.data = {};
        this.setPolygonMapInfo(polygonInfo);
    }

    /** Load remote json data using proxy dedicated */
    loadRemoteData(menu, success){
        var self = this;
        //create remote data proxy
        const remoteProxy = new RemoteDataProxy();
        //request remote data json
        remoteProxy.getRemoteData(menu.url, function(data){
            var layer =  _.remove(self.state.layers ,l => l.id == menu.id);
            if(layer.length > 0){
                layer = layer[0]; 
                layer.draw = menu.selected;
                layer.data = data;
                layer.color = data.Color;
            }else{
                var layer = {};
                layer.id = menu.id;
                layer.data = data;
                layer.draw = menu.selected;
                layer.color = data.Color;
            }
            self.addLayer(layer);            
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
        }
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


