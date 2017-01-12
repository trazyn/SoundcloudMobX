
import React, { Component, PropTypes } from 'react';
import {
    View,
    Text,
    Image,
    TouchableHighlight,
    Dimensions,
    Animated,
    StyleSheet,
} from 'react-native';

export default class Bar extends Component {

    static propTypes = {
        passed: PropTypes.number.isRequired,
        loaded: PropTypes.number.isRequired,
    };

    state = {
        loaded: new Animated.Value(0),
        passed: new Animated.Value(0),
    };

    componentWillReceiveProps(nextProps) {

        Animated.timing(this.state.loaded, {
            toValue: width * nextProps.loaded,
            duration: 50
        }).start();

        Animated.timing(this.state.passed, {
            toValue: width * nextProps.passed,
            duration: 100
        }).start();
    }

    render() {

        var left = this.state.passed.interpolate({
            inputRange: [0, width],
            outputRange: [0, width],
        });

        return (
            <View style={styles.container}>
                <Animated.View style={[styles.passed, {
                    width: this.state.passed
                }]}>
                    <Animated.View style={[styles.loaded, {
                        width: this.state.loaded
                    }]}></Animated.View>
                    <Animated.View style={[styles.indicator, {
                        left
                    }]}>
                        <View style={styles.indicatorShadow}></View>
                    </Animated.View>
                </Animated.View>
            </View>
        );
    }
}

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({

    container: {
        position: 'absolute',
        left: 0,
        top: 490,
        width,
        height: 2,
        backgroundColor: 'rgba(255,255,255,.7)',
    },

    passed: {
        flex: 1,
        width: 0,
        height: 2,
        backgroundColor: '#f50',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        zIndex: 1
    },

    loaded: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: 2,
        width: 0,
        backgroundColor: 'rgba(0,0,0,.3)',
    },

    indicator: {
        position: 'absolute',
        top: -5,
        left: 0,
        width: 12,
        height: 12,
        borderRadius: 12,
        backgroundColor: 'rgba(255,85,0,.4)'
    },

    indicatorShadow: {
        position: 'absolute',
        top: 3,
        left: 3,
        height: 6,
        width: 6,
        borderRadius: 6,
        backgroundColor: '#f50'
    }
});
