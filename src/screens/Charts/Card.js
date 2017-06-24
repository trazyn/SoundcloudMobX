
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MKIcon from 'react-native-vector-icons/MaterialIcons';
import { inject, observer } from 'mobx-react/native';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';

import FadeImage from '../../components/FadeImage';

@inject(stores => ({
    /** Get the associate instance */
    card: stores.card,
    type: stores.charts.type,
    isPlaying: () => {
        var player = stores.player;
        return player.playing
            && player.playlist.uuid === stores.card.playlist.uuid
            && stores.charts.type4playing === stores.charts.type;
    }
}))
@observer
export default class Card extends Component {
    static propTypes = {
        genre: PropTypes.object.isRequired,
        showChart: PropTypes.func.isRequired,
    };

    componentDidMount() {
        var { card, genre, type } = this.props;

        card.setGenre(genre);
        card.setType(type);

        if (!card.playlist.length) {
            card.getPlaylist();
        }
    }

    componentWillReceiveProps(nextProps) {
        var { card } = this.props;

        if (this.props.type !== nextProps.type) {
            card.setType(nextProps.type);
            card.refresh();
        }
    }

    renderContent() {
        var playing = this.props.isPlaying();

        return (
            <View style={styles.inner}>
                <Text style={[styles.genre, playing && {
                    color: '#f50',
                }]}>
                # {this.props.genre.name}
                </Text>

                {
                    playing && (
                        <View style={{
                            marginTop: 10,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <MKIcon name="equalizer" style={{
                                fontSize: 18,
                                color: '#f50',
                            }} />
                        </View>
                    )
                }
            </View>
        );
    }

    render() {
        var { card, showChart } = this.props;
        var song = card.playlist.slice()[0];

        return (
            <TouchableOpacity style={styles.container} onPress={e => card.playlist.length && showChart(card)}>
                {
                    song
                        ? (
                            <FadeImage {...{
                                source: {
                                    uri: song.artwork,
                                },

                                style: {
                                    height: 150,
                                    width: 150,
                                },
                            }}>
                                {this.renderContent()}
                            </FadeImage>
                        )
                        : (
                            <Image {...{
                                source: require('../../images/loading.gif'),

                                style: {
                                    height: 12,
                                    width: 12,
                                },
                            }} />
                        )
                }
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: 150,
        width: 150,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },

    inner: {
        height: 150,
        width: 150,
        backgroundColor: 'rgba(0,0,0,.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    genre: {
        color: '#fff',
        fontWeight: '100'
    }
});
