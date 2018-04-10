'use strict'

class SlideMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            closed: true,
            menus: [],
            isMobile: false
        };

        this.closeOpenSlideMenu = this.closeOpenSlideMenu.bind(this);
        this.menuClicked = this.menuClicked.bind(this);
    }

    /** Open or close slide menu when hamburgher menu it's clicked */
    closeOpenSlideMenu() {
        this.setState({
            closed: !this.props.closed
        });
        document.body.classList.toggle('sidenav-active', this.props.closed);
    }

    /** Set menu array stored into state component by menu list stored in props component */
    setMenus() {
        this.setState({
            menus: this.props.menus
        });
    }

    /** Handling react componentDidMount event to set menu array stored into state component */
    componentDidMount() {

        var self = this
        window.addEventListener("resize", this.updateDimensions);

        function updateDimensions(self) {
            var innerWidthPage = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
            var innerHeightPage = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            if (innerWidthPage < 990) {
                // this.hideMenu();
                // this.showHamburgerMenu();
                self.setState({
                    isMobile: true
                })
            } else {
                self.setState({
                    isMobile: false
                })
                // this.showMenu();
                // this.hideHamburgerMenu();
            }
        }
        updateDimensions(self);

        this.setMenus();
    }



    /** Handlig menu component clicked event  
     *  menu - Menu selected
     */
    menuClicked(menu) {
        var index = _.findIndex(this.state.menus, m => m.id == menu.id);
        if (index > -1) {
            this.props.menus[index] = menu;
            this.setMenus();
        }

        /** Bubbling clicked event on parent component  */
        this.props.menuClicked(menu);
    }

    /** Handling react event and draw all menu component */
    render() {
        const reactMenu = this.props.menus.map((jsonMenu) => {
            
            return React.createElement(Menu, {
                key: jsonMenu.id,
                id: jsonMenu.id,
                title: jsonMenu.title,
                description: jsonMenu.description,
                url: jsonMenu.url,
                iconUrl: jsonMenu.iconUrl,
                selected: jsonMenu.selected,
                menuClicked: this.menuClicked,
		type: jsonMenu.type,
		geojsonUrl: jsonMenu.geojsonUrl
            });

        });

        const root = React.createElement('div', {},
            React.createElement('div', {
                    className: "hamburger",
                    id: "hamburger",
                    onClick: this.closeOpenSlideMenu
                },
                React.createElement('div', {}),
                React.createElement('div', {}),
                React.createElement('div', {})),

            React.createElement('nav', {},
                React.createElement('div', {
                        className: "links"
                    },
                    reactMenu,
                    React.createElement('footer', {},
                        React.createElement('p', {}, "footer"))
                )
            ));
        return root;
    }
}

SlideMenu.propTypes = {
    title: PropTypes.string.isRequired
}
