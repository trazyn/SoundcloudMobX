
import { observable, action } from 'mobx';

class Options {

    @observable show = false;
    @observable items = [];

    @action toggle(show = !self.show) {
        self.show = show;
    }

    @action open(items) {

        var items = Array.isArray(items) ? items : [items];

        for (let item of items) {

            let callback = item.callback;

            item.callback = action(callback);
        }

        self.items.replace(items);
        self.show = true;
    }
}

const self = new Options();
export default self;
