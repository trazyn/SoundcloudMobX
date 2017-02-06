
import React, { Component, PropTypes } from 'react';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import {
    View,
    Text,
    Animated,
    StatusBar,
    TouchableOpacity,
    Dimensions,
    InteractionManager,
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
        color: '#000',
    };

    state = {
        height: new Animated.Value(0),
    };

    componentWillReceiveProps(nextProps) {
        StatusBar.setHidden(!!nextProps.show, true);

        if (nextProps.show) {

            InteractionManager.runAfterInteractions(() => {
                Animated.timing(this.state.height, {
                    toValue: 40,
                    duration: 200,
                    delay: 200,
                }).start();
            });
        } else {
            Animated.timing(this.state.height, {
                toValue: 0,
                duration: 150,
            }).start();
        }
    }

    render() {

        var height = this.state.height;
        var opacity = height.interpolate({
            inputRange: [0, 40],
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

const { height, width } = Dimensions.get('window');
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
        shadowColor: "#000000",
        shadowOpacity: 0.3,
        shadowRadius: 4,
        zIndex: 99,
    },

    message: {
        marginLeft: 5,
        fontSize: 12,
        fontWeight: '100',
    },

    done: {
        fontSize: 12,
        fontWeight: '100',
        color: '#ff4081'
    },
});
