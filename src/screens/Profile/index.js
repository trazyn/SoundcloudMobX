
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import { inject, observer } from 'mobx-react/native';
import {
    View,
    Text,
    ListView,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Dimensions,
    Linking,
} from 'react-native';

import FadeImage from '../../components/FadeImage';
import Followers from './Followers';
import Recent from './Recent';
import Liked from './Liked';
import Suggestion from './Suggestion';

@inject(stores => ({
    user: stores.session.user,
    loading: stores.profile.loading4suggestion,
    list: stores.profile.suggestions.slice(),
    getList: stores.profile.getSuggestion,
    loadMore: stores.profile.loadMoreSuggestion,
    play: stores.player.start,
    openModal: stores.openModal,
    openHomePage: () => {
        Linking.openURL(stores.session.user.permalink_url);
    },
    logout: stores.session.logout,
}))
@observer
export default class Profile extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
    };

    componentWillMount() {
        this.props.getList();
    }

    componentWillReceiveProps(nextProps) {
        StatusBar.setNetworkActivityIndicatorVisible(nextProps.loading);
    }

    renderHeader() {
        var { user } = this.props;

        return (
            <View style={{
                flex: 1,
            }}>
                <FadeImage style={styles.hero} {...{
                    source: {
                        uri: 'https://i1.sndcdn.com/visuals-000211846129-GwVlC8-t1240x260.jpg',
                    },
                    resizeMode: 'cover',
                }}>
                    <View style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width,
                        height: 210,
                        backgroundColor: 'rgba(0,0,0,.4)',
                    }} />

                    <View style={{
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                    }}>
                        <View style={styles.avatar}>
                            <FadeImage {...{
                                source: {
                                    uri: user.avatar_url.replace(/-large\./, '-t300x300.')
                                },
                                style: {
                                    height: 100,
                                    width: 100,
                                }
                            }} />
                        </View>

                        <View style={{
                            height: 100,
                            justifyContent: 'space-between',
                        }}>
                            <View>
                                <Text style={styles.username}>{user.username}</Text>
                                <Text style={styles.desc} numberOfLines={1} ellipsizeMode="tail">{user.description}</Text>
                            </View>

                            <Followers />
                        </View>
                    </View>

                    <TouchableOpacity
                        style={{
                            height: 24,
                            width: 24,
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                        }}
                        onPress={() => {
                            this.props.openModal([{
                                title: 'Logout',
                                callback: () => {
                                    this.props.logout();
                                    this.props.navigation.navigate('Home');
                                },
                            }, {
                                title: 'View Home Page',
                                callback: this.props.openHomePage,
                            }]);
                        }}>
                        <Icon name="options-vertical" size={18} color="white" style={{
                            backgroundColor: 'transparent',
                        }} />
                    </TouchableOpacity>
                </FadeImage>

                <Recent showList={e => this.props.navigation.navigate('RecentPlaylist')} />
                <Liked showList={e => this.props.navigation.navigate('LikedPlaylist')} />
            </View>
        );
    }

    render() {
        var { list } = this.props;
        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1.seed_sound.id !== r2.seed_sound.id
        });
        var dataSource = ds.cloneWithRows(list);

        return (
            <ListView
                renderHeader={() => this.renderHeader()}

                initialListSize={1}
                onEndReachedThreshold={1}
                pageSize={1}
                onEndReached={() => {
                    list.length && this.props.loadMore();
                }}

                onScroll={(e) => {
                    var currentOffset = e.nativeEvent.contentOffset.y;
                    var direction = currentOffset - this.offset;

                    this.offset = currentOffset;

                    if (currentOffset <= 0) {
                        StatusBar.setHidden(false, true);
                    } else {
                        direction !== 0 && StatusBar.setHidden(direction > 0, true);
                    }
                }}

                enableEmptySections={true}
                dataSource={dataSource}
                renderRow={(collection, sectionId, rowId) => {
                    var seed = collection.seed_sound;
                    var tracks = collection.recommended;

                    return (
                        <View style={styles.suggestions}>
                            <Suggestion {...{
                                play: (song) => {
                                    tracks.uuid = seed.id;
                                    this.props.play({
                                        song,
                                        playlist: tracks,
                                    });
                                    this.props.navigation.navigate('Player');
                                },
                                seed,
                                tracks: tracks.slice(),
                            }} />
                        </View>
                    );
                }}
                style={styles.container} />
        );
    }
}

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        flex: 1,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 12,
        shadowOffset: {
            height: 2,
        }
    },

    hero: {
        width,
        height: 210,
        paddingLeft: 20,
        paddingRight: 20,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },

    avatar: {
        height: 100,
        width: 100,
        borderRadius: 100,
        marginRight: 30,
        overflow: 'hidden',
    },

    username: {
        fontSize: 18,
        fontWeight: '100',
        color: '#fff',
        backgroundColor: 'transparent',
    },

    desc: {
        marginTop: 10,
        fontSize: 12,
        fontWeight: '100',
        color: '#fff',
        backgroundColor: 'transparent',
    },

    suggestions: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});
