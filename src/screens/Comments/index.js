
import React, { Component, PropTypes } from 'react';
import { inject, observer } from 'mobx-react/native';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import moment from 'moment';
import {
    View,
    Text,
    ListView,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Dimensions,
} from 'react-native';

import humanNumber from '../../utils/humanNumber';
import numberFormat from '../../utils/numberFormat';
import Loader from '../../components/Loader';
import FadeImage from '../../components/FadeImage';

@inject(stores => ({

    list: stores.comments.list.slice(),
    getList: stores.comments.getList,
    loadMore: stores.comments.loadMore,
    hasNext: stores.comments.hasNext,
    loading: stores.comments.loading,
    loading4loadmore: stores.comments.loading4loadmore,
}))
@observer
export default class Comments extends Component {

    state = {
        count: 0,
    };

    componentWillMount() {
        this.props.getList(this.props.navigation.state.params.songid);
    }

    componentDidMount() {
        StatusBar.setHidden(true);
    }

    componentWillUnmount() {
        StatusBar.setHidden(false);
    }

    componentDidMount() {
        this.setState({
            count: this.props.navigation.state.params.count,
        });
    }

    render() {

        var { list, hasNext, loading, loading4loadmore } = this.props;
        var count = this.state.count;
        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1.id !== r2.id
        });
        var dataSource = ds.cloneWithRows(list);

        return (

            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                    onPress={() => this.props.navigation.goBack()}
                    style={styles.icon}>
                        <Icon name="arrow-down" size={14} color="#000"></Icon>
                    </TouchableOpacity>
                    <Text style={styles.title}>
                        {humanNumber(count)} COMMENTS
                    </Text>
                    <TouchableOpacity
                    onPress={() => {
                        this.props.navigation.navigate('Reply');
                    }}
                    style={styles.icon}>
                        <Icon name="note" size={14} color="#000"></Icon>
                    </TouchableOpacity>
                </View>

                <ListView

                style={styles.comments}

                onEndReachedThreshold={1}
                onEndReached={() => {
                    hasNext && list.length >= 20 && this.props.loadMore();
                }}

                enableEmptySections={true}
                dataSource={dataSource}
                renderRow={(comment, sectionId, rowId) => {

                    var user = comment.user;
                    var index = list.indexOf(comment);

                    console.log(user.avatar_url);

                    return (
                        <View>
                            <View style={styles.comment}>

                                <View style={styles.avatar}>
                                    <FadeImage {...{
                                        style: {
                                            height: 40,
                                            width: 40,
                                        },
                                        source: {
                                            uri: user.avatar_url,
                                        },
                                    }}></FadeImage>
                                </View>

                                <View style={styles.content}>
                                    <View style={{
                                        flexDirection: 'row',
                                        marginBottom: 8,
                                    }}>
                                        <Text style={styles.username} ellipsizeMode="tail">{user.username}</Text>
                                        <Text style={styles.dot}>&middot;</Text>
                                        <Text style={styles.date}>{moment(comment.created_at, 'YYYY/MM/DD hh:mm:ss').fromNow()}</Text>
                                    </View>

                                    <Text style={styles.body}>{comment.body}</Text>
                                </View>

                            </View>

                            {
                                (!hasNext && index === list.length - 1) && (
                                    <View style={styles.tail}>
                                        <View style={styles.line}></View>
                                        <Text style={styles.end}>{numberFormat(count)}</Text>
                                        <Text style={{
                                            marginRight: 4,
                                            marginLeft: 4,
                                            fontWeight: '800',
                                            color: 'rgba(0,0,0,.8)',
                                        }}>&middot;</Text>
                                        <Text style={styles.end}>End</Text>
                                        <View style={styles.line}></View>
                                    </View>
                                )
                            }
                        </View>
                    );
                }}
                ></ListView>

                {
                    (loading || loading4loadmore) && (
                        <View style={{
                            position: 'absolute',
                            top: 80,
                            left: 0,
                            width,
                            height: height - 80,
                            backgroundColor: 'rgba(255,255,255,.9)',
                            zIndex: 99
                        }}>
                            <Loader {...{
                                show: true,
                                animate: true,
                                text: loading ? 'LOADING' : 'LOAD MORE',
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

const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    header: {
        height: 80,
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    icon: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },

    title: {
        fontFamily: 'Georgia',
        fontWeight: '400',
        fontSize: 15,
    },

    comment: {
        flexDirection: 'row',
        margin: 15,
        marginLeft: 35,
        marginRight: 20,
        marginBottom: 20,
    },

    avatar: {
        height: 40,
        width: 40,
        borderRadius: 40,
        overflow: 'hidden',
    },

    content: {
        paddingLeft: 20,
    },

    username: {
        maxWidth: 180,
        fontFamily: 'Menlo-Regular',
        fontWeight: '400',
        fontSize: 12,
    },

    dot: {
        marginRight: 8,
        marginLeft: 8,
        color: '#777',
        fontWeight: '800',
    },

    date: {
        fontFamily: 'Georgia',
        fontSize: 12,
        color: '#777',
    },

    body: {
        fontFamily: 'Georgia',
        color: '#777',
        fontSize: 13,
        paddingRight: 40,
    },

    line: {
        height: .5,
        width: 40,
        marginLeft: 8,
        marginRight: 8,
        backgroundColor: 'rgba(0,0,0,.8)',
    },

    end: {
        fontFamily: 'Georgia',
        color: 'rgba(0,0,0,.8)',
    },

    tail: {
        width,
        height: 20,
        marginTop: 20,
        marginBottom: 30,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

