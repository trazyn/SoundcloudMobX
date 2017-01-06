
import React, { Component, PropTypes } from 'react';
import { inject, observer } from 'mobx-react/native';
import {
    View,
    Text,
    Dimensions,
    StatusBar,
    StyleSheet,
} from 'react-native';

import Songs from './Songs';
import Nav from './Nav';
import Loader from '../../components/Loader';

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

    setRoute: stores.route.setRoute.bind(stores.route),
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

        setRoute: PropTypes.func.isRequired,
    };

    async componentDidMount() {
        await this.props.getSongs();
    }

    play(song) {

        this.props.setRoute({
            name: 'Player',
            song,
            playlist: this.props.songs
        });
    }

    render() {

        const { songs, loading, genre, changeGenre, doRefresh, showRefresh, doLoadmore, showLoadmore } = this.props;

        StatusBar.setNetworkActivityIndicatorVisible(loading);

        return (
            <View style={styles.container}>

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
                                    }}>Popular Music</Text>
                                </View>
                                <Songs {...{
                                    list: songs,
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
        backgroundColor: '#fff',
        alignItems: 'center',
    },

    title: {
        marginTop: 100,
        marginBottom: 10,
        flexDirection: 'row',
    },
});
