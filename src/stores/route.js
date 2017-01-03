
import { observable, action } from 'mobx';

class Route {

    @observable value = {
        name: 'Home'
    };

    @action setRoute(route) {
        this.value = route;
    }
}

export default new Route();
