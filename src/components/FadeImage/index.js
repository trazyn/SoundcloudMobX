
import React, { Component, PropTypes } from 'react';
import { View, Animated } from 'react-native';
import blacklist from '../../utils/blacklist';

export default class FadeImage extends Component {
    static propTypes = {
        showLoading: PropTypes.bool,
        onLoadEnd: PropTypes.func,
    };

    static defaultProps = {
        showLoading: false,
        onLoadEnd: Function,
    };

    state = {
        opacity: new Animated.Value(0),
        loaded: false,
    };

    render() {
        var opacity = this.state.opacity;
        var styles = this.props.style;
        var loadingOpacity = opacity.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0],
        });

        styles = Array.isArray(styles) ? styles : [styles];

        return (
            <View style={[styles, {
                justifyContent: 'center',
                alignItems: 'center',
            }]}>
                {
                    (this.props.showLoading && !this.state.loaded) && (
                        <Animated.View style={[styles, {
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            backgroundColor: '#fff',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: loadingOpacity,
                            shadowRadius: 0,
                            shadowOpacity: 0,
                            zIndex: 1,
                        }]}>
                            <Animated.Image {...{
                                source: require('../../images/loading.gif'),
                                style: {
                                    height: 12,
                                    width: 12,
                                },
                            }} />
                        </Animated.View>
                    )
                }
                <Animated.Image {...blacklist(this.props, 'onLoadEnd', 'style')}

                    style={[...styles, {
                        opacity,
                    }]}

                    onLoadEnd={e => {
                        this.setState({
                            ...this.state,
                            loaded: true,
                        });
                        this.props.onLoadEnd();

                        Animated.timing(opacity, {
                            toValue: 1,
                            duration: 400
                        }).start();
                    }}>
                    {this.props.children}
                </Animated.Image>
            </View>
        );
    }
}
