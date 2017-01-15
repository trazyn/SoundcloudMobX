
import React, { Component, PropTypes } from 'react';
import { inject, observer } from 'mobx-react/native';
import {
    View,
    Text,
    Dimensions,
    StatusBar,
    Image,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';

import FadeImage from '../../components/FadeImage';

@inject(stores => ({
    card: stores.card,
    type: stores.discover.type,
}))
@observer
export default class Card extends Component {

    static propTypes = {
        type: PropTypes.oneOf(['top', 'trending']).isRequired,
        genre: PropTypes.object.isRequired,
        card: PropTypes.object.isRequired,
        showChart: PropTypes.func.isRequired,
    };

    async componentDidMount() {

        var { card, genre, type } = this.props;

        if (!card.songs.length) {
            await card.getSongs(genre, type);
        }

        card.setGenre(genre);
    }

    async componentWillReceiveProps(nextProps) {

        var { card, genre, type } = this.props;

        if (this.props.type !== nextProps.type) {
            await card.getSongs(genre, nextProps.type);
        }
    }

    renderContent() {

        return (
            <View style={styles.inner}>
                <Text style={styles.genre}>
                # {this.props.genre.name}
                </Text>
            </View>
        );
    }

    render() {

        var { card, showChart } = this.props;
        var song = card.songs.slice()[0];

        return (
            <TouchableOpacity style={styles.container} onPress={e => card.songs.length && showChart(card)}>
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
                        }}>
                        </Image>
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
