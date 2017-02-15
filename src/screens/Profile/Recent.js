
import React, { Component, PropTypes } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
} from 'react-native';

import FadeImage from '../../components/FadeImage';

export default class Recent extends Component {

    static propTypes = {
        tracks: PropTypes.array.isRequired,
        showList: PropTypes.func.isRequired,
    };

    render() {

        return (
            <View style={styles.container}>
                <View style={{
                    height: 100,
                    marginBottom: 20,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}>
                {
                    this.props.tracks.map((track, index) => {

                        return (
                            <View key={index} style={styles.item}>
                                <TouchableOpacity>
                                    <FadeImage {...{
                                        source: {
                                            uri: track.artwork,
                                        },

                                        showLoading: true,

                                        style: {
                                            height: 100,
                                            width: 100,
                                            shadowOpacity: 0.3,
                                            shadowRadius: 12,
                                        }
                                    }}></FadeImage>
                                </TouchableOpacity>
                            </View>
                        );
                    })
                }
                </View>

                <View style={{
                    alignItems: 'center',
                }}>
                    <TouchableOpacity onPress={this.props.showList} style={{
                        height: 28,
                        width: 220,
                        backgroundColor: 'rgba(0,0,0,.8)',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 28,
                    }}>
                        <Text style={{
                            color: '#fff',
                            fontSize: 12,
                            fontWeight: '100',
                        }}>Hear the tracks you’ve played</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        width,
        marginTop: 30,
        paddingLeft: 20,
        paddingRight: 20,
        height: 148,
    }
});
