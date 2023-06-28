//Event Discpatcer - pub sub model for devices.

class EventDispatcher {
  constructor() {
    this.listeners = {};
  }

  addListener(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  removeListener(event, callback) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(
      (listener) => listener !== callback
    );
  }

  dispatch(event, data) {
    if (!this.listeners[event]) return;
    for (let i = 0; i < this.listeners[event].length; i++) {
      this.listeners[event][i](data);
    }
  }
}

export const eventDispatcher = new EventDispatcher();





