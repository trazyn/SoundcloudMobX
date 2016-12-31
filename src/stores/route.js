
import { observable, action } from 'mobx';

class Route {

    @observable value = {
        name: 'Home'
    };

    @action setRoute(route) {

        if (this.value.name !== route.name) {
            this.value = route;
        }
    }
}

export default new Route();
