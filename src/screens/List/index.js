
import React, { Component, PropTypes } from 'react';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import { inject, observer } from 'mobx-react/native';
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    ListView,
    StyleSheet,
} from 'react-native';

import RippleHeader from '../../components/RippleHeader';
import FadeImage from '../../components/FadeImage';

@inject(stores => ({
    data: stores.list.data,
}))
@observer
export default class List extends Component {

    static propTypes = {
        title: PropTypes.string,
        data: PropTypes.object.isRequired,
    };

    render() {

        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1.id !== r2.id
        });
        var dataSource = ds.cloneWithRows(this.props.data.slice());

        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => this.props.navigator.pop()} style={styles.backward}>
                        <Icon name="arrow-left" color="black" size={14}></Icon>
                    </TouchableOpacity>

                    <Text style={styles.title}>RECENTLY PLAYED</Text>
                </View>

                <ListView
                scrollEventThrottle={16}
                onScroll={e => {

                }}

                enableEmptySections={true}
                dataSource={dataSource}
                renderRow={track => {

                    return (
                        <TouchableOpacity style={styles.item}>
                            <View style={{
                                flexDirection: 'row',
                            }}>
                                <FadeImage {...{
                                    source: {
                                        uri: track.artwork,
                                    },

                                    style: {
                                        height: 50,
                                        width: 50,
                                        marginRight: 10,
                                    }
                                }}></FadeImage>

                                <View style={styles.info}>
                                    <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">{track.title}</Text>
                                    <Text style={styles.username} numberOfLines={1} ellipsizeMode="tail">{track.user.username}</Text>
                                </View>
                            </View>

                            <TouchableOpacity>
                                <Icon name="options" size={12} color="#f50"></Icon>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    );
                }}

                style={styles.list}>
                </ListView>
            </View>
        );
    }
}

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    header: {
        position: 'relative',
        width,
        height: 70,
        paddingBottom: 15,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: '#f1dfdd',
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 12,
        shadowOffset: {
            height: 2,
        }
    },

    backward: {
        position: 'absolute',
        left: 20,
        bottom: 15,
    },

    title: {
        fontWeight: '100',
        letterSpacing: 1,
    },

    list: {
        paddingTop: 10,
        paddingLeft: 20,
        paddingRight: 20,
    },

    item: {
        height: 70,
        width: 335,
        padding: 10,
        borderBottomWidth: .5,
        borderBottomColor: 'rgba(0,0,0,.3)',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    info: {
        justifyContent: 'space-between',
    },

    title: {
        fontWeight: '100',
        maxWidth: 220,
    },

    username: {
        fontSize: 12,
        fontWeight: '100',
        color: '#9B9B9B',
        maxWidth: 220,
    },
});
