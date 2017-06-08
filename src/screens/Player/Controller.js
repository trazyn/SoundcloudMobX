
import React, { Component, PropTypes } from 'react';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import {
    View,
    TouchableOpacity,
    Text,
    Dimensions,
    StyleSheet,
} from 'react-native';

import { PLAYER_MODE } from '../../config';
import { isFavorited, addFavorited, removeFavorited } from '../../utils/songUtil';

export default class Controller extends Component {

    static propTypes = {
        userid: PropTypes.number,
        message: PropTypes.object.isRequired,
        song: PropTypes.object.isRequired,
        playlist: PropTypes.object.isRequired,
        paused: PropTypes.bool.isRequired,
        toggle: PropTypes.func.isRequired,
        next: PropTypes.func.isRequired,
        prev: PropTypes.func.isRequired,
        changeMode: PropTypes.func.isRequired,
        mode: PropTypes.string.isRequired,
    };

    state = {
        isFavorited: false,
    };

    async componentWillReceiveProps(nextProps) {

        if (this.props.userid) {
            this.setState({
                isFavorited: await isFavorited(this.props.userid, this.props.song.id),
            });
        }
    }

    handleFavorited() {

        var { id, title } = this.props.song;
        var { info, error } = this.props.message;
        var userid = this.props.userid;
        var isFavorited = this.state.isFavorited;

        if (!userid) {
            return error('Please Login');
        }

        if (isFavorited) {
            removeFavorited(userid, id);
            info(`Remove '${title}' from your collection`);
        } else {
            addFavorited(userid, id);
            info(`You're like '${title}'`);
        }

        this.setState({
            isFavorited: !isFavorited,
        });
    }

    render() {

        var { song, playing, paused, toggle, next, prev, mode, changeMode } = this.props;

        var isFavorited = this.state.isFavorited;

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
                        <Icon name="heart" size={15} style={isFavorited && {
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
