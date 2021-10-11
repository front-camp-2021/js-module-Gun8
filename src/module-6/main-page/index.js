import Pagination from '../../module-5/pagination/index.js';
import SideBar from '../../module-4/side-bar/index.js';
import CardsList from '../../module-3/cards-list-v1/index.js';
import Card from '../../module-2/card/index.js';
import Search from '../search/index.js';
import { request } from './request/index.js';
import { prepareFilters } from './prepare-filters/index.js';
import {prepareSlider} from './prepare-slider/index.js';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';

export default class Page {
  element;
  subElements = {};
  components = {};
  pageLimit = 12;
  totalPages = 100;
  filters = new URLSearchParams();

  constructor() {
    this.state = {
      filters: [
        {
          name:'categories',
          field: 'category'
        },
        {
          name: 'brands',
          field: 'brand'
        }],
      sliders: [{
        name: 'products',
        field: 'price'
      }]
    };
    this.filters.set('_page', '1');
    this.filters.set('_limit', this.pageLimit);

    this.render();
    this.getSubElements();
    this.update();
  }

  get template () {
    return `
      <div>
        ${this.getHeader()}
        <section class="catalog" data-element="catalog"></section>
      </div>
    `
  }

  getHeader = () => {
    return `
      <header class="header">
        <div class = "logo">
          <img class="logo__img" src="img/logo.png" alt="logo">
          <h1 class="logo__name">Online Store</h1>
        </div>
        <ul class="breadcrumb">
          <li class="breadcrumb__item"><a href="#"><img src="img/home.svg" alt="home"></a></li>
          <li class="breadcrumb__item"><a href="#">eCommerce</a></li>
          <li class="breadcrumb__item breadcrumb__item_cur-page"><a href="#">Electronics</a></li>
        </ul>
      </header>  
    `
  };

  getItemListContainer = () => {
    return `<div class="item-list-container" data-element="container"></div>`;
  };

  getItemListHeader = () => {
    return `
      <div class="item-list-header">
        <p class="item-list-header__counter">7,618 results found</p>
        <button class="item-list-header__like-btn">
          <img src="img/like.svg" alt="like">
        </button>
      </div>
    `;
  };

  getSideBar = async () => {
    const filters = await this.getFilters();
    const sliders = await this.getSliders();

    this.components.sidebar = new SideBar({filters,sliders});
    this.components.filters = this.components.sidebar.components.filters;
    this.components.sliders = this.components.sidebar.components.sliders;

    this.subElements.sidebar = this.components.sidebar.subElements;
    this.subElements.filters = [];
    this.subElements.sliders = [];
    this.components.filters.forEach(filter => this.subElements.filters.push(filter.subElements));
    this.components.sliders.forEach(slider => this.subElements.sliders.push(slider.subElements));

    this.subElements.sidebar.btn.addEventListener('click', this.updateCardList);
    this.subElements.filters.forEach(filter => filter.list.addEventListener('change',this.updateCardList));
    this.subElements.sliders.forEach(slider => {
      slider.thumbLeft.addEventListener('mouseup',this.updateCardList);
      slider.thumbRight.addEventListener('mouseup',this.updateCardList);
    });

    return this.components.sidebar;
  };

  getFilters = async () => {
    const {filters} = this.state;
    const filtersData = {};

    for(let i = 0; i < filters.length; i++){
      const url = new URL(filters[i].name, BACKEND_URL);
      const data = prepareFilters(await request(url),filters[i].field);

      filtersData[filters[i].name] = data;
    }

    return filtersData;
  };

  getSliders = async () => {
    const {sliders} = this.state;
    const slidersData = {};

    for(let i = 0; i < sliders.length; i++){
      const url = new URL(sliders[i].name, BACKEND_URL);
      const data = prepareSlider(await request(url), sliders[i].field);

      slidersData[sliders[i].field] = data;
    }

    return slidersData;
  };

  getFilteredCardList = async () => {
    const url = new URL('products', BACKEND_URL);
    const data = this.filterCards(await request(url));
    const pageData = [];

    const limit = Math.min(this.pageLimit, data.length);

    for(let i = 0; i < limit; i++){
      pageData.push(data[i]);
    }

    this.components.cardList = new CardsList({data: pageData,Component: Card});


    return this.components.cardList;
  };

  filterCards = (data) => {
    this.components.filters.forEach(filter => {
      const checked = filter.state.list.filter(item => item.checked);

      if(checked.length !== 0){
        const names = checked.map(item => item.value.split('=')[1]);
        const field = checked[0].value.split('=')[0];

        data = data.filter(item => names.includes(item[field]));
      }
    });

    this.components.sliders.forEach(slider => {
      const {from,to} = slider.state.selected;
      console.log(from);
      data = data.filter(item => item.price >= from && item.price <= to);
    });
    console.log(data);

    return data;
  };

  render() {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = this.template;

    this.element = wrapper.firstElementChild;
  }

  update = async () => {
    const sidebar = await this.getSideBar();

    this.subElements.mainPage.catalog.append(sidebar.element);
    this.subElements.mainPage.catalog.append(this.turnTextIntoElement(this.getItemListContainer()));

    this.getSubElements();

    this.subElements.mainPage.container.append(this.turnTextIntoElement(this.getItemListHeader()));
    this.subElements.mainPage.container.append(new Search().element);

    this.updateCardList();

  };

  updateCardList = async () => {
    const cardList = await this.getFilteredCardList();
    const itemList = document.querySelector('.item-list');

    if(itemList){
      itemList.remove();
    }
    this.subElements.mainPage.container.append(cardList.element);
  };

  turnTextIntoElement(text){
    const wrapper = document.createElement('div');

    wrapper.innerHTML = text;

    return wrapper.firstElementChild;
  }

  getSubElements(){
    const result = {};
    const elements = this.element.querySelectorAll('[data-element]');

    for(const subElement of elements){
      const name = subElement.dataset.element;

      result[name] = subElement;
    }

    this.subElements.mainPage = result;
  }

  remove () {
    // ... your logic
  }

  destroy () {
    // ... your logic
  }
}
