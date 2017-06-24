
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react/native';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';

import FadeImage from '../../components/FadeImage';
import songsFilter from '../../utils/songsFilter';
import humanNumber from '../../utils/humanNumber';

@inject(stores => ({
    uuid: stores.player.playlist.uuid,
    songid: stores.player.song.id,
}))
@observer
export default class Suggestion extends Component {
    static propTypes = {
        seed: PropTypes.object.isRequired,
        tracks: PropTypes.array.isRequired,
        play: PropTypes.func.isRequired,
    };

    renderContent(tracks) {
        var { uuid, songid, seed } = this.props;

        return songsFilter(tracks).map((track, index) => {
            var playing = uuid === seed.id && songid === track.id;

            return (
                <TouchableOpacity style={styles.item} key={index} onPress={() => {
                    this.props.play(track);
                }}>
                    <FadeImage {...{
                        source: {
                            uri: track.artwork
                        },

                        style: {
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            height: 115,
                            width: 335,
                        }
                    }} />

                    <View style={[styles.overlay, playing && {
                        backgroundColor: 'rgba(255,255,255,.8)',
                    }]}>
                        <Text numberOfLines={1} ellipsizeMode="tail" style={[{
                            marginTop: 10,
                            fontWeight: '100',
                            color: '#fff',
                            width: 260,
                            textAlign: 'center',
                        }, playing && styles.playing]}>{track.title.toUpperCase()}</Text>

                        <View style={{
                            marginTop: 10,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <View style={[styles.line, playing && { backgroundColor: '#f50' }]} />
                            <Text style={[{
                                marginRight: 10,
                                marginLeft: 10,
                                fontSize: 12,
                                color: '#fff',
                                fontWeight: '100',
                            }, playing && styles.playing]}>{track.user.username}</Text>
                            <View style={[styles.line, playing && { backgroundColor: '#f50' }]} />
                        </View>

                        <View style={{
                            marginTop: 25,
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            alignItems: 'center',
                        }}>
                            <Text style={[styles.meta, playing && styles.playing]}>{humanNumber(track.likedCount)} LIKES</Text>
                            <Text style={[styles.meta, playing && styles.playing, {
                                marginRight: 30,
                                marginLeft: 30,
                            }]}>{humanNumber(track.commentCount)} COMMENTS</Text>
                            <Text style={[styles.meta, playing && styles.playing]}>{humanNumber(track.playbackCount)} PLAYED</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            );
        });
    }

    render() {
        var seed = this.props.seed;

        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={{
                        color: '#4A4A4A',
                        fontWeight: '100',
                        fontSize: 14,
                    }}>
                        Beacuse You Like
                    </Text>

                    <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
                        {seed.title}
                    </Text>
                </View>

                {
                    this.renderContent(this.props.tracks)
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },

    header: {
        margin: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    title: {
        marginLeft: 2,
        maxWidth: 135,
        fontSize: 14,
        fontWeight: '100',
        color: '#000',
    },

    overlay: {
        height: 115,
        width: 335,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,.4)',
    },

    item: {
        height: 115,
        width: 335,
        marginBottom: 10,
        shadowOpacity: 0.3,
        shadowRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },

    line: {
        height: .5,
        width: 30,
        backgroundColor: '#fff',
    },

    meta: {
        fontSize: 10,
        fontWeight: '100',
        color: '#fff',
    },

    playing: {
        color: '#f50',
    },
});
