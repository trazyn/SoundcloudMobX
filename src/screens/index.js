
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
import Login from './Login';

const components = {
    Home,
    Fav,
    Profile,
    Player,
    Discover,
    Chart,
    Login,
};

@inject(stores => ({
    route: stores.route.value,
    setRoute: stores.route.setRoute.bind(stores.route),
    needLogin: !!stores.session.isLogin(),
}))
@observer
export default class Views extends Component {

    static propTypes = {
        route: PropTypes.object.isRequired,
        setRoute: PropTypes.func.isRequired,
        needLogin: PropTypes.bool.isRequired,
    };

    state = {
        height: new Animated.Value(50),
        showFooter: true,
    };

    needHideFooter(route) {
        return ['Player', 'Chart', 'Login'].includes(route.name);
    }

    componentWillReact() {

        var navigator = this.refs.nav;
        var route = this.props.route;

        switch (true) {
            case this.needHideFooter(route):
                Animated.timing(this.state.height, {
                    toValue: 0,
                    duration: 100,
                    delay: 200,
                }).start();

            case 'Login' === route.name:
                navigator.push(this.props.route);
                break;

            default:
                navigator.replace(route);
        }
    }

    render() {

        var opacity = this.state.height.interpolate({
            inputRange: [0, 50],
            outputRange: [0, 1],
        });
        var { route, setRoute, needLogin } = this.props;

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

                <Footer
                show={this.state.showFooter}
                route={route}
                setRoute={setRoute}
                needLogin={needLogin}
                style={{
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
