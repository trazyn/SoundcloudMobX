
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
import Loader from '../../components/Loader';

export default class Songs extends Component {

    static propTypes = {
        playlist: PropTypes.array.isRequired,
        showRefresh: PropTypes.bool.isRequired,
        doRefresh: PropTypes.func.isRequired,
        showLoadmore: PropTypes.bool.isRequired,
        doLoadmore: PropTypes.func.isRequired,
        play: PropTypes.func.isRequired,
        current: PropTypes.object.isRequired,
        playing: PropTypes.bool.isRequired,
    };

    state = {
        opacity: new Animated.Value(0)
    };

    render() {

        var { playlist, doRefresh, showRefresh, doLoadmore, showLoadmore, play } = this.props;
        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1.id !== r2.id
        });
        var dataSource = ds.cloneWithRows(playlist);
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
                        InteractionManager.runAfterInteractions(() => doRefresh());
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
                    var playing = this.props.current.id === song.id && this.props.playing;

                    return (
                        <Song {...{

                            ...song,
                            playing,
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
