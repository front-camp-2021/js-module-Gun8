export default class Pagination {
  element;
  subElements;

  constructor({
    totalPages = 10,
    currentPage = 1,
  } = {}) {
    this.state = {
      totalPages: totalPages,
      currentPage: currentPage
    };

    this.pageIndex = currentPage - 1;

    this.render();
    this.getSubElements();
    this.update(this.state);
    this.goToPrevPage();
    this.goToNextPage();
  }

  getTemplate = () => {
    return `
      <footer class="pagination">
        <button class="pagination__prev" data-element="prev"></button>
        <ul class="pagination__list" data-element="list"></ul>
        <button class="pagination__next" data-element="next"></button>
      </footer>
    `
  };

  getPageNumItem = (num) => {
    return `<li class="pagination__page-item">${num}</li>`
  };

  render() {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = this.getTemplate();

    this.element = wrapper.firstElementChild;
  }

  update({
           totalPages = 10,
           currentPage = 1,
         } = {}){
    this.state.totalPages = totalPages;
    this.state.currentPage = currentPage;
    this.pageIndex = currentPage - 1;

    const wrapper = document.createElement('div');

    for(let i = 0; i < totalPages; i++){
      wrapper.innerHTML = this.getPageNumItem(i+1);
      this.subElements.list.append(wrapper.firstElementChild);

      if(i === this.pageIndex){
        this.subElements.list.lastElementChild.classList.add("pagination__page-item_active");
      }

      this.subElements.list.lastElementChild.addEventListener('click', this.onPageClick)
    }
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

  onPageClick = (event) => {
    this.subElements.list.querySelector('.pagination__page-item_active').classList.remove('pagination__page-item_active');

    const page = event.target.closest('li');

    page.classList.add('pagination__page-item_active');

    this.state.currentPage = +page.innerHTML;

    this.pageIndex = this.state.currentPage - 1;
  };

  goToPrevPage = () => {
    this.subElements.prev.addEventListener('click', () => {
      if(this.state.currentPage === 1) return;

      this.subElements.list.querySelector('.pagination__page-item_active').classList.remove('pagination__page-item_active');

      this.state.currentPage--;
      this.pageIndex--;

      this.subElements.list.childNodes[this.pageIndex].classList.add('pagination__page-item_active');
    });
  };

  goToNextPage = () => {
    this.subElements.next.addEventListener('click', () => {
      if(this.state.currentPage === this.state.totalPages) return;

      this.subElements.list.querySelector('.pagination__page-item_active').classList.remove('pagination__page-item_active');

      this.state.currentPage++;
      this.pageIndex++;

      this.subElements.list.childNodes[this.pageIndex].classList.add('pagination__page-item_active');
    });
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
