
import React, { Component, PropTypes } from 'react';
import { observer, inject } from 'mobx-react/native';
import {
    View,
    Navigator,
    StyleSheet
} from 'react-native';

import Home from './Home';
import Fav from './Fav';
import Discover from './Discover';
import PlayList from './PlayList';
import Profile from './Profile';

const components = {
    Home,
    Fav,
    Discover,
    PlayList,
    Profile,
};

@inject(stores => ({
    route: stores.route.value
}))
@observer
export default class Views extends Component {

    static propTypes = {
        route: PropTypes.object.isRequired
    };

    componentWillReact() {
        this.refs.nav.replace(this.props.route);
    }

    render() {

        return (
            <Navigator {...{

                style: styles.container,

                initialRoute: this.props.route,

                renderScene: (route, navigator) => {

                    const name = route.name;
                    const component = components[name];

                    if (!component) {
                        return console.error(`No such view name: '${name}'`);
                    }

                    return React.createElement(component, {
                        ...this.props,
                        route,
                        navigator,
                    });
                },

                ref: 'nav'
            }}></Navigator>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});
