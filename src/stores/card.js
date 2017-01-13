
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

    nextHref = '';

    request(params) {

        return new Promise(async (resolve, reject) => {

            var url = `https://api-v2.soundcloud.com/charts?kind=${params.type}&genre=soundcloud%3Agenres%3A${params.genre.key}&client_id=fDoItMDbsbZz8dY16ZzARCZmzgHBPotA&limit=20&offset=0&linked_partitioning=1&app_version=1484129465`;
            var response = await axios.get(url);

            this.nextHref = response.data.next_href;

            resolve(filter(response.data));
        });
    }

    @action async getSongs(genre = this.genre, type = 'top') {

        this.songs.clear();

        var songs = await this.request({
            type,
            genre,
        });
        this.songs.clear();
        this.songs.push(...songs);
    }

    @action setGenre(genre) {
        this.genre = genre;
    }

    @action async loadMore() {

        var response = await axios(this.nextHref);
        var songs = filter(response.data);

        this.nextHref = response.data.next_href;
        this.songs.push(...songs);
    }
}
