
import React, { Component, PropTypes } from 'react';
import { inject, observer } from 'mobx-react/native';
import {
    View,
    Text,
    Animated,
    Dimensions,
    StatusBar,
    StyleSheet,
} from 'react-native';

import Songs from './Songs';
import Nav from './Nav';
import Loader from '../../components/Loader';
import RippleHeader from '../../components/RippleHeader';
import { CHART_GENRES_MAP } from '../../config';

@inject(stores => ({
    home: stores.home,
    player: stores.player,
}))
@observer
export default class Home extends Component {

    static propTypes = {
        home: PropTypes.object.isRequired,
        player: PropTypes.object.isRequired,
    };

    async componentDidMount() {

        var { playlist, getPlaylist } = this.props.home;

        if (!playlist.length) {
            await getPlaylist();
        }
    }

    play(song) {

        this.props.navigation.navigate('Player');
        this.props.player.start({
            playlist: this.props.home.playlist,
            song,
        });

        for (var genre of CHART_GENRES_MAP) {
            genre.store && genre.store.setPlaying(false);
        }
    }

    render() {

        var player = this.props.player;
        var { playlist, loading, genre, changeGenre, doRefresh, showRefresh, doLoadmore, showLoadmore } = this.props.home;

        StatusBar.setNetworkActivityIndicatorVisible(loading);

        return (
            <View style={styles.container}>

                <RippleHeader></RippleHeader>

                <Nav {...{
                    genre,
                    changeGenre
                }}></Nav>

                {
                    loading
                        ? (
                            <Loader show={loading} animate={true} style4container={{
                                width,
                                top: 340,
                                transform: [{
                                    rotate: '0deg'
                                }],
                            }}></Loader>
                        )
                        : (
                            <View style={{
                                alignItems: 'center'
                            }}>
                                <View style={styles.title}>
                                    <Text>
                                        {playlist.length} &nbsp;
                                    </Text>

                                    <Text style={{
                                        color: 'rgba(0,0,0,.5)',
                                    }}>Tracks in Quene</Text>
                                </View>
                                <Songs {...{
                                    playlist: playlist.slice(),
                                    current: player.song,
                                    doRefresh,
                                    showRefresh,
                                    doLoadmore,
                                    showLoadmore,
                                    playing: player.playing,
                                    play: this.play.bind(this)
                                }}></Songs>
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
        backgroundColor: '#f1dfdd',
        alignItems: 'center',
    },

    title: {
        marginTop: 100,
        marginBottom: 10,
        flexDirection: 'row',
    },
});
