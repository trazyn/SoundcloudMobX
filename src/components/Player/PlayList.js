
import React, { Component, PropTypes } from 'react';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import {
    View,
    Text,
    ListView,
    StyleSheet,
    Dimensions,
    InteractionManager,
    Image,
} from 'react-native';

export default class PlayList extends Component {

    static propTypes = {
        list: PropTypes.array.isRequired,
        current: PropTypes.object.isRequired,
    };

    human(number) {

        if (number > 1000) {
            return (number / 1000).toFixed(2) + 'K';
        }

        return number;
    }

    getActivePosition(layout) {
        this.activePosition = layout.y;
    }

    highlight() {

        var self = this;

        InteractionManager.runAfterInteractions(() => {

            var offset = self.activePosition;

            if (self.contentHeight - offset < self.scrollViewHeight) {
                offset = self.contentHeight - self.scrollViewHeight;
            }

            self.refs.container.scrollTo({
                y: offset,
                animated: false
            });
        });
    }

    componentDidMount = this.highlight.bind(this);

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
            onContentSizeChange={(w, h) => this.contentHeight = h}
            onLayout={(e) => this.scrollViewHeight = e.nativeEvent.layout.height}

            style={styles.container}
            enableEmptySections={true}
            dataSource={dataSource}
            renderRow={song => {

                var active = song.id === current.id;

                return (
                    <View style={styles.item} onLayout={(e) => active && this.getActivePosition(e.nativeEvent.layout)} ref="items">
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
                                }}></Image>
                                </View>
                            <Text style={[styles.username, active && styles.active]}>{song.user.username}</Text>

                            <View style={styles.right}>
                                <Icon name="heart" size={12} style={active && styles.active} color="rgba(255,255,255,.5)"></Icon>
                                <Text style={[styles.text, active && styles.active]}>{this.human(song.likes_count)}</Text>

                                <Icon name="bubble" style={active && styles.active} size={12} color="rgba(255,255,255,.5)"></Icon>
                                <Text style={[styles.text, active && styles.active]}>{this.human(song.comment_count)}</Text>
                            </View>
                        </View>
                    </View>
                );
            }}>
            </ListView>
        );
    }
}

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({

    container: {
        marginTop: 70,
        marginBottom: 140,
        overflow: 'hidden'
    },

    item: {
        height: 58,
        margin: 10,
        marginLeft: 20,
        marginRight: 20,
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
