
export default class Search {
  element;
  subElements;
  constructor(){
    this.render();
    this.getSubElements();
    this.search();
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

  search = () => {
    this.subElements.input.addEventListener('input', this.onInput(this.onSearch, 1000))
  };

  onInput = (func, delay) => {
      let timer;
      return function () {
        if(timer) clearTimeout(timer);
        timer = setTimeout(func,delay);
      }
  };

  onSearch = async () => {
      const input = this.subElements.input;
      const BACKEND_URL = 'http://localhost:3000';
      const url = new URL('products', BACKEND_URL);

      const response = await fetch(url);
      const data = await response.json();

      const filteredData = data.filter(item => item.title.toLowerCase().includes(input.value.toLowerCase()));
      console.error('data', filteredData);
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
