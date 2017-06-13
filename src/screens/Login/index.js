
import React, { Component, PropTypes } from 'react';
import { observer, inject } from 'mobx-react/native';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import {
    View,
    Text,
    TextInput,
    StatusBar,
    TouchableOpacity,
    Linking,
    StyleSheet,
    Dimensions,
} from 'react-native';

import { CLIENT_ID, SECRET } from '../../config';
import Loader from '../../components/Loader';
import FadeImage from '../../components/FadeImage';

@inject(stores => ({
    login: stores.session.login,
    loading: stores.session.loading,
}))
export default class Login extends Component {

    handleLogin() {

        var { info, error } = this.props.message;
        var { username, password } = this.refs;

        username = username._lastNativeText.trim();
        password = password._lastNativeText.trim();

        if (!username || !password) {
            error('Invaild Username or Password!');
        } else {
            this.props.login(username, password)
                .then(() => {
                    info('Login Success!');
                    this.props.navigation.navigate('Profile');
                })
                .catch(ex => {
                    error('Invaild Username or Password!');
                });
        }
    }

    componentDidMount() {
        StatusBar.setBarStyle('light-content', true);
    }

    render() {

        var { loading } = this.props;

        return (
            <View style={styles.container}>
                <FadeImage showLoading={true} source={{
                    uri: 'https://unsplash.it/375/667?random'
                }}
                style={styles.background}>
                </FadeImage>

                <View style={styles.content}>
                    {
                        loading && (
                            <View style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width,
                                height,
                                backgroundColor: 'rgba(255,255,255,.7)',
                                zIndex: 9
                            }}>
                                <Loader {...{
                                    show: true,
                                    animate: true,
                                    text: 'LOGINING',
                                    style4container: {
                                        width,
                                        marginTop: 122,
                                        transform: [{
                                            rotate: '0deg'
                                        }]
                                    }
                                }}></Loader>
                            </View>
                        )
                    }
                    <Text style={styles.title}>SoundcloudMboX</Text>

                    <View style={styles.hero}>
                        <Text style={[styles.text, {
                            color: 'rgba(0,0,0,.6)'
                        }]}>Welcome Back!</Text>
                        <Text style={[styles.text, {
                            color: 'rgba(0,0,0,.45)'
                        }]}>Sign in to continue</Text>
                        <Text style={[styles.text, {
                            color: 'rgba(0,0,0,.45)'
                        }]}>to SoundcloudMboX.</Text>
                    </View>

                    <View style={styles.form}>
                        <TextInput
                        style={styles.input}
                        autoCapitalize='none'
                        autoCorrect={false}
                        maxLength={40}
                        placeholderTextColor='rgba(0,0,0,.45)'
                        ref="username"
                        placeholder='Email'>
                        </TextInput>

                        <TextInput
                        style={styles.input}
                        secureTextEntry={true}
                        maxLength={20}
                        placeholderTextColor='rgba(0,0,0,.45)'
                        ref="password"
                        placeholder='Password'>
                        </TextInput>

                        <TouchableOpacity onPress={this.handleLogin.bind(this)}>
                            <Text style={styles.login}>Login</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.bottom}>
                        <View style={styles.note}>
                            <Text style={styles.muted}>Don't have an account?</Text>

                            <TouchableOpacity onPress={() => {
                                Linking.openURL('https://soundcloud.com/');
                            }}>
                                <Text style={[styles.muted, {
                                    marginLeft: 5,
                                    color: 'rgba(0,0,0,.55)',
                                }]}>Sign up</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.back} onPress={() => this.props.navigation.goBack()}>Contine without sigining in</Text>
                    </View>
                </View>
            </View>
        );
    }
}

const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {

    },
    content: {
        position: 'absolute',
        left: 0,
        top: 0,
        height,
        width,
        paddingLeft: 35,
        backgroundColor: 'rgba(255,255,255,.7)',
        zIndex: 99
    },

    background: {
        position: 'absolute',
        left: 0,
        top: 0,
        height,
        width,
    },

    title: {
        marginTop: 60,
        fontSize: 22,
        fontWeight: '200',
        color: 'rgba(0,0,0,.8)'
    },

    hero: {
        marginTop: 40,
    },

    text: {
        marginTop: 5,
        fontSize: 26,
        letterSpacing: 2,
        fontWeight: '100',
    },

    form: {
        marginTop: 75,
    },

    input: {
        width: width - 70,
        height: 40,
        marginTop: 10,
        marginBottom: 10,
        letterSpacing: 2,
        color: 'rgba(0,0,0,.7)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    login: {
        marginTop: 55,
        fontSize: 24,
        letterSpacing: 2,
        color: '#4285f4',
    },

    bottom: {
        position: 'absolute',
        width,
        bottom: 70,
        paddingLeft: 36,
    },

    note: {
        flexDirection: 'row',
    },

    muted: {
        color: 'rgba(0,0,0,.4)',
        letterSpacing: 1,
    },

    back: {
        fontSize: 12,
        marginTop: 20,
        color: 'rgba(0,0,0,.7)',
        letterSpacing: 1,
    }
});
