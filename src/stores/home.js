
import { observable, action } from 'mobx';
import axios from 'axios';
import uuid from 'uuid';
import { CLIENT_ID, GENRES_MAP, TAG_MAP } from '../config';
import songsFilter from '../utils/songsFilter';

class PlayList {

    @observable genre = GENRES_MAP[0];
    @observable playlist = [];
    @observable loading = true;
    @observable loading4refresh = false;
    @observable loading4loadmore = false;

    nextHref = '';

    filter(data) {

        var genre = self.genre;

        this.nextHref = data['next_href'];

        return songsFilter(data.collection);
    }

    request() {

        var url = this.nextHref || `https://api.soundcloud.com/tracks?linked_partitioning=1&client_id=${CLIENT_ID}&limit=50`;
        var genre = self.genre;

        if (GENRES_MAP.includes(genre)) {

            if (TAG_MAP.indexOf(genre) === -1) {
                genre = `${genre} house`;
            }

            url += `&tags=${genre}`;
        } else {
            url += `&q=${genre}`;
        }

        return url;
    }

    @action async getPlaylist(genre = self.genre) {

        self.loading = true;
        self.nextHref = '';

        var response = await axios.get(self.request());
        var playlist = self.filter(response.data, genre);

        self.loading = false;
        self.playlist.uuid = uuid.v4();
        self.playlist.clear();
        self.playlist.push(...playlist);
    }

    @action changeGenre(genre) {

        if (!self.loading) {
            self.playlist.clear();
            self.genre = genre;
            self.getPlaylist(genre);
        }
    }

    @action async doRefresh()  {

        if (self.loading4refresh) {
            return;
        }

        self.loading4refresh = true;
        self.nextHref = '';

        var response = await axios.get(self.request());
        var playlist = self.filter(response.data);

        self.playlist.uuid = uuid.v4();
        self.playlist.clear();
        self.playlist.push(...playlist);
        self.loading4refresh = false;
    }

    @action async doLoadmore() {

        if (self.loading4loadmore) {
            return;
        }

        self.loading4loadmore = true;

        var response = await axios.get(self.request());
        var playlist = self.filter(response.data);

        self.playlist.push(...playlist);
        self.loading4loadmore = false;
    }
}

const self = new PlayList();
export default self;
