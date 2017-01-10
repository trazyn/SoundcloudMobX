
import React, { Component, PropTypes } from 'react';
import { Provider } from 'mobx-react/native';
import {
    View,
    StyleSheet,
} from 'react-native';

import Screens from './screens';
import stores from './stores';

export default class App extends Component {

    async componentDidMount() {
        await stores.player.init();
        console.ignoredYellowBox = ['Warning: ReactNative.createElement', 'Remote debugger', 'View '];
    }

    render() {

        return (
            <Provider {...stores}>
                <View style={styles.container}>
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
