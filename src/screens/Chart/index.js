
import React, { Component, PropTypes } from 'react';
import MKIcon from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import { inject, observer } from 'mobx-react/native';
import {
    View,
    Text,
    Dimensions,
    Animated,
    TouchableOpacity,
    ListView,
    StyleSheet,
} from 'react-native';

import parseTimes from '../../utils/parseTimes';
import Loader from '../../components/Loader';
import FadeImage from '../../components/FadeImage';

@inject(stores => ({
    songs: stores.chart.songs,
    genre: stores.chart.genre,
    doRefresh: stores.chart.doRefresh,
    showRefresh: stores.chart.showRefresh,
    doLoadmore: stores.chart.doLoadmore,
    showLoadmore: stores.chart.showLoadmore,
    hasEnd: stores.chart.hasEnd,

    setRoute: stores.route.setRoute.bind(stores.route),

    player: stores.player,
}))
@observer
export default class Chart extends Component {

    static propTypes = {
        songs: PropTypes.object.isRequired,
        genre: PropTypes.object.isRequired,
        doRefresh: PropTypes.func.isRequired,
        showRefresh: PropTypes.bool.isRequired,
        doLoadmore: PropTypes.func.isRequired,
        showLoadmore: PropTypes.bool.isRequired,
        hasEnd: PropTypes.bool.isRequired,
        setRoute: PropTypes.func.isRequired,
    };

    renderCoverWall(start = 0, end = 5) {

        return new Array(end - start).fill(0).map((e, index) => {

            var song = this.props.songs[start + index];

            return (
                <FadeImage key={index + start} {...{
                    source: {
                        uri: song.artwork
                    },

                    style: {
                        height: 75,
                        width: 75,
                    }
                }}></FadeImage>
            );
        });
    }

    isPlaying() {

        var { player, songs } = this.props;

        return player.playing
            && player.playlist.length === songs.length
            && player.playlist.slice().reduce((accumulator, e, index) => accumulator && e.id === songs[index].id);
    }

    showPlaying() {

        this.props.player.start();

        this.setState({
            ...this.state,
            playing: true
        });

        this.props.setRoute({
            name: 'Player'
        });
    }

    togglePlayer() {

        var { songs, player } = this.props;
        var playing = this.state.playing;

        if (!playing) {

            player.setup({
                song: songs[0],
                playlist: songs
            });

            this.showPlaying();
        } else {
            player.toggle();
            this.setState({
                playing: false
            });
        }
    }

    state = {
        opacity: new Animated.Value(0),
        playing: this.isPlaying(),
    };

