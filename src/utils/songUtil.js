
import axios from 'axios';
import { CLIENT_ID } from '../config';

export async function isFavorited(userid, songid) {

    var response = await axios.get(`http://api.soundcloud.com/users/${userid}/favorites/${songid}?client_id=${CLIENT_ID}`);
    return response.data.user_favorite;
}

export async function addFavorited(userid, songid) {

    var response = await axios({
        url: `https://api.soundcloud.com/users/${userid}/favorites/${songid}?client_id=${CLIENT_ID}`,
        method: 'put',
    });
    return response.data.user_favorite;
}

export async function removeFavorited(userid, songid) {

    var response = await axios({
        url: `https://api.soundcloud.com/users/${userid}/favorites/${songid}?client_id=${CLIENT_ID}`,
        method: 'delete',
    });
    return response.data.user_favorite;
}
