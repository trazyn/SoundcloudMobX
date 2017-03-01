
import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react/native';
import { Provider } from 'mobx-react/native';
import axios from 'axios';
import {
    View,
    StyleSheet,
    NativeModules,
} from 'react-native';

import Screens from './screens';
import Toast from './components/Toast';
import stores from './stores';
import blacklist from './utils/blacklist';

function retryFailedRequest(err) {

    if (err.response.status === 500 && err.config && !err.config.__isRetryRequest) {
        err.config.__isRetryRequest = true;
        return axios(err.config);
    }

    throw err;
}

axios.interceptors.response.use(void 0, retryFailedRequest);

@observer
export default class App extends Component {

    componentWillMount() {

        /** Debug network in chrome devtools network tab */
        GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest;
    }

    async componentDidMount() {

        var session = stores.session;

        await stores.session.init();
        await stores.player.init();

        NativeModules.SplashScreen.hide();

        if (session.isLogin()) {
            axios.defaults.headers.common['Authorization'] = `OAuth ${session.auth.access_token}`;
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
