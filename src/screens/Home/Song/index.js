
import React, { Component, PropTypes } from 'react';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import MKIcon from 'react-native-vector-icons/MaterialIcons';
import { inject, observer } from 'mobx-react/native';
import {
    View,
    Text,
    TouchableOpacity,
    TouchableHighlight,
    Dimensions,
    StyleSheet,
    Image,
} from 'react-native';

import blacklist from '../../../utils/blacklist';
import humanNumber from '../../../utils/humanNumber';
import Playing from './Playing';

@inject(stores => {

    var player = stores.player;

    return {
        isPlaying: (id) => {
            return player.playing
                && player.song.id === id
                && player.playlist.uuid === stores.home.playlist.uuid;
        },
    };
})
export default class Song extends Component {

    static propTypes = {
        title: PropTypes.string.isRequired,
        id: PropTypes.number.isRequired,
        duration: PropTypes.number.isRequired,
        commentCount: PropTypes.number.isRequired,
        likesCount: PropTypes.number.isRequired,
        playbackCount: PropTypes.number.isRequired,
        created: PropTypes.number.isRequired,
        genre: PropTypes.string.isRequired,
        streamable: PropTypes.bool.isRequired,
        streamUrl: PropTypes.string.isRequired,
        taglist: PropTypes.string.isRequired,
        uri: PropTypes.string.isRequired,
        fav: PropTypes.bool.isRequired,
        user: PropTypes.object.isRequired,
        waveform: PropTypes.string.isRequired,
        labelId: PropTypes.number,
        lableNumber: PropTypes.string,
        release: PropTypes.string,
        releaseDay: PropTypes.number,
        releaseMonth: PropTypes.number,
        releaseYear: PropTypes.number,
        desc: PropTypes.string,
        artwork: PropTypes.string,

        play: PropTypes.func.isRequired,
    };

    render() {

        const { title, id, user, artwork, likesCount, commentCount, playbackCount, play } = this.props;

        var playing = this.props.isPlaying(id);

        return (
            <View style={[styles.container, this.props.style]}>
                <View style={!playing && styles.shadow}>

                    {
                        playing

                        ? <Playing artwork={artwork} title={title} user={user} enter={() => play({...blacklist(this.props, 'play')})}></Playing>
                        : (
                            <View style={{
                                overflow: 'hidden'
                            }}>
                                <View style={[styles.placeholder, {
                                    backgroundColor: `#${('00' + (Math.random() * 1000 | 0)).slice(-3)}`
                                }]}>
                                    <Image source={{
                                        uri: artwork,
                                    }}
                                    style={styles.artwork}>
                                    </Image>
                                </View>

                                <View>
                                    <Text style={styles.title} ellipsizeMode="tail" numberOfLines={1}>{title}</Text>
                                    <Text style={styles.username}>{user ? user.username : 'UNKNOW'}</Text>

                                    <View style={styles.meta}>
                                        <TouchableOpacity style={styles.metaItem}>
                                            <Icon name="heart" style={styles.metaIcon}></Icon>
                                            <Text style={styles.metaText}>{humanNumber(likesCount)}</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity style={styles.metaItem}>
                                            <Icon name="bubble" style={styles.metaIcon}></Icon>
                                            <Text style={styles.metaText}>{humanNumber(commentCount)}</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity style={styles.metaItem}>
                                            <Icon name="music-tone-alt" style={styles.metaIcon}></Icon>
                                            <Text style={styles.metaText}>{humanNumber(playbackCount)}</Text>
                                        </TouchableOpacity>

                                            <TouchableHighlight style={styles.play} onPress={() => play({...blacklist(this.props, 'play')})}>
                                                <MKIcon name="play-arrow" style={styles.playIcon}></MKIcon>
                                            </TouchableHighlight>
                                    </View>
                                </View>
                            </View>
                        )
                    }

                </View>
            </View>
        );
    }
}

const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        width: 300,
        height: 432.5,
        marginRight: (width - 340) / 4,
        marginLeft: (width - 340) / 4,
        borderWidth: 0,
        backgroundColor: '#fff',
        alignItems: 'center',
    },

    shadow: {
        width: 300,
        shadowColor: "#000000",
        shadowOpacity: 0.3,
        shadowRadius: 8,
        shadowOffset: {
            height: 8,
            width: -2
        },
    },

    title: {
        width: 255,
        marginTop: 40,
        marginLeft: 20,
        marginBottom: 10,
        fontSize: 14,
        color: 'rgba(0,0,0,.7)',
        overflow: 'hidden',
    },

    username: {
        marginLeft: 20,
        marginBottom: 30,
        color: 'rgba(0,0,0,.5)',
        fontSize: 11,
    },

    artwork: {
        width: 300,
        height: 300,
    },

    meta: {
        position: 'relative',
        paddingLeft: 20,
        paddingRight: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },

    metaItem: {
        flexDirection: 'row',
    },

    metaIcon: {
        color: 'rgba(0,0,0,.5)',
        fontSize: 11,
    },

    metaText: {
        color: 'rgba(0,0,0,.5)',
        marginBottom: 10,
        fontSize: 10,
        marginLeft: 4
    },

    play: {
        position: 'absolute',
        right: 20,
        top: -134,
        height: 48,
        width: 48,
        borderRadius: 48,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: 'rgba(0,0,0,.9)',
        shadowColor: "#000000",
        shadowOpacity: 0.8,
        shadowRadius: 8,
        shadowOffset: {
            height: 2,
            width: 2
        },
    },

    playIcon: {
        color: '#fff',
        fontSize: 20,
        alignItems: 'center',
    },

    placeholder: {
        height: 300,
        width: 300,
    },
});
