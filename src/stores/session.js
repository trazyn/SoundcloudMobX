
import { observable, action } from 'mobx';
import { AsyncStorage } from 'react-native';
import _axios from 'axios';
import { CLIENT_ID, SECRET } from '../config';

const axios = _axios.create({

    timeout: 12000,
    transformRequest: [data => {

        var str = [];

        for (let key in data) {

            let value = data[key];

            if (data.hasOwnProperty(key) && value) {
                str.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
            }
        }

        return str.join('&');
    }]
});

class Session {

    auth;
    user;

    @observable loading = false;

    async init() {

        var auth = await AsyncStorage.getItem('@Session:auth');

        if (auth) {

            self.auth = JSON.parse(auth);
            self.getUserInfo();

            if (self.auth.expires - new Date() < 10000) {

                try {

                    var response = await axios.post('https://api.soundcloud.com/oauth2/token', {
                        client_id: CLIENT_ID,
                        client_secret: SECRET,
                        grant_type: 'refresh_token',
                        refresh_token: self.auth.refresh_token
                    });

                    self.create(response.data);
                    self.getUserInfo();

                } catch(ex) {
                    self.auth = 0;
                }
            }
        }
    }

    async getUserInfo() {

        var response = await axios.get(`https://api.soundcloud.com/me?oauth_token=${self.auth.access_token}`);
        self.user = response.data;
    }

    @action async create(auth) {

        auth.expires = +new Date() + auth.expires_in * 1000;

        if (auth.access_token) {
            await AsyncStorage.setItem('@Session:auth', JSON.stringify(auth));
        }

        self.auth = auth;
        self.loading = false;

        return auth;
    }

    login(username, password) {

        self.loading = true;

        return axios.post('https://api.soundcloud.com/oauth2/token', {
            client_id: CLIENT_ID,
            client_secret: SECRET,
            grant_type: 'password',
            username,
            password,
        }).then((response) => {
            self.create(response.data);
        }).catch(ex => console.error('Failed login to Soundcloud:', ex));
    }

    isLogin() {
        return !!self.auth;
    }
}

const self = new Session();
export default self;
