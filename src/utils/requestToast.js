import { Toast } from 'vant';

export default class MessageQueue {
  constructor(queue = [], duration = 2000) {
    this.queue = queue;
    this.duration = duration;
    this.queueing = false;
  }

  pushQueue(data) {
    this.queue.push(data);
    this.update();
  }

  update() {
    if (!this.queueing) {
      this.next();
    }
  }

  clear() {
    // this.queue = [];
  }

  next() {
    if (this.queue.length) {
      this.queueing = true;
      const data = this.queue.shift();
      Toast.fail({
        duration: this.duration,
        message: data.msg,
        onClose: () => {
          if (data.code === -999 || data.code === -998) {
            this.clear();
          } else {
            this.next();
          }
        },
      });
    } else {
      this.queueing = false;
    }
  }
}
