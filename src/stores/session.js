
import { observable, action } from 'mobx';
import { AsyncStorage } from 'react-native';
import axios from 'axios';
import { CLIENT_ID, SECRET } from '../config';

class Session {

    auth;

    @observable loading = false;

    async init() {

        self.auth = await AsyncStorage.getItem('@Session:auth');

        if (self.auth && self.auth.expires - new Date() < 10000) {

            var response = await axios.post('https://api.soundcloud.com/oauth2/token', {
                grant_type: 'refresh_token',
            });

            self.create(response.data);
        }
    }

    @action async create(auth) {

        auth.expires = +new Date() + auth.expires_in * 1000;

        if (auth.access_token) {
            await AsyncStorage.setItem('@Session:auth', auth);
        }

        self.auth = auth;
        self.loading = false;
    }

    async login(username, password) {

        self.loading = true;

        var response = await axios.post('https://api.soundcloud.com/oauth2/token', {
            client_id: CLIENT_ID,
            client_secret: SECRET,
            grant_type: 'password',
            username,
            password,
        });

        self.create(response.data);
    }

    isLogin() {
        return !self.auth;
    }
}

const self = new Session();
export default self;
