
import { observable, action } from 'mobx';

class Toast {
    timer;

    @observable message;
    @observable show = false;
    @observable color;

    @action toggle(state = !self.show) {
        self.show = state;

        if (state) {
            clearTimeout(self.timer);

            self.timer = setTimeout(() => {
                self.toggle(false);
            }, 3000);
        }
    }

    @action showMessage(message, color) {
        self.message = message;
        self.color = color;

        if (self.show) {
            self.show = false;
            clearTimeout(self.timer);
            setTimeout(self.toggle);
        } else {
            self.toggle();
        }
    }

    @action showError(message) {
        self.showMessage(message, '#d0011b');
    }
}

const self = new Toast();
export default self;
