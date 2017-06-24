
import React, { Component } from 'react';
import PropTypes from 'prop-types';
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

import Loader from '../../components/Loader';

@inject(stores => ({
    commit: stores.comments.commit,
    sending: stores.comments.loading4send,
    error: stores.error,
}))
@observer
export default class Reply extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
    };

    componentDidMount() {
        StatusBar.setHidden(true);
    }

    async handleSend() {
        var { commit, error } = this.props;
        var comment = this.refs.input._lastNativeText;

        if (!comment) {
            return error('Comment can not be null');
        }

        var res = await commit(comment);

        if (res) {
            this.props.navigation.goBack();
        } else {
            error('Failed to commit');
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={styles.icon}>
                        <Icon name="arrow-left" size={14} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.title}>
                        WRITE COMMENTS
                    </Text>
                    <TouchableOpacity onPress={() => this.handleSend()} style={styles.icon}>
                        <Icon name="paper-plane" size={14} color="#000" />
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
                    }} />
                </View>

                {
                    this.props.sending && (
                        <View style={{
                            position: 'absolute',
                            top: 80,
                            left: 0,
                            width,
                            height: height - 80,
                            backgroundColor: 'rgba(255,255,255,.9)',
                            zIndex: 99
                        }}>
                            <Loader {...{
                                show: true,
                                animate: true,
                                text: 'SENDING',
                                style4container: {
                                    width,
                                    transform: [{
                                        rotate: '0deg'
                                    }]
                                }
                            }} />
                        </View>
                    )
                }
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
