
import { observable, action } from 'mobx';

class Charts {

    @observable type = 'top';
    @observable type4playing;

    @action changeType(type) {
        self.type = type;
    }

    @action setType4playing(type4playing) {
        self.type4playing = type4playing;
    }
}

const self = new Charts();
export default self;
