
import { copy }        from './helpers';
import { PorterEvent } from './PorterEvent';

export default class Channel {
  /*
    The Channel class manages the addition and 
    removal of EventListeners with actions and callbacks
    on the window object.
    The Channel class's `publish` method turns actions
    and data into dispatched events namespaced to the channel's
    name ('theChannelName::theAction')
  */

  constructor(name) {
    if (!name instanceof String) {
      console.error("Channels only accept strings as names; not", name);
      return this;
    }

    this.name        = name;
    this.subscribers = {};
  }

  formatAction(action) {
    return [this.name, action].join("::");
  }

  findSubscriber(action) {
    return this.subscribers[action];
  }

  subscribe(action, callback) {
    let subscriber = this.findSubscriber(action);

    if (subscriber) {
      subscriber.push(callback);
    } else {
      subscriber = [callback];
    }
    
    this.subscribers[action] = subscriber;
    let chanAction = this.formatAction(action)
    window.addEventListener(chanAction, callback);
  }

  unsubscribe(action, callback) {
    let subscriber = this.findSubscriber(action);

    if (subscriber) {
      subscriber = subscriber.filter(function(item) { return item != callback; });
      this.subscribers[action] = subscriber;
      let chanAction = this.formatAction(action)
      window.removeEventListener(chanAction, callback);
    }

  };

  publish(action, data) {

    let chanAction = this.formatAction(action);
    let event = new PorterEvent(chanAction, {"detail": data});
    window.dispatchEvent(event);  

  };

  clearSubscribers() {
    let self = this;
    for(var key in this.subscribers) {
      if(Object.__proto__[key]) return;
      this.subscribers[key].forEach(function(callback) {
        self.unsubscribe(key, callback)
      });
    }
    this.subscribers = {};
  };

  grab(e) {
    return e.detail;
  }
}