    render() {

        var { songs, genre, doRefresh, showRefresh, doLoadmore, showLoadmore, hasEnd, player } = this.props;
        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1.id !== r2.id
        });
        var dataSource = ds.cloneWithRows(songs.slice());
        var opacity = this.state.opacity.interpolate({
            inputRange: [-40, -10],
            outputRange: [1, 0],
        });
        var isPlaying = this.isPlaying();

        return (
            <View style={styles.container}>

                <Loader {...{
                    show: true,
                    animate: showRefresh,
                    text: 'REFRESH',
                    style4container: {
                        top: 160,
                        width,
                        opacity: showRefresh ? 1 : opacity,
                        transform: [{
                            rotate: '0deg'
                        }]
                    }
                }}></Loader>

                <View style={styles.header}>
                    <View style={styles.coverWall}>
                        {
                            this.renderCoverWall(0, 5)
                        }
                    </View>
                    <View style={styles.coverWall}>
                        {
                            this.renderCoverWall(5, 10)
                        }
                    </View>
                    <TouchableOpacity onPress={() => this.props.navigator.pop()} style={styles.back}>
                        <MKIcon name="arrow-back" size={16} color="white"></MKIcon>
                    </TouchableOpacity>

                    <View style={styles.hero}>
                        <View>
                            <Text style={styles.genre}>
                                # {genre.name}
                            </Text>
                            <Text style={styles.count}>
                                {songs.length} Tracks
                            </Text>
                        </View>

                        <TouchableOpacity onPress={this.togglePlayer.bind(this)}>
                            {
                                this.state.playing
                                    ? (<Icon name="control-pause" size={20} color="red"></Icon>)
                                    : (<Icon name="control-play" size={20} color="red"></Icon>)
                            }
                        </TouchableOpacity>
                    </View>
                </View>

                <ListView

                onScrollEndDrag={e => {

                    if (e.nativeEvent.contentOffset.y < -40) {
                        doRefresh();
                    }
                }}

                onEndReachedThreshold={1}
                onEndReached={() => {

                    if (hasEnd === false) {
                        doLoadmore(player.appendPlaylist);
                    }
                }}

                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{
                        nativeEvent: {
                            contentOffset: {
                                y: this.state.opacity
                            }
                        }
                    }]
                )}

                style={[styles.songs, showRefresh && {
                    paddingTop: 40
                }]}

                enableEmptySections={true}
                dataSource={dataSource}
                renderRow={(song, sectionId, rowId) => {

                    var times = parseTimes(song.duration);
                    var active = isPlaying && song.id === player.song.id;

                    return (
                        <View>
                            <TouchableOpacity onPress={() => {

                                var { setRoute } = this.props;

                                if (isPlaying) {
                                    player.setup({
                                        song,
                                    });
                                } else {
                                    player.setup({
                                        song,
                                        playlist: songs
                                    });
                                }

                                this.showPlaying();
                            }}>
                                <View style={styles.song}>
                                    <View>
                                        <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.title, active && styles.active]}>{song.title}</Text>
                                        <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.author, active && styles.active]}>{song.user.username}</Text>
                                    </View>

                                    <Icon name="heart" size={10} style={[styles.fav, song.fav && {
                                        color: 'red'
                                    }]}></Icon>

                                    <Text style={styles.times}>{times.minutes}:{times.seconds}</Text>
                                </View>
                            </TouchableOpacity>

                            {
                                ++rowId === 50 && (
                                    <View style={{
                                        width,
                                        marginBottom: 15,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexDirection: 'row',
                                    }}>
                                        <View style={styles.line}></View>

                                        <Text style={styles.end}>END</Text>

                                        <View style={styles.line}></View>
                                    </View>
                                )
                            }
                        </View>
                    );
                }}>
                </ListView>

                {
                    showLoadmore && (

                        <View style={{
                            position: 'absolute',
                            top: 150,
                            left: 0,
                            width,
                            height: height - 150,
                            backgroundColor: 'rgba(255,255,255,.9)',
                            zIndex: 99
                        }}>
                            <Loader {...{
                                show: true,
                                animate: true,
                                text: 'LOAD MORE',
                                style4container: {
                                    width,
                                    transform: [{
                                        rotate: '0deg'
                                    }]
                                }
                            }}></Loader>
                        </View>
                    )
                }
            </View>
        );
    }
}

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },

    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        width,
        height: 150,
        zIndex: 9
    },

    back: {
        position: 'absolute',
        left: 20,
        top: 40,
        backgroundColor: 'transparent',
        zIndex: 9,
    },

    coverWall: {
        height: 75,
        width,
        flexDirection: 'row',
    },

    hero: {
        position: 'absolute',
        left: 0,
        top: 0,
        height: 150,
        width,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 75,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: 'rgba(0,0,0,.4)'
    },

    genre: {
        color: '#fff'
    },

    count: {
        marginTop: 10,
        color: 'rgba(255,255,255,.8)',
        fontSize: 12,
        fontWeight: '100',
    },

    songs: {
        marginTop: 150,
        paddingTop: 20,
    },

    song: {
        width,
        paddingLeft: 20,
        paddingRight: 20,
        marginBottom: 30,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },

    title: {
        color: 'rgba(0,0,0,.7)',
        fontSize: 13,
        width: 240,
        backgroundColor: 'transparent',
    },

    author: {
        marginTop: 5,
        color: 'rgba(0,0,0,.5)',
        fontSize: 11,
        width: 240,
        backgroundColor: 'transparent',
    },

    active: {
        color: '#f50',
    },

    fav: {
        marginLeft: 18,
        backgroundColor: 'transparent',
    },

    times: {
        color: 'rgba(0,0,0,.5)',
        fontSize: 11,
        backgroundColor: 'transparent',
    },

    line: {
        height: 1,
        width: 20,
        backgroundColor: '#000'
    },

    end: {
        marginRight: 10,
        marginLeft: 10,
        fontSize: 12,
        fontWeight: '100'
    },
});
