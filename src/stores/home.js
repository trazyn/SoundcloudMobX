
import { observable, action } from 'mobx';
import axios from 'axios';
import { CLIENT_ID, GENRES_MAP, TAG_MAP } from '../config';
import songsFilter from '../utils/songsFilter';

class PlayList {

    @observable genre = GENRES_MAP[0];
    @observable songs = [];
    @observable loading = true;
    @observable showRefresh = false;
    @observable showLoadmore = false;

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

    @action async getSongs(genre = self.genre) {

        self.loading = true;
        self.nextHref = '';

        var response = await axios.get(self.request());
        var songs = self.filter(response.data, genre);

        self.loading = false;
        self.songs.clear();
        self.songs.push(...songs);
    }

    @action changeGenre(genre) {

        if (!self.loading) {
            self.songs.clear();
            self.genre = genre;
            self.getSongs(genre);
        }
    }

    @action async doRefresh()  {

        if (self.showRefresh) {
            return;
        }

        self.showRefresh = true;
        self.nextHref = '';

        var response = await axios.get(self.request());
        var songs = self.filter(response.data);

        self.showRefresh = false;
        self.songs.clear();
        self.songs.push(...songs);
    }

    @action async doLoadmore() {

        if (self.showLoadmore) {
            return;
        }

        self.showLoadmore = true;

        var response = await axios.get(self.request());
        var songs = self.filter(response.data);

        self.showLoadmore = false;
        self.songs.push(...songs);
    }
}

const self = new PlayList();
export default self;
