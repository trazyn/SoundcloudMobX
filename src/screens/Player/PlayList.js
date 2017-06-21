
import React, { Component, PropTypes } from 'react';
import { inject, observer } from 'mobx-react/native';
import {
    View,
    Text,
    ListView,
    StyleSheet,
    TouchableOpacity,
    Image,
} from 'react-native';
import parseTimes from '../../utils/parseTimes';

@inject(stores => ({
    list: stores.player.playlist.slice(),
    play: stores.player.start,
}))
@observer
export default class PlayList extends Component {
    static propTypes = {
        current: PropTypes.object.isRequired,
    };

    offset = {};

    human(number) {
        if (number > 1000) {
            return (number / 1000).toFixed(2) + 'K';
        }

        return number;
    }

    highlight(offset) {
        var container = this.refs.container;
        var activeOffset = this.offset[this.props.current.id];

        if (container && activeOffset) {
            offset = offset === void 0 ? activeOffset.y : offset;

            if (this.contentHeight - offset < this.scrollViewHeight) {
                offset = this.contentHeight - this.scrollViewHeight;
            }

            container.scrollTo({
                y: offset,
                animated: false
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        var offset = this.offset[nextProps.current.id];

        if (nextProps.current.id !== this.props.current.id && offset) {
            this.highlight(offset.y);
        }
    }

    render() {
        var { list, current = {} } = this.props;
        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1.id !== r2.id
        });
        var index = list.findIndex(e => e.id === current.id);
        var dataSource = ds.cloneWithRows(list.slice());

        return (
            <ListView

                ref="container"

                initialListSize={index + 1}
                removeClippedSubviews={true}
                onContentSizeChange={(w, h) => (this.contentHeight = h)}
                onLayout={(e) => (this.scrollViewHeight = e.nativeEvent.layout.height)}

                style={[styles.container, this.props.style]}
                enableEmptySections={true}
                dataSource={dataSource}
                renderRow={song => {
                    var active = song.id === current.id;
                    var times = parseTimes(song.duration);

                    return (
                        <TouchableOpacity
                            style={styles.item}
                            onLayout={e => {
                                this.offset[song.id] = e.nativeEvent.layout;
                            }}
                            onPress={e => {
                                this.props.play({ song });
                            }}
                            ref="items">
                            <View>
                                <View>
                                    <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.title, active && styles.active]}>{song.title}</Text>
                                </View>
                                <View style={styles.meta}>
                                    <View style={styles.avatar}>
                                        <Image {...{
                                            source: {
                                                uri: song.user.avatar_url
                                            },

                                            style: {
                                                width: 24,
                                                height: 24,
                                            }
                                        }} />
                                    </View>

                                    <Text style={[styles.username, active && styles.active]}>{song.user.username}</Text>

                                    <View style={styles.right}>
                                        <Text style={[styles.duration, active && styles.active]}>{times.minutes}:{times.seconds}</Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                }} />
        );
    }
}

const styles = StyleSheet.create({

    container: {
        marginTop: 70,
        marginBottom: 140,
        overflow: 'hidden'
    },

    item: {
        height: 58,
        margin: 10,
        marginLeft: 10,
        marginRight: 10,
        borderBottomWidth: .5,
        borderBottomColor: 'rgba(0,0,0,.1)',
        backgroundColor: 'transparent',
    },

    right: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        flexDirection: 'row'
    },

    title: {
        color: 'rgba(255,255,255,.7)'
    },

    duration: {
        fontSize: 11,
        fontWeight: '100',
        color: 'rgba(0,0,0,.2)'
    },

    username: {
        marginTop: 10,
        marginBottom: 10,
        fontSize: 11,
        color: 'rgba(0,0,0,.2)'
    },

    avatar: {
        marginRight: 6,
        height: 20,
        width: 20,
        borderRadius: 20,
        overflow: 'hidden',
    },

    meta: {
        alignItems: 'center',
        flexDirection: 'row'
    },

    active: {
        color: '#f50'
    },

    text: {
        marginLeft: 4,
        marginRight: 15,
        fontSize: 11,
        color: 'rgba(255,255,255,.5)'
    }
});
