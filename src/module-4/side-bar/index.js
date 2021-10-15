import FiltersList from '../filters-list/index.js';
import DoubleSlider from '../../module-5/double-slider/index.js'

export default class SideBar {
  element;
  subElements;
  components = {filters: [],sliders: []};
  constructor ({filters = {}, sliders = {}} = {}) {
    this.state = {
      filters: filters,
      sliders: sliders
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

  update({filters = {}, sliders = {}} = {}){
    Object.values(sliders).forEach(slider => {
      const doubleSlider = new DoubleSlider(slider);
      this.components.sliders.push(doubleSlider);

      this.subElements.body.append(doubleSlider.element);

      this.subElements.btn.addEventListener('click', () => {
        doubleSlider.reset();
      })
    });

    Object.values(filters).forEach(list => {
      const title = list[0].value.split("=")[0].slice(0,1).toUpperCase() + list[0].value.split("=")[0].slice(1);
      const filtersList = new FiltersList({
        title: title,
        list
      });
      this.components.filters.push(filtersList);

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
