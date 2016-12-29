
import React, { Component, PropTypes } from 'react';
import {
    ListView,
    StyleSheet,
    Text,
    View,
    Dimensions,
    Animated,
    TouchableOpacity
} from 'react-native';

import Song from '../../components/Song';

export default class Songs extends Component {

    static propTypes = {
        list: PropTypes.object.isRequired,
    };

    state = {
        opacity: new Animated.Value(0)
    };

    pull(e) {

        var { x, y } = e.nativeEvent.contentOffset;

        if (x < -40) {
        }
    }

    componentDidMount() {
        this.state.opacity.setValue(0);
        Animated.timing(this.state.opacity, {
            toValue: 1,
            duration: 100
        }).start();
    }

    render() {

        const { list } = this.props;
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1.id !== r2.id
        });
        const dataSource = ds.cloneWithRows(list.slice());

        return (
            <View>

                <Animated.View ref="refresh" style={[styles.refresh, {
                    opacity: this.state.opacity,
                }]}>
                    <View style={[styles.line, styles.up]}></View>
                    <Text style={styles.text}>REFRESH</Text>
                    <View style={[styles.line, styles.down]}></View>
                </Animated.View>

                <ListView

                ref='container'

                style={styles.container}
                showsHorizontalScrollIndicator={false}
                horizontal={true}

                decelerationRate={0}
                snapToInterval={width - (width - 300) / 2 - 20}
                snapToAlignment='start'

                scrollEventThrottle={16}
                onScroll={this.pull.bind(this)}

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
        height: 1,
        width: 60,
        backgroundColor: '#000'
    },

    pad: {
        marginRight: (width - 340) / 2 + 13
    }
});
