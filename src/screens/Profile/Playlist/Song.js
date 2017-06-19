
import React, { Component, PropTypes } from 'react';
import { inject } from 'mobx-react/native';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import {
    View,
    Text,
    Dimensions,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';

import FadeImage from '../../../components/FadeImage';
import humanNumber from '../../../utils/humanNumber';

@inject(stores => ({
    openModal: stores.openModal,
}))
export default class Song extends Component {

    static propTypes = {
        artwork: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        user: PropTypes.object.isRequired,
        actived: PropTypes.bool.isRequired,
        paused: PropTypes.bool.isRequired,
        play: PropTypes.func.isRequired,
        commentCount: PropTypes.number.isRequired,
        showComments: PropTypes.func.isRequired,
    };

    render() {

        var { artwork, title, user, actived, play, paused, commentCount } = this.props;

        return (
            <TouchableOpacity style={styles.container} onPress={play}>
                <View style={styles.inner}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <FadeImage {...{
                            source: {
                                uri: artwork
                            },

                            resizeMode: 'cover',
                            style: {
                                height: 54,
                                width: 54,
                                marginRight: 15,
                            }
                        }}>
                            {
                                actived && (
                                    <View style={{
                                        height: 54,
                                        width: 54,
                                        backgroundColor: 'rgba(0,0,0,.7)',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                        {
                                            !paused
                                                ? <Icon name="control-pause" size={10} color="white"></Icon>
                                                : <Icon name="control-play" size={10} color="white"></Icon>
                                        }
                                    </View>
                                )
                            }
                        </FadeImage>

                        <View style={{
                            width: 150,
                        }}>
                            <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.title, actived && styles.actived]}>
                                {title}
                            </Text>

                            <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.username, actived && styles.actived]}>
                                {user.username}
                            </Text>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.options} onPress={() => {

                        this.props.openModal([{
                            title: 'Play',
                            callback: play
                        }, {
                            title: `${humanNumber(commentCount)} Comments`,
                            callback: () => {
                                this.props.showComments();
                            }
                        }]);
                    }}>
                        <Icon name="options" color="#f50" size={14}></Icon>
                    </TouchableOpacity>
                </View>

                <View style={[styles.line, actived && {
                    backgroundColor: '#f50',
                }]}></View>
            </TouchableOpacity>
        );
    }
}

const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        width,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: 'transparent',
    },

    inner: {
        width: width - 60,
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 30,
        marginRight: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    options: {
        height: 48,
        width: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },

    title: {
        color: 'rgba(0,0,0,.7)',
    },

    username: {
        marginTop: 10,
        fontSize: 13,
        color: 'rgba(0,0,0,.5)',
    },

    line: {
        width: width - 40,
        height: .5,
        backgroundColor: 'rgba(0,0,0,.3)',
    },

    actived: {
        color: '#f50',
    },
});
