
import { observable, action } from 'mobx';

class Charts {

    @observable type = 'top';

    @action changeType(type) {
        self.type = type;
    }
}

const self = new Charts();
export default self;
