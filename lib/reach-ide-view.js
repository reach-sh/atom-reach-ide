'use babel';

export default class ReachIdeView {

  constructor(serializedState) {
    // // Create root element
    // this.element = document.createElement('div');
    // this.element.classList.add('reach-ide');
    // // Create message element
    // const message = document.createElement('div');
    // message.textContent = 'The Poo package is Alive! It\'s ALIVE!';
    // message.classList.add('message');
    // this.element.appendChild(message);
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }

}
