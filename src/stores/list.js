
import { observable, action } from 'mobx';

class List {

    @observable data = [];

    @action setup(args) {
        self.data.replace(args.data);
    }
}

const self = new List();
export default self;
