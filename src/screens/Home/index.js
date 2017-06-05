
import React, { Component, PropTypes } from 'react';
import { inject, observer } from 'mobx-react/native';
import {
    View,
    Text,
    Animated,
    Dimensions,
    StatusBar,
    InteractionManager,
    StyleSheet,
} from 'react-native';

import Songs from './Songs';
import Nav from './Nav';
import Loader from '../../components/Loader';
import RippleHeader from '../../components/RippleHeader';
import { CHART_GENRES_MAP } from '../../config';

@inject(stores => ({
    songs: stores.home.songs,
    getSongs: stores.home.getSongs,
    loading: stores.home.loading,
    genre: stores.home.genre,
    changeGenre: stores.home.changeGenre,
    showRefresh: stores.home.showRefresh,
    doRefresh: stores.home.doRefresh,
    showLoadmore: stores.home.showLoadmore,
    doLoadmore: stores.home.doLoadmore,

    player: stores.player,

    navigation: stores.navigation,
}))
@observer
export default class Home extends Component {

    static propTypes = {
        songs: PropTypes.object.isRequired,
        getSongs: PropTypes.func.isRequired,
        loading: PropTypes.bool.isRequired,
        genre: PropTypes.string.isRequired,
        changeGenre: PropTypes.func.isRequired,
        showRefresh: PropTypes.bool.isRequired,
        doRefresh: PropTypes.func.isRequired,
        showLoadmore: PropTypes.bool.isRequired,
        doLoadmore: PropTypes.func.isRequired,

        player: PropTypes.object.isRequired,

        navigation: PropTypes.object.isRequired,
    };

    async componentDidMount() {

        if (!this.props.songs.length) {
            await this.props.getSongs();
        }
    }

    play(song) {

        this.props.navigation.navigate('Player');

        this.props.player.setup({
            playlist: this.props.songs.slice(),
            song,
        });

        this.props.player.start();

        for (var genre of CHART_GENRES_MAP) {
            genre.store && genre.store.setPlaying(false);
        }
    }

    render() {

        var { songs, loading, genre, changeGenre, doRefresh, showRefresh, doLoadmore, showLoadmore, player } = this.props;

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
                                        {songs.length} &nbsp;
                                    </Text>

                                    <Text style={{
                                        color: 'rgba(0,0,0,.5)',
                                    }}>Tracks in Quene</Text>
                                </View>
                                <Songs {...{
                                    list: songs,
                                    current: player.song,
                                    doRefresh,
                                    showRefresh,
                                    doLoadmore,
                                    showLoadmore,

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
