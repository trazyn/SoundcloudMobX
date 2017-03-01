
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
        playing: PropTypes.bool.isRequired,
        toggle: PropTypes.func.isRequired,
        next: PropTypes.func.isRequired,
        prev: PropTypes.func.isRequired,
        mode: PropTypes.string.isRequired,
        changeMode: PropTypes.func.isRequired,
        fav: PropTypes.bool,
    };

    state = {
        isFavorited: false,
    };

    async componentWillMount() {

        var { songid, userid, fav } = this.props;

        if (undefined === fav) {
            this.setState({
                isFavorited: await isFavorited(userid, songid),
            });
        }
    }

    handleFavorited() {

        var { userid, songid, fav } = this.props;
        var isFavorited = this.state.isFavorited || fav;

        if (isFavorited) {
            removeFavorited(userid, songid);
        } else {
            addFavorited(userid, songid);
        }

        this.setState({
            isFavorited: !isFavorited,
        });
    }

    render() {

        var isFavorited = this.state.isFavorited || this.props.fav;

        return (
            <View>
                <View style={styles.control}>

                    <View style={styles.inline}>
                        <TouchableOpacity style={styles.transparent} onPress={this.props.changeMode}>
                            {
                                (this.props.mode === PLAYER_MODE[0])
                                    ? <Icon name="loop" size={15} color="black"></Icon>
                                    : <Icon name="shuffle" size={15} color="black"></Icon>
                            }
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.transparent} onPress={this.props.prev}>
                            <Icon name="control-start" size={15} color="black"></Icon>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.play}>
                        <TouchableOpacity style={styles.transparent} onPress={this.props.toggle}>
                        {
                            this.props.playing
                                ? <Icon name="control-pause" size={20} color="black"></Icon>
                                : <Icon name="control-play" size={20} color="black"></Icon>
                        }
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inline}>
                        <TouchableOpacity style={styles.transparent} onPress={this.props.next}>
                            <Icon name="control-end" size={15} color="black"></Icon>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.transparent} onPress={this.handleFavorited.bind(this)}>
                            <Icon name="heart" size={15} style={isFavorited && {
                                color: 'red'
                            }}></Icon>
                        </TouchableOpacity>
                    </View>
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
