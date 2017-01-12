
import React, { Component, PropTypes } from 'react';
import { inject, observer } from 'mobx-react/native';
import {
    View,
    StyleSheet,
    Dimensions,
} from 'react-native';

import RippleHeader from '../../components/RippleHeader';

export default class Fav extends Component {

    render() {
        return (
            <View style={styles.container}>
                <RippleHeader></RippleHeader>
            </View>
        );
    }
}

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f1dfdd',
    }
});
