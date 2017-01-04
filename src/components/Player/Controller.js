
import React, { Component, PropTypes } from 'react';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import {
    View,
    TouchableOpacity,
    Text,
    Dimensions,
    StyleSheet,
} from 'react-native';

export default class Controller extends Component {

    render() {

        return (
            <View>
                <View style={styles.control}>

                    <View style={styles.inline}>
                        <TouchableOpacity style={styles.transparent}>
                            <Icon name="shuffle" size={14} color="black"></Icon>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.transparent}>
                            <Icon name="control-start" size={14} color="black"></Icon>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.play}>
                        <TouchableOpacity style={styles.transparent}>
                            <Icon name="control-play" size={20} color="black"></Icon>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inline}>
                        <TouchableOpacity style={styles.transparent}>
                            <Icon name="control-end" size={14} color="black"></Icon>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.transparent}>
                            <Icon name="heart" size={14} color="red"></Icon>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
    control: {
        width,
        marginTop: 40,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },

    transparent: {
        backgroundColor: 'transparent',
        margin: 10,
    },

    play: {
        height: 70,
        width: 70,
        borderRadius: 70,
        borderWidth: 1,
        borderColor: 'black',
        alignItems: 'center',
        justifyContent: 'center'
    },

    inline: {
        flexDirection: 'row',
    },
});
