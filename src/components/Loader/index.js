
import React, { Component, PropTypes } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Dimensions,
} from 'react-native';

export default class Loader extends Component {

    static propTypes = {
        show: PropTypes.bool.isRequired,
        animate: PropTypes.bool,
        text: PropTypes.string,
        style4container: PropTypes.object,
        style4text: PropTypes.object,
    };

    static defaultProps = {
        text: 'LOADING',
        animate: false,
    };

    state = {
        width: new Animated.Value(90)
    };

    animating() {

        var width = this.state.width;

        Animated.sequence([
            Animated.timing(width, {
                toValue: 15,
                duration: 1000
            }),
            Animated.timing(width, {
                toValue: 90,
                duration: 400
            }),
        ]).start(e => {

            if (this.props.show && this.props.animate && e.finished) {
                this.animating();
            } else {
                width.setValue(90);
            }
        });
    }

    componentDidMount() {
        if (this.props.animate) {
            this.animating();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.animate !== nextProps.animate) {
            this.animating();
        }
    }

    render() {

        const { show, text, style4text, style4container } = this.props;

        if (!show) {
            return false;
        }

        return (
            <Animated.View style={[styles.container, style4container]}>
                <Animated.View style={[styles.line, { width: this.state.width }]}></Animated.View>
                <Text style={[styles.text, style4text]}>{text}</Text>
                <Animated.View style={[styles.line, { width: this.state.width }]}></Animated.View>
            </Animated.View>
        );
    }
}

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({

    container: {
        position: 'absolute',
        top: width / 2 + 30,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        opacity: 1,
        transform: [{
            rotate: '90deg'
        }],
        zIndex: 9
    },

    text: {
        width: 120,
        paddingLeft: 2,
        paddingTop: 3,
        paddingBottom: 3,
        letterSpacing: 2,
        fontWeight: '100',
        textAlign: 'center',
        fontSize: 11,
    },

    line: {
        height: .5,
        width: 90,
        backgroundColor: '#000'
    },
});
