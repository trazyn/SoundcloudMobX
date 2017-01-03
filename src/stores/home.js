
import { observable, action } from 'mobx';
import axios from 'axios';
import { CLIENT_ID, GENRES_MAP, TAG_MAP } from '../config';

class PlayList {

    @observable genre = GENRES_MAP[0];
    @observable songs = [];
    @observable loading = true;
    @observable showRefresh = false;
    @observable showLoadmore = false;

    rate = 1;

    filter(data) {

        var genre = self.genre;

        return data.collection
            .map(song => song.origin || song)
            .filter(song => {
                if (genre in GENRES_MAP) {
                    return song.id && song.streamable && song.kind === 'track' && song.duration < 600000;
                }

                return song.streamable && song.kind === 'track';
            });
    }

    requestAddress(offset = 0) {

        var url = `https://api.soundcloud.com/tracks?linked_partitioning=1&client_id=${CLIENT_ID}&limit=50&offset=${offset}`;
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

        self.rate = 1;
        self.loading = true;

        var response = await axios.get(self.requestAddress());
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
            self.rate = 1;
        }
    }

    @action async doRefresh()  {

        if (self.showRefresh) {
            return;
        }

        self.showRefresh = true;

        var response = await axios.get(self.requestAddress());
        var songs = self.filter(response.data);

        self.showRefresh = false;
        self.songs.clear();
        self.songs.push(...songs);

        self.rate = 1;
    }

    @action async doLoadmore() {

        if (self.showLoadmore) {
            return;
        }

        self.showLoadmore = true;

        var response = await axios.get(self.requestAddress(self.rate * 50));
        var songs = self.filter(response.data);

        self.showLoadmore = false;
        self.songs.push(...songs);

        ++self.rate;
    }
}

const self = new PlayList();
export default self;
