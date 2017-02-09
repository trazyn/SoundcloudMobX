
import { observable, action } from 'mobx';
import axios from 'axios';
import { CLIENT_ID } from '../config';
import songsFilter from '../utils/songsFilter';

class Profile {

    @observable user;
    @observable loading = false;
    @observable followers = [];
    @observable suggestions = [];
    @observable recent = [];
    @observable likes = [];

    followersHrefNext;
    suggestionHrefNext;
    recentHrefNext;
    likesHrefNext;

    @action getProfile(token) {

        return new Promise(async (resolve, reject) => {

            self.loading = true;
            try {
                var response = await axios.get(`https://api.soundcloud.com/me?oauth_token=${token}`);
                self.user = response.data;
                resolve();
            } catch(ex) {
                reject(ex);
            }
            self.loading = false;
        });
    }

    @action async getFollowers(userid) {

        var response = await axios.get(`https://api-v2.soundcloud.com/users/${userid}/followings?
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

        self.followers.push(response.data.collection);
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

        var response = await axios.get(self.suggestionHrefNext);

        self.suggestions.push(self.data.collection);
        self.suggestionHrefNext = response.data.next_href;
    }

    @action getRecent() {

        return new Promise(async (resolve, reject) => {

            try {
                var response = await axios.get(`https://api-v2.soundcloud.com/me/play-history/tracks?
                    &client_id=${CLIENT_ID}
                    &limit=20
                    &offset=0
                    &linked_partitioning=0
                    `.replace(/\s/g, ''));

                self.recent.replace(songsFilter(response.data.collection.map(e => e.track)));
                self.recentHrefNext = response.data.next_href;
                resolve();
            } catch(ex) {
                reject();
            }
        });
    }

    @action async loadMoreRecent() {

        var response = await axios.get(self.recentHrefNext);

        self.recent.push(songsFilter(response.data.collection));
        self.recentHrefNext = response.data.next_href;
    }

    @action async getLikes(userid) {

        var response = await axios.get(`https://api-v2.soundcloud.com/users/${userid}/track_likes?
            &client_id=${CLIENT_ID}
            &limit=20
            &offset=0
            &linked_partitioning=0
            `.replace(/\s/g, ''));

        self.likes.replace(songsFilter(response.data.collection.map(e => e.track)));
        self.likesHrefNext = response.data.next_href;
    }

    @action async loadMoreLikes() {

        var response = await axios.get(self.likesHrefNext);

        self.likes.push(songsFilter(response.data.collection.map(e => e.track)));
        self.likes = response.data.next_href;
    }
}

const self = new Profile();
export default self;
