
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
    @observable loading = false;

    nextHref = '';

    @action async getSongs(genre, type = 'top') {

        this.songs.clear();

        var url = `https://api-v2.soundcloud.com/charts?kind=${type}&genre=soundcloud%3Agenres%3A${genre.key}&client_id=fDoItMDbsbZz8dY16ZzARCZmzgHBPotA&limit=20&offset=0&linked_partitioning=1&app_version=1484129465`;
        var response = await axios.get(url);
        var songs = filter(response.data);

        this.nextHref = response.data.next_href;
        this.songs.clear();
        this.songs.push(...songs);
    }

    @action async loadMore() {

        var response = await axios(this.nextHref);
        var songs = filter(response.data);

        this.nextHref = response.data.next_href;
        this.songs.push(...songs);
    }
}
