
import React, { Component, PropTypes } from 'react';
import { Animated } from 'react-native';
import blacklist from '../../utils/blacklist';

export default class FadeImage extends Component {

    state = {
        opacity: new Animated.Value(0)
    };

    render() {

        var opacity = this.state.opacity;
        var styles = this.props.style;
        var onLoadEnd = this.props.onLoadEnd;

        styles = Array.isArray(styles) ? styles : [styles];

        return (
            <Animated.Image {...blacklist(this.props, 'onLoadEnd', 'style')}

            style={[...styles, {
                opacity
            }]}

            onLoadEnd={e => {

                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 200
                }).start();

                'function' === typeof onLoadEnd && onLoadEnd();
            }}>
            </Animated.Image>
        );
    }
}
