
import { copy } from './helpers';

export default class PorterEvent extends window.Event {
  constructor(event, params){
    super(event, params);
    params = params || {
      bubbles: false,
      cancelable: false,
      detail: undefined
    }

    let customEvent = document.createEvent("CustomEvent");
    customEvent.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return customEvent;
  };

  copy() {
    return copy(this.detail);
  };
}
