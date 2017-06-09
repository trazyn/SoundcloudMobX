
import { observable, action } from 'mobx';
import axios from 'axios';
import songsFilter from '../utils/songsFilter';
import { CLIENT_ID } from '../config';

function filter(data) {
    return songsFilter(data.collection.map(e => e.track));
}

export default class Card {

    @observable playlist = [];
    @observable genre = {};
    @observable playing = false;
    @observable type;

    nextHref = '';

    request() {

        return new Promise(async (resolve, reject) => {

            var url = this.nextHref || `https://api-v2.soundcloud.com/charts?kind=${this.type}&genre=soundcloud%3Agenres%3A${this.genre.key}&client_id=${CLIENT_ID}&limit=20&offset=0&linked_partitioning=1&app_version=1484129465`;
            var response = await axios.get(url);

            this.nextHref = `${response.data.next_href}&client_id=${CLIENT_ID}`;

            resolve(filter(response.data));
        });
    }

    @action async getPlaylist() {

        this.playlist.clear();
        this.nextHref = '';

        var playlist = await this.request();
        this.playlist.clear();
        this.playlist.push(...playlist);
    }

    @action setGenre(genre) {
        this.genre = genre;
    }

    @action setType(type) {
        this.type = type;
    }

    @action setPlaying(state = false) {
        this.playing = state;
    }
}
