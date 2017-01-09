
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
            duration: 100
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
                    }]}></Animated.View>
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
        top: -4,
        left: 0,
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
