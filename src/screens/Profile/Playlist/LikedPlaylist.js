
import React, { Component, PropTypes } from 'react';
import { inject, observer } from 'mobx-react/native';
import {
    View,
    Text,
} from 'react-native';

import List from './List';

@inject(stores => ({
    list: stores.profile.liked,
    doRefresh: stores.profile.getLiked,
    showRefresh: stores.profile.loading,
    doLoadMore: stores.profile.loadMoreLiked,
    showLoadmore: stores.profile.loading4liked,
}))
@observer
export default class LikedPlaylist extends Component {

    render() {

        return (
            <List {...{
                title: 'LIKED PLAYED',
                navigate: this.props.navigation.navigate,
                ...this.props,
            }}></List>
        );
    }
}
