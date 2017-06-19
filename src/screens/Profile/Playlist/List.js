
import React, { Component, PropTypes } from 'react';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import { inject } from 'mobx-react/native';
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    Animated,
    ListView,
    StyleSheet,
} from 'react-native';

import Song from './Song';
import RippleHeader from '../../components/RippleHeader';
import Loader from '../../../components/Loader';

@inject(stores => ({

    updatePlaylist: (list) => {

        if (list.length
            && stores.player.playlist.uuid === list.uuid
            && stores.player.playlist.length !== list.length) {
            stores.player.updatePlaylist(list);
        }
    },

    play: (song, playlist) => {

        stores.player.start({

            song,
            playlist,
        });
    },

    isPlaying: (uuid, songid) => {

        var player = stores.player;

        return player.playing
            && player.playlist.uuid === uuid
            && player.song.id === songid;
    },

    paused: stores.player.paused,
}))
export default class List extends Component {

    static propTypes = {
        title: PropTypes.string.isRequired,
        navigate: PropTypes.func.isRequired,
        list: PropTypes.object.isRequired,
        doRefresh: PropTypes.func.isRequired,
        showRefresh: PropTypes.bool.isRequired,
        doLoadMore: PropTypes.func.isRequired,
        showLoadmore: PropTypes.bool.isRequired,
    };

    componentWillReceiveProps(nextProps) {
        this.props.updatePlaylist(nextProps.list);
    }

    state = {
        opacity: new Animated.Value(0),
    };

    render() {

        var { title, list, doRefresh, showRefresh, doLoadMore, showLoadmore, paused } = this.props;
        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1.id !== r2.id
        });
        var dataSource = ds.cloneWithRows(list.slice());
        var opacity = this.state.opacity.interpolate({
            inputRange: [-40, -10],
            outputRange: [1, 0]
        });

        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <RippleHeader></RippleHeader>

                    <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={styles.back}>
                        <Icon name="arrow-left" color="#000" size={14}></Icon>
                    </TouchableOpacity>

                    <Text style={styles.title}>{title}</Text>
                </View>

                <Loader {...{
                    show: true,
                    animate: showRefresh,
                    text: 'REFRESH',
                    style4container: {
                        top: 80,
                        width,
                        opacity: showRefresh ? 1 : opacity,
                        transform: [{
                            rotate: '0deg'
                        }]
                    }
                }}></Loader>

                <ListView

                onScrollEndDrag={e => {

                    if (e.nativeEvent.contentOffset.y < -40) {
                        doRefresh();
                    }
                }}

                onEndReachedThreshold={1}
                onEndReached={() => doLoadMore()}

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

                style={[showRefresh && {
                    paddingTop: 40
                }]}

                enableEmptySections={true}
                dataSource={dataSource}
                renderRow={(song, sectionId, rowId) => {

                    return (
                        <View>
                            <Song {...{
                                artwork: song.artwork,
                                title: song.title,
                                user: song.user,
                                actived: this.props.isPlaying(list.uuid, song.id),
                                paused,
                                play: () => {
                                    this.props.play(song, list);
                                    this.props.navigate('Player');
                                },
                                commentCount: song.commentCount,
                                showComments: () => {
                                    this.props.navigation.navigate('Comments', {
                                        songid: song.id,
                                        count: song.commentCount,
                                    });
                                },
                            }}></Song>

                            <View style={styles.line}></View>
                        </View>
                    );
                }}
                ></ListView>

                {
                    showLoadmore && (

                        <View style={{
                            position: 'absolute',
                            top: 70,
                            left: 0,
                            width,
                            height: height - 70,
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
        backgroundColor: '#fff',
    },

    header: {
        position: 'relative',
        width,
        height: 70,
        paddingBottom: 10,
        marginBottom: 10,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: '#f1dfdd',
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 12,
        shadowOffset: {
            height: 2,
        }
    },

    title: {
        fontWeight: '100',
        letterSpacing: 1,
        backgroundColor: 'transparent',
    },

    back: {
        position: 'absolute',
        left: 20,
        bottom: 10,
        height: 32,
        width: 32,
        justifyContent: 'flex-end',
        backgroundColor: 'transparent',
        zIndex: 9,
    }
});
