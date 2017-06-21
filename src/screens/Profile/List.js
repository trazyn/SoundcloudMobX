
import React, { Component, PropTypes } from 'react';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
} from 'react-native';

export default class List extends Component {
    static propTypes = {
        title: PropTypes.string,
        data: PropTypes.array,
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Icon name="arrow-left" color="black" size={14} />

                    <Text style={styles.title}>RECENTLY PLAYED</Text>
                </View>
            </View>
        );
    }
}

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    header: {
        position: 'relative',
        width,
        height: 70,
        paddingBottom: 10,
        justifyContent: 'flex-end',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: .3,
        shadowRadius: 12,
        shadowOffset: {
            height: 2,
        }
    },
});
