
import React, { Component, PropTypes } from 'react';
import { inject, observer } from 'mobx-react/native';
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
} from 'react-native';

import FadeImage from '../../components/FadeImage';

@inject(stores => ({
    list: stores.profile.liked,
    getList: () => {
        stores.profile.getLiked(stores.session.user.id);
    },
    isPlaying: () => {

        var uuid4player = stores.player.playlist.uuid;
        var uuid = stores.profile.liked.uuid;

        return uuid4player
            && uuid
            && uuid === uuid4player;
    },
}))
@observer
export default class Liked extends Component {

    static propTypes = {
        showList: PropTypes.func.isRequired,
    };

    componentWillMount() {
        this.props.getList();
    }

    covers(tracks) {

        return tracks.slice().map((track, index) => {

            return (
                <FadeImage key={index} {...{
                    source: {
                        uri: track.artwork
                    },
                    style: {
                        height: 83.75,
                        width: 83.75,
                    }
                }}></FadeImage>
            );
        });
    }

    render() {

        var { list } = this.props;
        var playing = this.props.isPlaying();

        return (
            <TouchableOpacity style={styles.container} onPress={this.props.showList}>
                <View style={{
                    height: 83.75,
                    width: 335,
                    flexDirection: 'row',
                }}>
                {
                    this.covers(list.slice(0, 4))
                }
                </View>
                <View style={{
                    height: 83.75,
                    width: 335,
                    flexDirection: 'row',
                }}>
                {
                    this.covers(list.slice(4, 8))
                }
                </View>

                <View style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width,
                    height: 167,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <View style={styles.overlay}>
                        <Text style={[{
                            color: '#fff',
                            fontSize: 18,
                            fontWeight: '100',
                        }, playing && styles.playing]}>LIKED SONGS</Text>

                        <View style={{
                            marginTop: 40,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <View style={[styles.line, playing && { backgroundColor: '#f50' }]}></View>
                                <Text style={[styles.count, playing && styles.playing]}>{
                                    list.length > 99 ? '99+' : list.length
                                } Songs In Collection</Text>
                            <View style={[styles.line, playing && { backgroundColor: '#f50' }]}></View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        marginTop: 40,
        width,
        height: 167,
        alignItems: 'center',
        justifyContent: 'center',
    },

    overlay: {
        height: 167,
        width: 335,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,.6)',
        shadowOpacity: 0.3,
        shadowRadius: 12,
    },

    line: {
        height: .5,
        width: 40,
        backgroundColor: '#fff',
    },

    count: {
        marginLeft: 10,
        marginRight: 10,
        fontSize: 14,
        fontWeight: '100',
        color: '#fff',
    },

    playing: {
        color: '#f50',
    },
});
