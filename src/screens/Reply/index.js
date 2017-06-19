
import React, { Component, PropTypes } from 'react';
import { inject, observer } from 'mobx-react/native';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Dimensions,
} from 'react-native';

export default class Reply extends Component {

    componentDidMount() {
        StatusBar.setHidden(true);
    }

    render() {

        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                    onPress={() => this.props.navigation.goBack()}
                    style={styles.icon}>
                        <Icon name="arrow-left" size={14} color="#000"></Icon>
                    </TouchableOpacity>
                    <Text style={styles.title}>
                        WRITE COMMENTS
                    </Text>
                    <TouchableOpacity style={styles.icon}>
                        <Icon name="paper-plane" size={14} color="#000"></Icon>
                    </TouchableOpacity>
                </View>

                <View style={{
                    paddingLeft: 20,
                    paddingRight: 20,
                    justifyContent: 'center',
                }}>
                    <TextInput {...{

                        style: styles.input,
                        autoFocus: true,
                        multiline: true,
                        maxLength: 255,
                        placeholder: 'Write a comment',

                        ref: 'input',
                    }}></TextInput>
                </View>
            </View>
        );
    }
}

const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    header: {
        height: 80,
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    icon: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },

    title: {
        fontFamily: 'Georgia',
        fontWeight: '400',
        fontSize: 15,
    },

    input: {
        height: height - 80,
    },
});
