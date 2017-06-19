
import React, { Component, PropTypes } from 'react';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import { inject, observer } from 'mobx-react/native';
import {
    View,
    TouchableOpacity,
    Text,
    Dimensions,
    StyleSheet,
} from 'react-native';

import { PLAYER_MODE } from '../../config';
import { isFavorited, addFavorited, removeFavorited } from '../../utils/songUtil';

@inject(stores => {

    var { song, playlist, paused, toggle, next, prev, mode, changeMode } = stores.player;

    return {
        userid: stores.session.user.id,
        song,
        playlist,
        paused,
        toggle,
        next,
        prev,
        mode,
        changeMode,
        info: stores.info,
        error: stores.error,
    };
})
@observer
export default class Controller extends Component {

    state = {
        favorite: false,
    };

    async componentWillReceiveProps(nextProps) {

        if (this.props.song.id !== nextProps.song.id) {

            var favorite = await isFavorited({
                userid: this.props.userid,
                songid: nextProps.song.id,
            });

            this.setState({
                favorite,
            });
        }
    }

    async componentDidMount() {

        var favorite = await isFavorited({
            userid: this.props.userid,
            songid: this.props.song.id,
        });

        this.setState({
            favorite,
        });
    }

    handleFavorited() {

        var { id, title } = this.props.song;
        var { info, error } = this.props;
        var userid = this.props.userid;
        var favorite = this.state.favorite;

        if (!userid) {
            return error('Please Login');
        }

        if (favorite) {
            removeFavorited(userid, id);
            isFavorited({
                songid: id,
                value: false,
            });
            info(`Remove '${title}' from your collection`);
        } else {
            addFavorited(userid, id);
            isFavorited({
                songid: id,
                value: true,
            });
            info(`You're like '${title}'`);
        }

        this.setState({
            favorite: !favorite,
        });
    }

    render() {

        var { song, playing, paused, toggle, next, prev, mode, changeMode } = this.props;

        var favorite = this.state.favorite;

        return (
            <View style={styles.control}>

                <View style={styles.inline}>
                    <TouchableOpacity style={styles.transparent} onPress={changeMode}>
                        {
                            (mode === PLAYER_MODE[0])
                                ? <Icon name="loop" size={15} color="black"></Icon>
                                : <Icon name="shuffle" size={15} color="black"></Icon>
                        }
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.transparent} onPress={prev}>
                        <Icon name="control-start" size={15} color="black"></Icon>
                    </TouchableOpacity>
                </View>

                <View style={styles.play}>
                    <TouchableOpacity style={styles.transparent} onPress={toggle}>
                    {
                        !paused
                            ? <Icon name="control-pause" size={20} color="black"></Icon>
                            : <Icon name="control-play" size={20} color="black"></Icon>
                    }
                    </TouchableOpacity>
                </View>

                <View style={styles.inline}>
                    <TouchableOpacity style={styles.transparent} onPress={next}>
                        <Icon name="control-end" size={15} color="black"></Icon>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.transparent} onPress={this.handleFavorited.bind(this)}>
                        <Icon name="heart" size={15} style={favorite && {
                            color: 'red'
                        }}></Icon>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
    control: {
        position: 'absolute',
        bottom: 65,
        width,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 9
    },

    transparent: {
        height: 32,
        width: 32,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        margin: 12,
    },

    play: {
        height: 70,
        width: 70,
        borderRadius: 70,
        borderWidth: 1,
        borderColor: 'black',
        alignItems: 'center',
        justifyContent: 'center'
    },

    inline: {
        flexDirection: 'row',
    },
});
