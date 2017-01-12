import React, { Component, PropTypes } from 'react';
import {
    View,
    Dimensions,
    Animated,
} from 'react-native';

export default class RippleHeader extends Component {

    render() {
        return (
            <Animated.Image {...{
                source: require('../../images/head.gif'),

                style: [{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width,
                    height: 40,
                    zIndex: 99,
                }, this.props.style]
            }}></Animated.Image>
    );
    }
}

const { width, height } = Dimensions.get('window');
