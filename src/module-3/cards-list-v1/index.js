export default class CardsList {
  constructor ({data = [], Component = {}}) {
    this.data = data;
    this.Component = Component;

    this.render(this.data);
  }

  getTemplate (){
    return `<div class="item-list"></div>`
  }

  render(){
    const wrapper = document.createElement('div');

    wrapper.innerHTML  = this.getTemplate();

    const CardsList = wrapper.querySelector('.item-list');

    this.data.forEach(obj =>  CardsList.appendChild((new this.Component(obj)).element));

    this.element = CardsList;
  }

  update(data = []){
    this.data = data;
    this.remove();
    this.render();
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


