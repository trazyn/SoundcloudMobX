
import React, { Component, PropTypes } from 'react';
import { inject, observer } from 'mobx-react/native';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import {
    View,
    Text,
    ListView,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Dimensions,
} from 'react-native';

import FadeImage from '../../components/FadeImage';
import Loader from '../../components/Loader';
import Followers from './Followers';
import Recent from './Recent';
import Liked from './Liked';
import Suggestion from './Suggestion';

@inject(stores => ({
    user: stores.session.user,
    followers: stores.profile.followers,
    getFollowers: stores.profile.getFollowers,
    recent: stores.profile.recent,
    getRecent: stores.profile.getRecent,
    loadMoreRecent: stores.profile.loadMoreRecent,
    likes: stores.profile.likes,
    getLikes: stores.profile.getLikes,
    loadMoreLikes: stores.profile.loadMoreLikes,
    suggestions: stores.profile.suggestions,
    getSuggestion: stores.profile.getSuggestion,
    loadMoreSuggestion: stores.profile.loadMoreSuggestion,
    showLoadMoreSuggestion: stores.profile.showLoadMoreSuggestion,

    setup: stores.list.setup,
    setRoute: stores.route.setRoute.bind(stores.route),
}))
@observer
export default class Profile extends Component {

    static propTypes = {
        user: PropTypes.object,
        followers: PropTypes.object.isRequired,
        getFollowers: PropTypes.func.isRequired,
        recent: PropTypes.object.isRequired,
        getRecent: PropTypes.func.isRequired,
        loadMoreRecent: PropTypes.func.isRequired,
        likes: PropTypes.object.isRequired,
        getLikes: PropTypes.func.isRequired,
        loadMoreLikes: PropTypes.func.isRequired,
        suggestions: PropTypes.object.isRequired,
        getSuggestion: PropTypes.func.isRequired,
        loadMoreSuggestion: PropTypes.func.isRequired,
        showLoadMoreSuggestion: PropTypes.bool.isRequired,

        setRoute: PropTypes.func.isRequired,
    };

    async componentWillMount() {

        this.props.getRecent();
        this.props.getFollowers(this.props.user.id);
        this.props.getLikes(this.props.user.id);
        this.props.getSuggestion();
    }

    componentWillReceiveProps(nextProps) {
        StatusBar.setNetworkActivityIndicatorVisible(nextProps.showLoadMoreSuggestion);
    }

    renderHeader() {

        var { user, followers, recent, likes } = this.props;

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
                    }}></View>

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
                            }}></FadeImage>
                        </View>

                        <View style={{
                            height: 100,
                            justifyContent: 'space-between',
                        }}>
                            <View>
                                <Text style={styles.username}>{user.username}</Text>
                                <Text style={styles.desc} numberOfLines={1} ellipsizeMode="tail">{user.description}</Text>
                            </View>

                            <Followers users={followers.slice()} count={user.followers_count}></Followers>
                        </View>
                    </View>

                    <TouchableOpacity style={{
                        height: 24,
                        width: 24,
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                    }}>
                        <Icon name="options-vertical" size={18} color="white" style={{
                            backgroundColor: 'transparent',
                        }}></Icon>
                    </TouchableOpacity>
                </FadeImage>

                <Recent tracks={recent.slice(0, 3)} showList={e => {

                    var { getRecent, loadMoreRecent } = this.props;

                    this.props.setup({
                        data: recent,
                        title: 'RECENTLY PLAYED',
                        actions: {
                            refresh: getRecent,
                            loadmore: loadMoreRecent,
                        }
                    });
                    this.props.setRoute({
                        name: 'List',
                    });
                }}></Recent>
                <Liked tracks={likes.slice()} showList={e => {

                    var { getLikes, user, loadMoreLikes } = this.props;

                    this.props.setup({
                        data: likes,
                        title: 'YOU\'VE LIKED',
                        actions: {
                            refresh: () => this.props.getLikes(user.id),
                            loadmore: this.props.loadMoreLikes,
                        }
                    });
                    this.props.setRoute({
                        name: 'List',
                    });
                }}></Liked>
            </View>
        );
    }

    render() {
        var { user, recent, suggestions } = this.props;
        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1.seed_sound.id !== r2.seed_sound.id
        });
        var dataSource = ds.cloneWithRows(suggestions.slice());

        return (
            (user && recent.length) ? (
                <ListView

                renderHeader={this.renderHeader.bind(this)}

                initialListSize={1}
                onEndReachedThreshold={1}
                pageSize={1}
                onEndReached={() => {
                    suggestions.length && this.props.loadMoreSuggestion();
                }}

                enableEmptySections={true}
                dataSource={dataSource}
                renderRow={(collection, sectionId, rowId) => {

                    return (
                        <View style={styles.suggestions}>
                            <Suggestion seed={collection.seed_sound} tracks={collection.recommended.slice()}></Suggestion>
                        </View>
                    );
                }}
                style={styles.container}>
                </ListView>
            ) : (
                <View style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width,
                    height: height - 150,
                    backgroundColor: 'rgba(255,255,255,.9)',
                    zIndex: 99
                }}>
                    <Loader {...{
                        show: true,
                        animate: true,
                        text: 'LOADING',
                        style4container: {
                            top: 340,
                            width,
                            transform: [{
                                rotate: '0deg'
                            }]
                        }
                    }}></Loader>
                </View>
            )
        );
    }
}

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        flex: 1,
        shadowColor: "#000",
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
    },

    desc: {
        marginTop: 10,
        fontSize: 12,
        fontWeight: '100',
        color: '#fff',
    },

    suggestions: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});
