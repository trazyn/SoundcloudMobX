
import React, { Component, PropTypes } from 'react';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import { inject, observer } from 'mobx-react/native';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    TouchableHighlight,
    ScrollView,
    Dimensions,
    StyleSheet,
    Share,
} from 'react-native';

import Bar from './Bar';
import PlayList from './PlayList';
import Controller from './Controller';
import parseTimes from '../../utils/parseTimes';
import humanNumber from '../../utils/humanNumber';

@inject(stores => {
    var { song, playing, progress, start } = stores.player;

    return {
        song,
        playing,
        start,
        progress,
        openModal: stores.openModal,
    };
})
@observer
export default class Player extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
    };

    state = {
        index: 1,
    };

    componentDidMount() {
        this.refs.viewport.scrollTo({
            x: width,
            animated: false
        });
    }

    render() {
        var { navigation, song, progress } = this.props;
        var cover = song.artwork.replace(/large\./, 't500x500.');
        var times = parseTimes(song.duration);
        var current = parseTimes(song.duration * progress);

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
                        <TouchableOpacity onPress={() => navigation.goBack()} style={{
                            height: 32,
                            width: 32,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'transparent',
                        }}>
                            <Icon name="arrow-down" size={14} color="white" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                this.props.openModal([{
                                    title: 'Share',
                                    callback: () => {
                                        Share.share({
                                            title: `${song.user.username} - ${song.title}`,
                                            url: song.shareUrl,
                                        });
                                    }
                                }, {
                                    title: `${humanNumber(song.commentCount)} Comments`,
                                    callback: () => {
                                        navigation.navigate('Comments', {
                                            songid: song.id,
                                            count: song.commentCount,
                                        });
                                    }
                                }]);
                            }}
                            style={{
                                height: 32,
                                width: 32,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: 'transparent',
                            }}>
                            <Icon name="options" size={14} color="white" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView

                        ref="viewport"

                        horizontal={true}
                        showsHorizontalScrollIndicator={false}

                        onMomentumScrollEnd={e => {
                            var index = e.nativeEvent.contentOffset.x / width;

                            this.setState({
                                index
                            });
                        }}

                        decelerationRate={0}
                        snapToInterval={width}
                        snapToAlignment="start">

                        <View style={styles.viewport}>
                            <PlayList current={song} />
                        </View>

                        <View style={styles.viewport}>
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
                                                width: 96,
                                                height: 96,
                                            }
                                        }} />
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
                                        <Text style={styles.current}>{current.minutes}:{current.seconds}</Text>
                                        <Text style={styles.total}> / {times.minutes}:{times.seconds}</Text>
                                    </View>
                                </View>
                            </Image>

                            <Bar passed={progress} />
                        </View>
                    </ScrollView>
                </Image>

                <Controller />

                <View style={styles.dots}>
                    <View style={[styles.dot, this.state.index === 0 && styles.active]} />
                    <View style={[styles.dot, this.state.index === 1 && styles.active]} />
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

    viewport: {
        width,
        height,
    },

    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        width,
        height: 100,
        paddingLeft: 10,
        paddingRight: 10,
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
        height: 490,
        resizeMode: 'cover',
    },

    avatar: {
        marginLeft: 20,
        marginBottom: 40,
        height: 96,
        width: 96,
        borderRadius: 96,
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
        top: 330,
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
    },

    active: {
        backgroundColor: '#f50'
    }
});
