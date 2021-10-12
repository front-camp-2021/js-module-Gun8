
export default class Search {
  element;
  subElements;
  constructor(){
    this.render();
    this.getSubElements();
  }
  getTemplate = () => {
    return `
      <div class="item-list-search">
        <input type="text" placeholder="Search" data-element="input">
        <img src="img/search.svg" alt="search">
      </div>
    `
  };

  render() {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = this.getTemplate();

    this.element = wrapper.firstElementChild;
  }

  getSubElements() {
    const result = {};
    const elements = this.element.querySelectorAll('[data-element]');

    for (const subElement of elements) {
      const name = subElement.dataset.element;

      result[name] = subElement;
    }

    this.subElements = result;
  }

  onInput = (func, delay) => {
      let timer;
      return function () {
        if(timer) clearTimeout(timer);
        timer = setTimeout(func,delay);
      }
  };

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
  }
}
