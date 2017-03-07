import React, { Component, PropTypes } from 'react';
import {
    View,
    Dimensions,
    Animated,
} from 'react-native';

export default class RippleHeader extends Component {

    state = {
        height: new Animated.Value(0),
    };

    componentDidMount() {

        Animated.timing(this.state.height, {
            toValue: 40,
            duration: 1300,
        }).start();
    }

    render() {

        var height = this.state.height;
        var opacity = height.interpolate({
            inputRange: [0, 40],
            outputRange: [0, 1]
        });

        return (
            <Animated.Image {...{
                source: require('../../images/head.gif'),

                style: [{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width,
                    height: 40,
                    zIndex: 9,
                    opacity,
                    height,
                }, this.props.style]
            }}></Animated.Image>
        );
    }
}

const { width, height } = Dimensions.get('window');
