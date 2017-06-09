
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

@inject(stores => {

    var { playlist, getPlaylist, loading } = stores.home;

    return {
        playlist,
        getPlaylist,
        loading,
        play: stores.player.start,
        playing: stores.player.playing,
    };
})
@observer
export default class Home extends Component {

    async componentDidMount() {

        console.log('HOME');

        var { playlist, getPlaylist } = this.props;

        if (!playlist.length) {
            await getPlaylist();
        }
    }

    play(song) {

        this.props.navigation.navigate('Player');

        for (var genre of CHART_GENRES_MAP) {
            genre.store && genre.store.setPlaying(false);
        }

        this.props.play({
            playlist: this.props.playlist,
            song,
        });
    }

    render() {

        var loading = this.props.loading;

        StatusBar.setNetworkActivityIndicatorVisible(loading);

        return (
            <View style={styles.container}>
                <Nav></Nav>
                {
                    this.props.playing && (<RippleHeader></RippleHeader>)
                }
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
                                        {this.props.playlist.length} &nbsp;
                                    </Text>

                                    <Text style={{
                                        color: 'rgba(0,0,0,.5)',
                                    }}>Tracks in Quene</Text>
                                </View>
                                <Songs {...{
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
