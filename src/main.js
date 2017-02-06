
import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react/native';
import { Provider } from 'mobx-react/native';
import axios from 'axios';
import {
    View,
    StyleSheet,
} from 'react-native';

import Screens from './screens';
import Toast from './components/Toast';
import stores from './stores';
import blacklist from './utils/blacklist';

@observer
export default class App extends Component {

    async componentDidMount() {

        var session = stores.session;

        await stores.session.init();
        await stores.player.init();

        if (session.isLogin()) {
            axios.defaults.headers.common['Authorization'] = session.auth.access_token;
        }

        console.ignoredYellowBox = ['Warning: ReactNative.createElement', 'Possible Unhandlerd Promise ', 'Remote debugger', 'View '];
    }

    render() {

        var toast = stores.toast;

        return (
            <Provider {...{
                ...blacklist(stores, 'toast'),
                showMessage: toast.showMessage,
                showError: toast.showError,
            }}>
                <View style={styles.container}>
                    <Toast message={toast.message} show={toast.show} close={() => toast.toggle(false)} color={toast.color}></Toast>
                    <Screens></Screens>
                </View>
            </Provider>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});
