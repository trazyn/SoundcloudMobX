
import { observable, action } from 'mobx';

class Options {

    @observable show = false;

    @action toggle(show = !self.show) {
        self.show = show;
    }
}

const self = new Options();
export default self;
