
import { observable, action } from 'mobx';
import axios from 'axios';
import { CLIENT_ID, GENRES_MAP, TAG_MAP } from '../config';

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

        return data.collection
            .map(song => song.origin || song)
            .map(song => {

                return {
                    title: song.title,
                    id: song['id'],
                    artwork: (song['artwork_url'] || '').replace(/\large\./, 't500x500.'),
                    duration: song['duration'],
                    kind: song['kind'],
                    commentCount: song['comment_count'],
                    likesCount: song['likes_count'],
                    playbackCount: song['playback_count'],
                    created: +new Date(song['created_at']),
                    desc: song['description'],
                    genre: song['genre'],
                    labelId: song['label_id'],
                    lableNumber: song['label_name'],
                    release: song['release'],
                    releaseDay: song['release_day'],
                    releaseMonth: song['release_month'],
                    releaseYear: song['release_year'],
                    streamable: song['streamable'],
                    streamUrl: song['stream_url'],
                    taglist: song['tag_list'],
                    uri: song['uri'],
                    fav: song['user_favorite'],
                    user: song['user'],
                    filetype: song['original_format'],
                    waveform: song['waveform_url'],
                };
            })
            .filter(song => {

                var must = song.duration < 600000 && song.id && song.streamable;

                if (genre in GENRES_MAP) {
                    return song.kind === 'track' && must;
                }

                return must;
            });
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
