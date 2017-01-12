
import { observable, action } from 'mobx';

class Discover {

    @observable type = 'top';

    @action changeType(type) {
        self.type = type;
    }
}

const self = new Discover();
export default self;
