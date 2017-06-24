
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Dimensions,
    Animated,
    StyleSheet,
} from 'react-native';

export default class Bar extends Component {
    static propTypes = {
        passed: PropTypes.number.isRequired,
    };

    state = {
        passed: new Animated.Value(0),
    };

    componentWillReceiveProps(nextProps) {
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
                    <Animated.View style={[styles.indicator, {
                        left
                    }]}>
                        <View style={styles.indicatorShadow} />
                    </Animated.View>
                </Animated.View>
            </View>
        );
    }
}

const { width } = Dimensions.get('window');
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
