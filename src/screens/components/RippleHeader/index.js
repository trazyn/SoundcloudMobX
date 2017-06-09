
import React, { Component, PropTypes } from 'react';
import { inject, observer } from 'mobx-react/native';
import {
    View,
    Dimensions,
    Animated,
} from 'react-native';

@inject(stores => ({
    playing: stores.player.playing
}))
@observer
export default class RippleHeader extends Component {

    state = {
        height: new Animated.Value(0),
    };

    componentDidMount() {

        this.props.playing &&
        Animated.timing(this.state.height, {
            toValue: 60,
            duration: 1300,
        }).start();
    }

    componentWillReceiveProps(nextProps) {

        if (this.props.playing !== nextProps.playing) {

            if (nextProps.playing) {
                Animated.timing(this.state.height, {
                    toValue: 60,
                    duration: 1300,
                }).start();
            } else {
                Animated.timing(this.state.height, {
                    toValue: 0,
                    duration: 1300,
                }).start();
            }
        }
    }

    render() {

        var height = this.state.height;
        var opacity = height.interpolate({
            inputRange: [0, 60],
            outputRange: [0, 1]
        });

        return (
            <Animated.Image {...{
                source: require('../../../images/head.gif'),

                style: [{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width,
                    height: 60,
                    opacity,
                    height,
                    alignItems: 'center',
                    justifyContent: 'center',
                }, this.props.style]
            }}>
            </Animated.Image>
        );
    }
}

const { width, height } = Dimensions.get('window');
