
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Linking,
} from 'react-native';

import FadeImage from '../../components/FadeImage';
import humanNumber from '../../utils/humanNumber';

@inject(stores => ({
    list: stores.profile.followers.slice(),
    getList: () => {
        stores.profile.getFollowers(stores.session.user.id);
    },
    count: stores.session.user.followers_count,
    open: () => {
        Linking.openURL(`${stores.session.user.permalink_url}/followers`);
    },
}))
@observer
export default class Followers extends Component {
    componentWillMount() {
        this.props.getList();
    }

    renderList(list) {
        return (
            <TouchableOpacity onPress={this.props.open} style={{
                alignItems: 'center',
                flexDirection: 'row',
            }}>
                {
                    list.slice(0, 5).map((user, index) => {
                        return (
                            <View style={styles.avatar} key={index}>
                                <FadeImage {...{
                                    source: {
                                        uri: user.avatar_url,
                                    },
                                    style: {
                                        width: 25,
                                        height: 25,
                                        shadowColor: '#000',
                                        shadowOpacity: .3,
                                        shadowRadius: 8,
                                        zIndex: index + 1,
                                    }
                                }}>
                                    {
                                        list.length > 4 && index === 4 && (
                                            <View style={styles.overlay}>
                                                <Icon name="options" color="white" size={12} />
                                            </View>
                                        )
                                    }
                                </FadeImage>
                            </View>
                        );
                    })
                }
                <Text style={styles.count}>{humanNumber(this.props.count)} Followers</Text>
            </TouchableOpacity>
        );
    }

    render() {
        var { list } = this.props;

        return (
            <View style={styles.container}>
                {
                    list.length
                        ? this.renderList(list)
                        : <Text style={[styles.count, styles.empty]}>No one is following you yet.</Text>
                }

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: 25,
        overflow: 'hidden',
    },

    overlay: {
        height: 25,
        width: 25,
        backgroundColor: 'rgba(0,0,0,.6)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    avatar: {
        width: 25,
        height: 25,
        borderRadius: 25,
        overflow: 'hidden',
    },

    count: {
        marginLeft: 8,
        color: '#fff',
        fontSize: 8,
        fontWeight: '100',
        backgroundColor: 'transparent',
    },

    empty: {
        marginLeft: -.1,
        fontSize: 12,
    },
});
