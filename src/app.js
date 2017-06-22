
import React, { Component } from 'react';
import { Provider, observer } from 'mobx-react/native';
import { View } from 'react-native';
import {
    StackNavigator,
    TabRouter,
    createNavigator,
    createNavigationContainer,
} from 'react-navigation';

import blacklist from './utils/blacklist';
import stores from './stores';
import Toast from './components/Toast';
import Modal from './components/Modal';
import Layout from './screens';
import Home from './screens/Home';
import Charts from './screens/Charts';
import Category from './screens/Charts/Category';
import Profile from './screens/Profile';
import RecentPlaylist from './screens/Profile/Playlist/RecentPlaylist';
import LikedPlaylist from './screens/Profile/Playlist/LikedPlaylist';
import Player from './screens/Player';
import Login from './screens/Login';
import Comments from './screens/Comments';
import Reply from './screens/Reply';

const router = TabRouter({
    Home: {
        screen: Home,
    },

    Charts: {
        screen: Charts,
    },

    Profile: {
        screen: Profile,
    },
}, {
    initialRouteName: 'Home'
});

const view = ({ router, navigation }) => {
    const ActiveScreen = router.getComponentForState(navigation.state);

    return (
        <Layout navigation={navigation}>
            <ActiveScreen />
        </Layout>
    );
};

const MainNavigator = StackNavigator({

    _HOME: {
        screen: createNavigationContainer(createNavigator(router)(view)),
    },

    Player: {
        screen: ({ navigation }) => {
            return (
                <Layout showFooter={false} navigation={navigation}>
                    <Player />
                </Layout>
            );
        },
    },

    Login: {

        screen: ({ navigation }) => {
            return (
                <Layout showFooter={false} navigation={navigation}>
                    <Login />
                </Layout>
            );
        },
    },

    Comments: {

        screen: ({ navigation }) => {
            return (
                <Layout showFooter={false} navigation={navigation}>
                    <Comments />
                </Layout>
            );
        },
    },
}, {
    mode: 'modal',
    initialRouteName: '_HOME',
    navigationOptions: {
        header: false,
    }
});

const Sketch = StackNavigator({

    Category: {
        screen: ({ navigation }) => {
            return (
                <Layout showFooter={false} navigation={navigation}>
                    <Category />
                </Layout>
            );
        },
    },

    RecentPlaylist: {
        screen: ({ navigation }) => {
            return (
                <Layout showFooter={false} navigation={navigation}>
                    <RecentPlaylist />
                </Layout>
            );
        },
    },

    LikedPlaylist: {
        screen: ({ navigation }) => {
            return (
                <Layout showFooter={false} navigation={navigation}>
                    <LikedPlaylist />
                </Layout>
            );
        },
    },

    Reply: {
        screen: ({ navigation }) => {
            return (
                <Layout showFooter={false} navigation={navigation}>
                    <Reply />
                </Layout>
            );
        },
    },

    _MAIN: {
        screen: MainNavigator,
    },
}, {
    initialRouteName: '_MAIN',

    navigationOptions: {
        header: false,
    },
});

@observer
export default class App extends Component {
    async componentDidMount() {
        await stores.session.init();
        await stores.player.init();
    }

    render() {
        var { toast, modal } = stores;

        return (
            <Provider {...{
                ...blacklist(stores, 'toast', 'modal'),
                openModal: modal.open,
                info: toast.showMessage,
                error: toast.showError,
            }}>

                <View style={{
                    flex: 1,
                }}>
                    <Modal {...{
                        show: modal.show,
                        items: modal.items.slice(),
                        close: () => modal.toggle(false),
                    }} />
                    <Toast {...{
                        message: toast.message,
                        show: toast.show,
                        color: toast.color,
                        close: () => toast.toggle(false),
                    }} />

                    <Sketch />
                </View>
            </Provider>
        );
    }
}
