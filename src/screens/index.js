
import React, { Component, PropTypes } from 'react';
import { observer, inject } from 'mobx-react/native';
import {
    View,
    StatusBar,
    Navigator,
    StyleSheet,
    Animated,
} from 'react-native';

import Home from './Home';
import Discover from './Discover';
import Chart from './Chart';
import List from './List';
import Player from './Player';
import Footer from '../components/Footer';
import RippleHeader from '../components/RippleHeader';
import Login from './Login';
import Profile from './Profile';

const components = {
    Home,
    Player,
    Discover,
    Chart,
    Login,
    Profile,
    List,
};

@inject(stores => ({
    route: stores.route.value,
    setRoute: stores.route.setRoute.bind(stores.route),
    isLogin: stores.session.isLogin,
}))
@observer
export default class Screes extends Component {

    static propTypes = {
        route: PropTypes.object.isRequired,
        setRoute: PropTypes.func.isRequired,
        isLogin: PropTypes.func.isRequired,
    };

    state = {
        footerHeight: new Animated.Value(50),
        headerHeight: new Animated.Value(40),
    };

    needHideFooter(route) {
        return ['Player', 'Chart', 'Login', 'List'].includes(route.name);
    }

    needHideHeader(route) {
        return ['Player', 'Profile', 'Login', 'Chart'].includes(route.name);
    }

    componentDidMount() {
        StatusBar.setBarStyle('light-content', true);
    }

    componentWillReact() {

        var navigator = this.refs.nav;
        var route = this.props.route;

        switch (true) {
            case this.needHideFooter(route):
                Animated.timing(this.state.footerHeight, {
                    toValue: 0,
                    duration: 100,
                    delay: 200,
                }).start();

            case this.needHideHeader(route):
                Animated.spring(this.state.headerHeight, {
                    toValue: 0,
                }).start();
        }

        if (['Home', 'Discover', 'Profile'].includes(route.name)) {
            navigator.replace(route);
        } else {
            navigator.push(this.props.route);
        }
    }

    render() {

        var footerOpacity = this.state.footerHeight.interpolate({
            inputRange: [0, 50],
            outputRange: [0, 1],
        });
        var headerOpacity = this.state.headerHeight.interpolate({
            inputRange: [0, 40],
            outputRange: [0, 1],
        });
        var { route, setRoute, isLogin } = this.props;

        return (
            <View style={{
                flex: 1
            }}>
                <RippleHeader style={{
                    opacity: headerOpacity,
                    height: this.state.headerHeight,
                }}></RippleHeader>
                <Navigator {...{

                    style: styles.container,

                    initialRoute: this.props.route,

                    onDidFocus: (route) => {

                        if (!this.needHideFooter(route)) {
                            Animated.timing(this.state.footerHeight, {
                                toValue: 50,
                                duration: 100
                            }).start();
                        }

                        if (!this.needHideHeader(route)) {
                            Animated.spring(this.state.headerHeight, {
                                toValue: 40,
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
                route={route}
                setRoute={setRoute}
                isLogin={isLogin}
                style={{
                    opacity: footerOpacity,
                    height: this.state.footerHeight,
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
