class Menu extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            id : this.props.id,
            title : this.props.title,
            description : this.props.description,
            url : this.props.url,
            iconUrl : this.props.iconUrl,
            selected : this.props.selected
        };

        this.selectMenu = this.selectMenu.bind(this);
    }

    /** Handling clicked menu event 
     * event - Event fired by option button 
    */
    selectMenu(event){
        var selected = (event.target.value == 'true');
        this.setState({ selected : selected  });

        var menu = this.state;
        menu.selected = selected;

        /** Bubbling clicked event on parent component  */
        this.props.menuClicked(menu);
    }

    /** Handling react event and draw one menu component */
    render(){
        const menu = React.createElement('div', { className : "parent", id : this.props.id },  
                    React.createElement('h3', { className : "title" },
                    React.createElement('img', { src : this.props.iconUrl, className : "icon" }),                     
                    React.createElement('span', {className: 'textTitle'}, this.props.title)),
                    React.createElement('p', { className : "description" }, this.props.description),
                    React.createElement('div', {className: 'switch'},
                    React.createElement('input',{id : this.props.id + '_on' , name : this.props.id + 'radio' , type:'radio', className:'switch-input', value: 'true' , onClick:this.selectMenu}),
                        React.createElement('label',{htmlFor : this.props.id + '_on' , className:'switch-label switch-label-off'},"ON"),
                    React.createElement('input',{id : this.props.id + '_off' , name : this.props.id + 'radio' , type:'radio', className:'switch-input',value: 'false', onClick:this.selectMenu,  defaultChecked:true}),
                        React.createElement('label',{htmlFor : this.props.id + '_off' , className : 'switch-label switch-label-on'},"OFF"),
                    React.createElement('span',{className:"switch-selection"}))
                    )
        return menu;                    
    }
}

Menu.defaultProps = {
    id : 'menu',
    title : 'New Menu',
    description : 'Insert a description for the new menu'
};


