export default class CardsList {
  subElements;
  constructor ({data = [], Component = {}}) {
    this.data = data;
    this.Component = Component;

    this.render();
    this.getSubElements();
    this.update({data,Component});
    this.getSubElements();
  }

  getTemplate (){
    return '<div class="item-list" data-element="cards"></div>'
  }

  render(){
    const wrapper = document.createElement('div');

    wrapper.innerHTML  = this.getTemplate();

    this.element = wrapper;
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

  update({data = [], Component = {}}){
    this.data = data;
    this.Component = Component;

    this.data.forEach(obj =>  this.subElements.cards.append((new this.Component(obj)).element));
  }

  remove(){
    if(this.element){
      this.element.remove();
    }
  }

  destroy(){
    this.remove();
    this.element = null;
  }
}


