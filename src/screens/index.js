
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
import Profile from './Profile';
import Chart from './Chart';
import Player from '../components/Player';
import Footer from '../components/Footer';
import RippleHeader from '../components/RippleHeader';

const components = {
    Home,
    Fav,
    Profile,
    Player,
    Discover,
    Chart,
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
        height: new Animated.Value(50),
    };

    needHideFooter(route) {
        return ['Player', 'Chart'].includes(route.name);
    }

    componentWillReact() {

        var navigator = this.refs.nav;

        switch (true) {
            case this.needHideFooter(this.props.route):
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
                <RippleHeader style={{
                    opacity
                }}></RippleHeader>
                <Navigator {...{

                    style: styles.container,

                    initialRoute: this.props.route,

                    onDidFocus: (route) => {

                        if (!this.needHideFooter(route)) {
                            Animated.timing(this.state.height, {
                                toValue: 50,
                                duration: 100
                            }).start();
                        }
                    },

                    configureScene: (route, routeStack) => {

                        if (['Player', 'Login'].includes(route.name)) {
                            return Navigator.SceneConfigs.FloatFromBottom;
                        } else {
                            return Navigator.SceneConfigs.PushFromRight;
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
