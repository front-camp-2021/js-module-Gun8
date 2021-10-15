export default class Card {
  element;

  constructor ({
    id = '',
    images = [],
    title = '',
    rating = 0,
    price = 0,
    category = '',
    brand = ''
  } = {}) {
    this.id = id;
    this.images = images;
    this.title = title;
    this.rating = rating;
    this.price = price;
    this.category = category;
    this.brand = brand;

    this.render();
  }

  getTemplate () {
    return `<div class="item" id = ${this.id}>
        <div class="item__img" style="background-image: url(${this.images[0]});"></div>
        <div class="item__inform">
          <div class="item__rating">
            <span>${this.rating}</span>
            <img src="img/star.svg" alt="star">
          </div>
          <div class="item__price">${this.price + ' UAH'}</div>
        </div>
        <div class="item__description">
          <h2>${this.title}</h2>
          <p>${this.brand}</p>
        </div>
        <div class="item__buttons">
          <button>
            <img src="img/black-heart.svg" alt="like">
            wishlist
          </button>
          <button>
            <img src="img/shopping-bag.png" alt="like">
            add to cart
          </button>
        </div>
      </div>`
  }

  render () {
      const card = document.createElement('div');

      card.innerHTML = this.getTemplate();

      this.element = card.firstElementChild;
  }
}
