
import React, { Component, PropTypes } from 'react';
import {
    StackNavigator,
    TabRouter,
    createNavigator,
    createNavigationContainer,
    addNavigationHelpers,
} from 'react-navigation';

import Layout from './screens';
import Home from './screens/Home';
import Discover from './screens/Discover';
import Fav from './screens/Fav';
import Player from './screens/Player';
import Login from './screens/Login';

const router = TabRouter({
    Home: {
        screen: Home,
    },

    Discover: {
        screen: Discover,
    },

    Fav: {
        screen: Fav,
    },
}, {
    initialRouteName: 'Home'
});

const view = ({ router, navigation }) => {

    const ActiveScreen = router.getComponentForState(navigation.state);

    return (
        <Layout navigation={navigation}>
            <ActiveScreen></ActiveScreen>
        </Layout>
    );
};

const MainScreen = createNavigationContainer(createNavigator(router)(view));

const App = StackNavigator({

    Root: {
        screen: MainScreen,
    },

    Player: {
        screen: ({ navigation }) => {

            return (
                <Layout showFooter={false} navigation={navigation}>
                    <Player></Player>
                </Layout>
            );
        },
    },

    Login: {

        screen: ({ navigation }) => {

            return (
                <Layout showFooter={false} navigation={navigation}>
                    <Login></Login>
                </Layout>
            );
        },
    },
}, {
    mode: 'modal',
    navigationOptions: ({ navigation }) => {

        return {
            header: false,
        };
    }
});

export default App;
