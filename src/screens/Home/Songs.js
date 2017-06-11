
import React, { Component, PropTypes } from 'react';
import { inject, observer } from 'mobx-react/native';
import {
    ListView,
    StyleSheet,
    Text,
    View,
    Dimensions,
    Animated,
    TouchableOpacity,
} from 'react-native';

import Loader from '../../components/Loader';
import Song from './Song';

@inject(stores => {

    var { playlist, doRefresh, showRefresh, doLoadmore, showLoadmore } = stores.home;

    return {
        playlist,
        doRefresh,
        showLoadmore,
        doLoadmore,
        showLoadmore,
        updatePlaylist: (playlist) => {

            var player = stores.player;

            /** When load more update the playlist of player */
            if (playlist.uuid === player.playlist.uuid
                && playlist.length > player.playlist.length) {
                player.updatePlaylist(playlist.slice());
            }
        }
    };
})
@observer
export default class Songs extends Component {

    static propTypes = {
        play: PropTypes.func.isRequired,
    };

    state = {
        opacity: new Animated.Value(0)
    };

    componentWillReceiveProps(nextProps) {
        this.props.updatePlaylist(this.props.playlist);
    }

    render() {

        var { playlist, doRefresh, showRefresh, doLoadmore, showLoadmore, play } = this.props;
        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1.id !== r2.id
        });
        var dataSource = ds.cloneWithRows(playlist.slice());
        var opacity = this.state.opacity.interpolate({
            inputRange: [-30, -5],
            outputRange: [1, 0],
        });

        if (showRefresh) {
            opacity = 1;
        }

        return (
            <View>

                <Loader {...{
                    show: true,
                    animate: showRefresh,
                    text: 'REFRESH',
                    style4container: {
                        left: -40,
                        opacity,
                    }
                }}></Loader>

                {
                    showLoadmore && (
                        <View style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width,
                            height,
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

                <ListView

                onScrollEndDrag={e => {

                    if (e.nativeEvent.contentOffset.x < -30) {
                        setTimeout(doRefresh);
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

                automaticallyAdjustContentInsets={false}
                onEndReachedThreshold={1}
                onEndReached={doLoadmore}

                enableEmptySections={true}
                dataSource={dataSource}
                renderRow={song => {

                    var index = playlist.findIndex(e => e.id === song.id);
                    return (
                        <Song {...{

                            ...song,
                            play,

                            style: [(index === playlist.length - 1 && styles.pad), {
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
});
