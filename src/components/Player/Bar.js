
import React, { Component, PropTypes } from 'react';
import {
    View,
    Text,
    Image,
    TouchableHighlight,
    Dimensions,
    StyleSheet,
} from 'react-native';

export default class Bar extends Component {

    static propTypes = {
        duration: PropTypes.number.isRequired,
    };

    render() {

        const { duration } = this.props;

        return (
            <View style={styles.container}>
                <View style={styles.passed}>
                    <View style={styles.indicator}></View>
                </View>
            </View>
        );
    }
}

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({

    container: {
        position: 'absolute',
        left: 0,
        top: 470,
        width,
        height: 2,
        backgroundColor: 'rgba(255,255,255,.7)',
    },

    passed: {
        flex: 1,
        width: 30,
        height: 2,
        backgroundColor: '#f50',
        alignItems: 'flex-end',
        justifyContent: 'flex-end'
    },

    indicator: {
        width: 6,
        height: 6,
        borderRadius: 6,
        backgroundColor: '#fff',
        transform: [{
            translateY: 2,
            translateX: 2,
        }]
    }
});
