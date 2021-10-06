import FiltersList from '../filters-list/index.js';

export default class SideBar {
  element;
  subElements;
  constructor (categoriesFilter = [], brandFilter = []) {
    this.state = {
      categoriesFilter: categoriesFilter,
      brandFilter: brandFilter
    };

    this.render();
    this.getSubElements();
    this.update(this.state)
  }

  getTemplate(){
    return `
        <aside class="filters">
          <div class="filters__header">
            <h2 class="filters__name">Filters</h2>
            <button class="filters__hide-btn">
              <img src="img/chevrons-left.svg" alt="hide">
            </button>
          </div>
          <div class="filters__content" data-element="body"></div>
          <button class="filters__reset-btn" data-element="btn">Clear all filters</button>
        </aside>
    `;
  }

  render(){
    const wrapper = document.createElement('div');

    wrapper.innerHTML  = this.getTemplate();

    this.element = wrapper.firstElementChild;
  }

  getSubElements(){
    const result = {};
    const elements = this.element.querySelectorAll('[data-element]');

    for(const subElement of elements){
      const name = subElement.dataset.element;

      result[name] = subElement;
    }

    this.subElements = result;
  }

  update(filters = {}){
    Object.values(filters).forEach(list => {
      console.log(typeof list[0].value);
      const title = list[0].value.split("=")[0].slice(0,1).toUpperCase() + list[0].value.split("=")[0].slice(1);
      const filtersList = new FiltersList({
        title: title,
        list
      });
      this.subElements.body.append(filtersList.element);

      filtersList.element.addEventListener('change', event => {
        filtersList.check(event.target);
      });

      this.subElements.btn.addEventListener('click', () => {
        filtersList.reset();
      })
    });
  }

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
