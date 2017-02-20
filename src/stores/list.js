
import { observable, action } from 'mobx';

class List {

    @observable title = '';
    @observable showRefresh = false;
    @observable showLoadmore = false;
    @observable data = [];

    @action setup(params) {
        self.title = params.title;
        self.data = params.data;
        self.actions = params.actions;
    }

    @action async doRefresh() {

        self.showRefresh = true;
        var data = await self.actions.refresh();
        self.data.replace(data);
        self.showRefresh = false;
    }

    @action async doLoadmore() {

        self.showLoadmore = true;
        var data = await self.actions.loadmore();
        self.data.push(...data);
        self.showLoadmore = false;
    }
}

const self = new List();
export default self;
