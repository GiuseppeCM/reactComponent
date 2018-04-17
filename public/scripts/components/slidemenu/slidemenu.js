'use strict'

class SlideMenu extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            closed : true,
            menus : [],
        };

        this.closeOpenSlideMenu = this.closeOpenSlideMenu.bind(this);
        this.menuClicked = this.menuClicked.bind(this);
    }

    /** Open or close slide menu when hamburgher menu it's clicked */
    closeOpenSlideMenu(){
        this.setState({ closed : !this.props.closed });
        document.body.classList.toggle('sidenav-active', this.props.closed);
    }

    /** Set menu array stored into state component by menu list stored in props component */
    setMenus(){
        this.setState({ menus : this.props.menus });
    }

    /** Handling react componentDidMount event to set menu array stored into state component */
    componentDidMount() {
        this.setMenus();
    }

    /** Handlig menu component clicked event  
     *  menu - Menu selected
    */
    menuClicked(menu){
        var index =  _.findIndex(this.state.menus ,m => m.id == menu.id);
        if(index > -1){
            this.props.menus[index] = menu;
            this.setMenus();
        }
       
        /** Bubbling clicked event on parent component  */
        this.props.menuClicked(menu);
    }

    /** Handling react event and draw all menu component */
    render(){
            const reactMenu = this.props.menus.map((jsonMenu) => {
                return React.createElement(Menu, {
                                           key: jsonMenu.id, 
                                           id: jsonMenu.id, 
                                           title: jsonMenu.title,
                                           description: jsonMenu.description,
                                           url: jsonMenu.url,
                                           iconUrl : jsonMenu.iconUrl,
                                           selected : jsonMenu.selected,
                                           menuClicked : this.menuClicked});

            });

            const root = React.createElement('div', {}, 
                React.createElement('div', { className : "hamburger", id : "hamburger", onClick : this.closeOpenSlideMenu }, 
                React.createElement('div', {}),
                React.createElement('div', {}),
                React.createElement('div', {})),

                React.createElement('nav' , {},
                    React.createElement('div', { className : "links"}, 
                    reactMenu,
                    React.createElement('footer', {}, 
                        React.createElement('p', {}, "footer" ))
                )
            ));
        return root;
    }
}

SlideMenu.propTypes = {
    title : PropTypes.string.isRequired
}
