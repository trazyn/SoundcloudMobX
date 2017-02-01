
import React, { Component, PropTypes } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    Animated,
    TouchableOpacity,
    InteractionManager,
} from 'react-native';

export default class Login extends Component {

    render() {

        return (
            <View style={styles.container}>

            </View>
        );
    }
}

const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        height,
        width,
        zIndex: 99
    }
});
