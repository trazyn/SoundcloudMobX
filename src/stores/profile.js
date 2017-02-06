
import { observable, action } from 'mobx';
import axios from 'axios';
import { CLIENT_ID } from '../config';

class Profile {

    @observable user;
    @observable loading = false;

    @action async getProfile(token) {

        self.loading = true;
        try {
            var response = await axios.get(`https://api.soundcloud.com/me?oauth_token=${token}`);
            self.user = response.data;
        } catch(ex) {
            console.error('Failed to get user info:', ex);
        }
        self.loading = false;
    }
}

const self = new Profile();
export default self;
