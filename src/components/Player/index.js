
import React, { Component, PropTypes } from 'react';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import { inject, observer } from 'mobx-react/native';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    TouchableHighlight,
    Dimensions,
    StyleSheet,
} from 'react-native';

import Bar from './Bar';
import Controller from './Controller';

@inject(stores => ({
    playing: stores.player.playing,
    toggle: stores.player.toggle,
    start: stores.player.toggle,
    stop: stores.player.toggle,
}))
@observer
export default class Player extends Component {

    static propTypes = {
        playing: PropTypes.bool.isRequired,
        toggle: PropTypes.func.isRequired,
        start: PropTypes.func.isRequired,
        stop: PropTypes.func.isRequired,
    };

    parseDuration(num) {

        var minutes = 0;
        var seconds = 0;

        num = Math.floor(num / 1000);

        minutes = ('0' + Math.floor(num / 60)).slice(-2);
        seconds = ('0' + num % 60).slice(-2);

        return { minutes, seconds };
    }

    render() {

        const { song } = this.props.route;

        if (!song || !song.id) {
            return false;
        }

        var time = this.parseDuration(song.duration);
        var cover = song.artwork.replace(/large\./, 't500x500.');

        return (
            <View style={styles.container}>
                <Image {...{
                    source: {
                        uri: cover
                    },

                    blurRadius: 30,

                    style: {
                        width,
                        height,
                        resizeMode: 'cover'
                    }
                }}>

                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => this.props.navigator.pop()} style={{
                            backgroundColor: 'transparent',
                        }}>
                            <Icon name="arrow-down" size={14} color="white"></Icon>
                        </TouchableOpacity>

                        <TouchableOpacity style={{
                            backgroundColor: 'transparent',
                        }}>
                            <Icon name="options" size={14} color="white"></Icon>
                        </TouchableOpacity>
                    </View>

                    <Image {...{
                        source: {
                            uri: cover
                        },

                        style: styles.cover
                    }}>
                        <View style={styles.hero}>
                            <View style={styles.avatar}>
                                <Image {...{
                                    source: {
                                        uri: song.user.avatar_url
                                    },

                                    style: {
                                        width: 64,
                                        height: 64,
                                    }
                                }}></Image>
                            </View>

                            <View style={{
                                flex: 1,
                                justifyContent: 'flex-start',
                                flexDirection: 'row',
                            }}>
                                <Text style={styles.author}>{song.user.username}</Text>
                            </View>
                            <TouchableHighlight>
                                <Text style={styles.title}>{song.title}</Text>
                            </TouchableHighlight>

                            <View style={styles.duration}>
                                <Text style={styles.current}>00:00</Text>
                                <Text style={styles.total}> / {time.minutes}:{time.seconds}</Text>
                            </View>
                        </View>
                    </Image>

                    <Bar {...{
                        duration: song.duration
                    }}></Bar>

                    <Controller></Controller>
                </Image>

                <View style={styles.dots}>
                    <View style={styles.dot}></View>
                    <View style={styles.dot}></View>
                </View>
            </View>
        );
    }
}

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        width,
        height,
        backgroundColor: '#fff',
    },

    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        width,
        height: 100,
        paddingLeft: 20,
        paddingRight: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 9
    },

    hero: {
        position: 'absolute',
        width,
        top: 140,
        left: 0
    },

    cover: {
        width,
        height: 470,
        resizeMode: 'cover',
    },

    avatar: {
        marginLeft: 20,
        marginBottom: 30,
        height: 96,
        width: 96,
        borderRadius: 64,
        overflow: 'hidden'
    },

    author: {
        paddingLeft: 20,
        paddingTop: 2,
        paddingBottom: 2,
        paddingRight: 2,
        marginBottom: 12,
        fontWeight: '100',
        fontSize: 13,
        color: '#f50',
        backgroundColor: 'rgba(0,0,0,.8)'
    },

    title: {
        paddingLeft: 20,
        paddingTop: 2,
        paddingBottom: 2,
        maxWidth: 260,
        fontSize: 18,
        fontWeight: '100',
        lineHeight: 32,
        color: '#fff',
        backgroundColor: 'rgba(0,0,0,.8)'
    },

    duration: {
        position: 'absolute',
        right: 0,
        top: 310,
        width: 80,
        padding: 4,
        backgroundColor: 'rgba(255,255,255,.9)',
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },

    current: {
        color: '#f50',
        fontSize: 10,
    },

    total: {
        color: 'rgba(0,0,0,.8)',
        fontSize: 10,
    },

    dots: {
        position: 'absolute',
        bottom: 0,
        width,
        height: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },

    dot: {
        marginLeft: 10,
        marginRight: 10,
        height: 6,
        width: 6,
        borderRadius: 6,
        backgroundColor: 'rgba(0,0,0,.6)',
    }
});
