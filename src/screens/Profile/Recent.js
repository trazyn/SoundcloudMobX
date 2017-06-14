
import React, { Component, PropTypes } from 'react';
import { inject, observer } from 'mobx-react/native';
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    Image,
    StyleSheet,
} from 'react-native';

import FadeImage from '../../components/FadeImage';

@inject(stores => ({
    list: stores.profile.recent.slice(0, 3),
    getList: stores.profile.getRecent,
}))
@observer
export default class Recent extends Component {

    static propTypes = {
        showList: PropTypes.func.isRequired,
    };

    componentWillMount() {
        this.props.getList();
    }

    renderList(list) {

        return list.map((track, index) => {

            return (
                <View key={index} style={styles.item}>
                    <View>
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
                    </View>
                </View>
            );
        });
    }

    renderEmpty() {

        return new Array(3).fill('../../images/loading.gif').map((e, index) => {

            return (
                <View key={index} style={{
                    height: 100,
                    width: 100,
                    backgroundColor: '#fff',
                    shadowOpacity: 0.3,
                    shadowRadius: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Image key={index} {...{
                        source: require('../../images/loading.gif'),
                        style: {
                            height: 12,
                            width: 12,
                            zIndex: 1,
                        },
                    }}></Image>
                </View>
            );
        });
    }

    render() {

        var list = this.props.list;

        return (
            <View style={styles.container}>
                <View style={{
                    height: 100,
                    marginBottom: 20,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}>
                {
                    list.length ? this.renderList(list) : this.renderEmpty()
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
