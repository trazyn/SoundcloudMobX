
import React, { Component, PropTypes } from 'react';
import { View, Animated } from 'react-native';
import blacklist from '../../utils/blacklist';

export default class FadeImage extends Component {

    static propTypes = {
        showLoading: PropTypes.bool,
    };

    static defaultProps = {
        showLoading: false,
    };

    state = {
        opacity: new Animated.Value(1)
    };

    render() {

        var opacity = this.state.opacity;
        var styles = this.props.style;
        var onLoadEnd = this.props.onLoadEnd;

        styles = Array.isArray(styles) ? styles : [styles];

        return (
            <View style={[styles, {
                justifyContent: 'center',
                alignItems: 'center',
                opacity: 1,
            }]}>
                {
                    this.props.showLoading && (
                        <Animated.View style={[styles, {
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            backgroundColor: '#fff',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: 1,
                            shadowRadius: 0,
                            shadowOpacity: 0,
                            zIndex: 1,
                            opacity,
                        }]}>
                            <Animated.Image {...{
                                source: require('../../images/loading.gif'),
                                style: {
                                    height: 12,
                                    width: 12,
                                },
                            }}></Animated.Image>
                        </Animated.View>
                    )
                }
                <Animated.Image {...blacklist(this.props, 'onLoadEnd', 'style')}

                style={[...styles]}

                onLoadEnd={e => {

                    Animated.timing(opacity, {
                        toValue: 0,
                        duration: 200
                    }).start();

                    'function' === typeof onLoadEnd && onLoadEnd();
                }}>
                </Animated.Image>
            </View>
        );
    }
}
