
import React, { Component, PropTypes } from 'react';
import { observer, inject } from 'mobx-react/native';
import {
    View,
    Navigator,
    StyleSheet,
    Animated,
} from 'react-native';

import Home from './Home';
import Fav from './Fav';
import Discover from './Discover';
import PlayList from './PlayList';
import Profile from './Profile';
import Player from '../components/Player';
import Footer from '../components/Footer';

const components = {
    Home,
    Fav,
    Discover,
    PlayList,
    Profile,
    Player,
};

@inject(stores => ({
    route: stores.route.value
}))
@observer
export default class Views extends Component {

    static propTypes = {
        route: PropTypes.object.isRequired
    };

    state = {
        height: new Animated.Value(50)
    };

    componentWillReciveProps(nextProps) {
        console.log(this.refs.nav.getCurrentRoutes());
    }

    componentWillReact() {

        var navigator = this.refs.nav;

        switch ('Player') {
            case this.props.route.name:
                navigator.push(this.props.route);
                Animated.timing(this.state.height, {
                    toValue: 0,
                    duration: 100,
                    delay: 200,
                }).start();
                break;

            default:
                navigator.replace(this.props.route);
        }
    }

    render() {

        const opacity = this.state.height.interpolate({
            inputRange: [0, 50],
            outputRange: [0, 1],
        });

        return (
            <View style={{
                flex: 1
            }}>
                <Navigator {...{

                    style: styles.container,

                    initialRoute: this.props.route,

                    onDidFocus: (route) => {

                        if (route.name !== 'Player') {
                            Animated.timing(this.state.height, {
                                toValue: 50,
                                duration: 100
                            }).start();
                        }
                    },

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

                <Footer style={{
                    opacity,
                    height: this.state.height,
                }}></Footer>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});
