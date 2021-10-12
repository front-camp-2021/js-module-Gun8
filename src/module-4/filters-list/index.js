export default class FiltersList {
  element;
  subElements;
  constructor ({
     title = '',
     list = []
  } = {}) {
    this.state = {
      title: title,
      list: list
    };

    this.render();
    this.getSubElements();
    this.update(this.state);
  }

  getTemplate(){
    return `
        <div class="filters__item">
            <h3 class="filters__list-name" data-element="title">${this.state.title}</h3>
            <ul class="filters__list" data-element="list"></ul>
        </div>
    `;
  }

  update({title = '', list = []} = {}){
    this.state = {title,list};

    this.subElements.list.innerHTML = "";
    this.subElements.title.innerHTML = title;

     list.map(item => {
      const wrapper = document.createElement('div');

      wrapper.innerHTML = this.getFiltersListItem(item);

      if(item.checked){
        const input = wrapper.querySelector("input");
        input.checked = true;
        this.check(input);
      }

      this.subElements.list.append(wrapper.firstElementChild);
    })
  }



  getFiltersListItem({value,title}){
    return `
    <li class="filters__list-item">
            <div>
              <input type="checkbox" value="${value.split("=")[1]}" name="${value.split("=")[0]}" id="${value.split("=")[1]}">
              <label for="${value.split("=")[1]}">
                <span class="filters__checkbox"></span>
                <span class="filters__val">${title}</span>
              </label>
            </div>
     </li>
    `
  }

  check(target){
    const title = target.nextElementSibling.lastElementChild.innerHTML;
    this.state.list.forEach(item => {
      if(item.title === title){
        item.checked = target.checked;
      }
    });

    if(target.checked){
      target.nextElementSibling.firstElementChild.classList.add("filters__checkbox_checked");
    }
    else{
      target.nextElementSibling.firstElementChild.classList.remove("filters__checkbox_checked");
    }
  }

  reset(){
    const inputs = this.element.querySelectorAll("input");

    for(let i = 0; i < inputs.length; i++){
      inputs.item(i).checked = false;
      this.check(inputs.item(i));
    }
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
