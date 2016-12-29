
import React, { Component, PropTypes } from 'react';
import { inject, observer } from 'mobx-react/native';
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    ActivityIndicator,
    ScrollView,
    ListView,
    StyleSheet,
} from 'react-native';

import Songs from './Songs';
import Nav from './Nav';

@inject(stores => ({
    songs: stores.playlist.songs,
    getSongs: stores.playlist.getSongs,
    loading: stores.playlist.loading,
    genre: stores.playlist.genre,
    changeGenre: stores.playlist.changeGenre,
}))
@observer
export default class Home extends Component {

    static propTypes = {
        songs: PropTypes.object.isRequired,
        getSongs: PropTypes.func.isRequired,
        loading: PropTypes.bool.isRequired,
        genre: PropTypes.string.isRequired,
        changeGenre: PropTypes.func.isRequired,
    };

    async componentDidMount() {
        await this.props.getSongs();
        console.log(this.props.songs);
    }

    render() {

        const { songs, loading, genre, changeGenre } = this.props;

        StatusBar.setNetworkActivityIndicatorVisible(loading);

        return (
            <View style={styles.container}>

                <Nav {...{
                    genre,
                    changeGenre
                }}></Nav>

                {
                    loading
                        ? (<ActivityIndicator style={styles.loading} size="small" animating={loading}></ActivityIndicator>)
                        : (
                            <View style={{
                                alignItems: 'center'
                            }}>
                                <View style={styles.title}>
                                    <Text style={{
                                        fontWeight: 'bold'
                                    }}>
                                        {songs.length} &nbsp;
                                    </Text>

                                    <Text style={{
                                        color: 'rgba(0,0,0,.5)',
                                    }}>Popular Music</Text>
                                </View>
                                <Songs list={songs}></Songs>
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
        flexDirection: 'row',
    },

    loading: {
        position: 'absolute',
        top: 340,
        width,
        alignItems: 'center',
        zIndex: 9
    }
});
