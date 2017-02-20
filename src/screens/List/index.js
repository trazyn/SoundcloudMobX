
import React, { Component, PropTypes } from 'react';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import { inject, observer } from 'mobx-react/native';
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    Animated,
    ListView,
    StyleSheet,
} from 'react-native';

import RippleHeader from '../../components/RippleHeader';
import FadeImage from '../../components/FadeImage';
import Loader from '../../components/Loader';

@inject(stores => ({
    data: stores.list.data,
    title: stores.list.title,
    showRefresh: stores.list.showRefresh,
    showLoadmore: stores.list.showLoadmore,
    doRefresh: stores.list.doRefresh,
    doLoadmore: stores.list.doLoadmore,
}))
@observer
export default class List extends Component {

    static propTypes = {
        title: PropTypes.string.isRequired,
        data: PropTypes.object.isRequired,
        doRefresh: PropTypes.func.isRequired,
        doLoadmore: PropTypes.func.isRequired,
        showRefresh: PropTypes.bool.isRequired,
        showLoadmore: PropTypes.bool.isRequired,
    };

    state = {
        opacity: new Animated.Value(0),
    };

    componentDidMount() {
        this.refs.list.scrollTo({
            y: 0,
        });
    }

    render() {

        var { title, showRefresh, doRefresh, doLoadmore, showLoadmore } = this.props;
        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1.id !== r2.id
        });
        var dataSource = ds.cloneWithRows(this.props.data.slice());
        var opacity = this.state.opacity.interpolate({
            inputRange: [-40, -10],
            outputRange: [1, 0],
        });

        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => this.props.navigator.pop()} style={styles.backward}>
                        <Icon name="arrow-left" color="black" size={14}></Icon>
                    </TouchableOpacity>

                    <Text style={styles.title}>{title}</Text>
                </View>

                <Loader {...{
                    show: true,
                    animate: showRefresh,
                    text: 'REFRESH',
                    style4container: {
                        top: 75,
                        width,
                        opacity: showRefresh ? 1 : opacity,
                        transform: [{
                            rotate: '0deg'
                        }],
                    }
                }}></Loader>

                <ListView

                ref="list"

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

                onScrollEndDrag={e => {

                    if (e.nativeEvent.contentOffset.y < -40) {
                        doRefresh();
                    }
                }}

                onEndReachedThreshold={1}
                onEndReached={doLoadmore}

                enableEmptySections={true}
                dataSource={dataSource}
                renderRow={track => {

                    return (
                        <TouchableOpacity style={styles.item}>
                            <View style={{
                                flexDirection: 'row',
                            }}>
                                <FadeImage {...{
                                    source: {
                                        uri: track.artwork,
                                    },

                                    style: {
                                        height: 50,
                                        width: 50,
                                        marginRight: 10,
                                    }
                                }}></FadeImage>

                                <View style={styles.info}>
                                    <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">{track.title}</Text>
                                    <Text style={styles.username} numberOfLines={1} ellipsizeMode="tail">{track.user.username}</Text>
                                </View>
                            </View>

                            <TouchableOpacity>
                                <Icon name="options" size={12} color="#f50" style={{
                                    backgroundColor: 'transparent',
                                }}></Icon>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    );
                }}

                style={[styles.list, showRefresh && {
                    paddingTop: 25,
                }]}>
                </ListView>

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
                                    marginTop: 53,
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
        paddingBottom: 15,
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

    backward: {
        position: 'absolute',
        left: 20,
        bottom: 15,
    },

    list: {
        paddingTop: 10,
        paddingLeft: 20,
        paddingRight: 20,
    },

    item: {
        height: 70,
        width: 335,
        padding: 10,
        borderBottomWidth: .5,
        borderBottomColor: 'rgba(0,0,0,.3)',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    info: {
        justifyContent: 'space-between',
    },

    title: {
        fontWeight: '100',
        maxWidth: 220,
        letterSpacing: 1,
        backgroundColor: 'transparent',
    },

    username: {
        fontSize: 12,
        fontWeight: '100',
        color: '#9B9B9B',
        maxWidth: 220,
        backgroundColor: 'transparent',
    },
});
