
import React, { Component, PropTypes } from 'react';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import { observer } from 'mobx-react/native';
import {
    View,
    TouchableOpacity,
    Text,
    Dimensions,
    StyleSheet,
} from 'react-native';

import { PLAYER_MODE } from '../../config';
import { isFavorited, addFavorited, removeFavorited } from '../../utils/songUtil';

@observer
export default class Controller extends Component {

    static propTypes = {
        userid: PropTypes.number,
        player: PropTypes.object.isRequired,
        message: PropTypes.object.isRequired,
    };

    state = {
        isFavorited: false,
    };

    async componentWillMount() {

        var { id, fav } = this.props.player.song;

        if (this.props.userid && undefined === fav) {
            this.setState({
                isFavorited: await isFavorited(this.props.userid, id),
            });
        }
    }

    handleFavorited() {

        var { id, fav, title } = this.props.player.song;
        var { info, error } = this.props.message;
        var userid = this.props.userid;
        var isFavorited = this.state.isFavorited || fav;

        if (!userid) {
            return error('Please Login');
        }

        if (isFavorited) {
            removeFavorited(userid, id);
            info(`Remove ${title} from your collection`);
        } else {
            addFavorited(userid, id);
            info(`You're like '${title}'`);
        }

        this.setState({
            isFavorited: !isFavorited,
        });
    }

    render() {

        var { song, playing, paused, toggle, next, prev, mode, changeMode } = this.props.player;

        var isFavorited = this.state.isFavorited || song.fav;

        return (
            <View style={styles.control}>

                <TouchableOpacity onPress={() => {
                    this.props.message.info('This is a Toast message');
                }}>
                    <Text>Show Toast</Text>
                </TouchableOpacity>

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
