
import React, { Component, PropTypes } from 'react';
import {
    ListView,
    StyleSheet,
    Text,
    View,
    Dimensions,
    Animated,
    TouchableOpacity,
    InteractionManager,
} from 'react-native';

import Song from '../../components/Song';

export default class Songs extends Component {

    static propTypes = {
        list: PropTypes.object.isRequired,
        refreshing: PropTypes.bool.isRequired,
        refresh: PropTypes.func.isRequired,
    };

    state = {
        opacity: new Animated.Value(0),
        width: new Animated.Value(60),
    };

    refreshing() {

        Animated.sequence([
            Animated.timing(this.state.width, {
                toValue: 15,
                duration: 1000
            }),
            Animated.timing(this.state.width, {
                toValue: 50,
                duration: 400
            }),
        ]).start(e => this.props.refreshing && e.finished && this.refreshing());
    }

    render() {

        var { list, refresh, refreshing } = this.props;
        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1.id !== r2.id
        });
        var dataSource = ds.cloneWithRows(list.slice());
        var opacity = this.state.opacity.interpolate({
            inputRange: [-30, -5],
            outputRange: [1, 0],
        });

        if (refreshing) {
            opacity = 1;
            this.refreshing();
        }

        return (
            <View>

                <Animated.View ref="refresh" style={[styles.refresh, { opacity }]}>
                    <Animated.View style={[styles.line, {
                        width: this.state.width
                    }]}></Animated.View>
                    <Text style={styles.text}>REFRESH</Text>
                    <Animated.View style={[styles.line, {
                        width: this.state.width
                    }]}></Animated.View>
                </Animated.View>

                <ListView

                onScrollEndDrag={e => {

                    if (e.nativeEvent.contentOffset.x < -30) {
                        InteractionManager.runAfterInteractions(() => refresh());
                    }
                }}

                style={styles.container}
                showsHorizontalScrollIndicator={false}
                horizontal={true}

                decelerationRate={0}
                snapToInterval={width - (width - 300) / 2 - 20}
                snapToAlignment='start'

                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{
                        nativeEvent: {
                            contentOffset: {
                                x: this.state.opacity
                            }
                        }
                    }]
                )}

                enableEmptySections={true}
                dataSource={dataSource}
                renderRow={song => {

                    var index = list.findIndex(e => e.id === song.id);

                    return (
                        <Song {...{
                            title: song.title,
                            id: song['id'],
                            artwork: song['artwork_url'],
                            commentCount: song['comment_count'],
                            likesCount: song['likes_count'],
                            playbackCount: song['playback_count'],
                            created: +new Date(song['created_at']),
                            desc: song['description'],
                            genre: song['genre'],
                            labelId: song['label_id'],
                            lableNumber: song['label_name'],
                            release: song['release'],
                            releaseDay: song['release_day'],
                            releaseMonth: song['release_month'],
                            releaseYear: song['release_year'],
                            streamable: song['streamable'],
                            streamUrl: song['stream_url'],
                            taglist: song['tag_list'],
                            uri: song['uri'],
                            fav: song['user_favorite'],
                            user: song['user'],
                            waveform: song['waveform_url'],

                            style: [(index === list.length - 1 && styles.pad), {
                                left: -index * .5 - .5
                            }]
                        }}></Song>
                    );

                }}>
                </ListView>
            </View>
        );
    }
}

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        width,
        paddingLeft: (width - 340) / 4 + 20,
        marginTop: 16
    },

    refresh: {
        position: 'absolute',
        top: width / 2 + 30,
        left: -11,
        alignItems: 'center',
        opacity: 0,
        transform: [{
            rotate: '90deg'
        }],
    },

    text: {
        width: 60,
        paddingLeft: 2,
        paddingTop: 3,
        paddingBottom: 3,
        letterSpacing: 2,
        fontWeight: '100',
        textAlign: 'center',
        fontSize: 7
    },

    line: {
        height: .5,
        width: 60,
        backgroundColor: '#000'
    },

    pad: {
        marginRight: (width - 340) / 2 + 13
    }
});
