
import { observable, action } from 'mobx';
import axios from 'axios';
import { CLIENT_ID, GENRES_MAP, TAG_MAP } from '../config';

class PlayList {

    @observable genre = GENRES_MAP[0];
    @observable songs = [];
    @observable loading = true;
    @observable refreshing = false;

    filter(data) {

        var genre = self.genre;

        return data.collection
            .map(song => song.origin || song)
            .filter(song => {
                if (genre in GENRES_MAP) {
                    return song.streamable && song.kind === 'track' && song.duration < 600000;
                }

                return song.streamable && song.kind === 'track';
            });
    }

    requestAddress() {

        var url = API;
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

        var response = await axios.get(self.requestAddress());
        var songs = self.filter(response.data, genre);

        self.loading = false;
        self.songs.push(...songs);
    }

    @action changeGenre(genre) {

        self.songs.clear();
        self.genre = genre;
        self.getSongs(genre);
    }

    @action async refresh()  {

        self.refreshing = true;

        var response = await axios.get(self.requestAddress());
        var songs = self.filter(response.data);

        self.refreshing = false;
        self.songs.clear();
        self.songs.push(...songs);
    }
}

const API = `https://api.soundcloud.com/tracks?linked_partitioning=1&client_id=${CLIENT_ID}&limit=50&offset=0`;
const self = new PlayList();

export default self;
