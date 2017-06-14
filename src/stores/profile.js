
import { observable, action, computed } from 'mobx';
import axios from 'axios';
import { CLIENT_ID } from '../config';
import songsFilter from '../utils/songsFilter';
import uuid from 'uuid';

class Profile {

    @observable loading = false;
    @observable followers = [];
    @observable suggestions = [];
    @observable recent = [];
    @observable liked = [];
    @observable loading4suggestion = false;
    @observable loading4recent = false;
    @observable loading4liked = false;

    followersHrefNext;
    suggestionHrefNext;
    recentHrefNext;
    likedHrefNext;

    @action async getFollowers(userid) {

        var response = await axios.get(`https://api.soundcloud.com/users/${userid}/followings?
            &client_id=${CLIENT_ID}
            &limit=5
            &offset=0
            &linked_partitioning=0
            `.replace(/\s/g, ''));

        self.followers.replace(response.data.collection);
        self.followersHrefNext = response.data.next_href;
    }

    @action async loadMoreFollowers() {

        var response = await axios.get(self.followersHrefNext);

        self.followers.push(...response.data.collection);
        self.followersHrefNext = response.data.next_href;
    }

    @action async getSuggestion() {

        var response = await axios.get(`https://api-v2.soundcloud.com/me/personalized-tracks?
            &linked_partitioning=0
            &limit=5
            &offset=0
            &client_id=${CLIENT_ID}
            `.replace(/\s/g, ''));

        self.suggestions.replace(response.data.collection);
        self.suggestionHrefNext = response.data.next_href;
    }

    @action async loadMoreSuggestion() {

        self.loading4suggestion = true;

        var response = await axios.get(self.suggestionHrefNext);

        self.suggestions.uuid = self.suggestions.uuid || uuid.v4();
        self.suggestions.push(...response.data.collection);
        self.suggestionHrefNext = response.data.next_href;
        self.loading4suggestion = false;
    }

    @action async getRecent() {

        self.loading = true;

        var response = await axios.get(`https://api-v2.soundcloud.com/me/play-history/tracks?
            &client_id=${CLIENT_ID}
            &limit=20
            &offset=0
            &linked_partitioning=0
            `.replace(/\s/g, ''));

        var songs = songsFilter(response.data.collection.map(e => e.track));

        self.recent.uuid = self.recent.uuid || uuid.v4();
        self.recent.replace(songs);
        self.recentHrefNext = response.data.next_href;
        self.loading = false;
    }

    @action async loadMoreRecent() {

        self.loading4recent = true;

        var response = await axios.get(self.recentHrefNext);
        var songs = songsFilter(response.data.collection.map(e => e.track));

        self.recent.push(...songs);
        self.recentHrefNext = response.data.next_href;
        self.loading4recent = false;
    }

    @action async getLiked(userid) {

        self.loading = true;
        var response = await axios.get(`https://api-v2.soundcloud.com/users/${userid}/track_likes?
            &client_id=${CLIENT_ID}
            &limit=20
            &offset=0
            &linked_partitioning=0
            `.replace(/\s/g, ''));

        var songs = songsFilter(response.data.collection.map(e => e.track));

        self.liked.uuid = self.liked.uuid || uuid.v4();
        self.liked.replace(songs);
        self.likedHrefNext = response.data.next_href;
        self.loading = false;
    }

    @action async loadMoreLiked() {

        if (!self.likedHrefNext) {
            return [];
        }

        self.loading4liked = true;

        var response = await axios.get(self.likedHrefNext);
        var songs = songsFilter(response.data.collection.map(e => e.track));

        self.liked.push(...songs);
        self.likedHrefNext = response.data.next_href;
        self.loading4liked = false;
    }
}

const self = new Profile();
export default self;
