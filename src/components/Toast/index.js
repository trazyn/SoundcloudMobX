
import React, { Component, PropTypes } from 'react';
import {
    Text,
    Animated,
    StatusBar,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
} from 'react-native';

export default class Toast extends Component {
    static propTypes = {
        show: PropTypes.bool.isRequired,
        close: PropTypes.func.isRequired,
        message: PropTypes.string,
        color: PropTypes.string.isRequired,
    };

    static defaultProps = {
        color: 'rgba(0,0,0,.75)',
    };

    state = {
        height: new Animated.Value(0),
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.show) {
            StatusBar.setHidden(true, true);

            Animated.timing(this.state.height, {
                toValue: 60,
                duration: 200,
                delay: 200,
            }).start();
        } else {
            Animated.timing(this.state.height, {
                toValue: 0,
                duration: 300,
            }).start(() => {
                StatusBar.setHidden(false, true);
            });
        }
    }

    render() {
        var height = this.state.height;
        var opacity = height.interpolate({
            inputRange: [0, 60],
            outputRange: [0, 1]
        });

        return (
            <Animated.View style={[styles.container, {
                height,
                opacity,
            }]}>
                <Text numberOfLines={2} ellipsizeMode="tail" style={[styles.message, {
                    color: this.props.color,
                }]}>{this.props.message}</Text>
                <TouchableOpacity onPress={this.props.close}>
                    <Text style={styles.done}>DONE</Text>
                </TouchableOpacity>
            </Animated.View>
        );
    }
}

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({

    container: {
        position: 'absolute',
        left: 0,
        top: 0,
        width,
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.4,
        shadowRadius: 8,
        zIndex: 99,
    },

    message: {
        fontFamily: 'HelveticaNeue-Light',
        marginLeft: 5,
        width: width - 60,
        fontSize: 13,
    },

    done: {
        fontFamily: 'HelveticaNeue-Light',
        color: '#ff4081'
    },
});
