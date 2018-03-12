class Toolbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
        
    }

    render(){
        const root = React.createElement('div', {className : "toolbar"}, 
            React.createElement('select', {id : "selectMenu" })
        );
        return root;
    }

}
