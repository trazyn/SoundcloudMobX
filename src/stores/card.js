
import { observable, action } from 'mobx';
import axios from 'axios';
import songsFilter from '../utils/songsFilter';

function filter(data) {

    return data.collection
        .map(e => e.track)
        .map(songsFilter);
}

export default class Card {

    @observable songs = [];
    @observable genre = {};
    @observable type;

    nextHref = '';

    request() {

        return new Promise(async (resolve, reject) => {

            var url = this.nextHref || `https://api-v2.soundcloud.com/charts?kind=${this.type}&genre=soundcloud%3Agenres%3A${this.genre.key}&client_id=fDoItMDbsbZz8dY16ZzARCZmzgHBPotA&limit=20&offset=0&linked_partitioning=1&app_version=1484129465`;
            var response = await axios.get(url);

            this.nextHref = response.data.next_href + '&client_id=fDoItMDbsbZz8dY16ZzARCZmzgHBPotA';

            resolve(filter(response.data));
        });
    }

    @action async getSongs() {

        this.songs.clear();
        this.nextHref = '';

        var songs = await this.request();
        this.songs.clear();
        this.songs.push(...songs);
    }

    @action setGenre(genre) {
        this.genre = genre;
    }

    @action setType(type) {
        this.type = type;
    }
}
