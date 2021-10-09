export default class DoubleSlider {
  element;
  subElements;

  constructor({
                min = 100,
                max = 200,
                formatValue = value => '$' + value,
                selected = {
                  from: min,
                  to: max
                },
                precision = 0,
                filterName = ''
              } = {}) {
    this.state = {
      min,
      max,
      formatValue,
      selected,
      precision,
      filterName
    };

    this.shift = null;

    this.render();
    this.getSubElements();
    this.onDragThumb();
    this.onMouseMoveLeftThumb = this.onMouseMoveLeftThumb.bind(this);
    this.onMouseMoveRightThumb = this.onMouseMoveRightThumb.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
  }

  getTemplate = () => {
    const {filterName} = this.state;
    return `
        <div class="filters__item">
          <h3 class="filters__list-name">${filterName}</h3>
          <div class = "filters__list">
            <div class="range-slider" data-element="body">${this.getSlider()}</div>
          </div> 
        </div>       
    `;
  };

  getSlider = () => {
    const {formatValue, selected} = this.state;
    return `
        <span data-element="from">${formatValue(selected.from)}</span>
        <div class="range-slider__inner" data-element="slider">
          <span data-element="progress" class="range-slider__progress"></span>
          <span data-element="thumbLeft" class="range-slider__thumb-left"></span>
          <span data-element="thumbRight" class="range-slider__thumb-right"></span>
        </div>
        <span data-element="to">${formatValue(selected.to)}</span>
    `
  };

  render() {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = this.getTemplate();

    this.element = wrapper.firstElementChild;
  }

  updateRange = (from,to) => {
    this.subElements.from.innerHTML = this.state.formatValue(from);
    this.subElements.to.innerHTML = this.state.formatValue(to);
  };

  update({
           min = 100,
           max = 200,
           formatValue = value => value,
           selected = {
             from: min,
             to: max
           },
           precision = 0,
           filterName = ''
         } = {}) {
    this.state = {
      min,
      max,
      formatValue,
      selected,
      precision,
      filterName
    };

    this.subElements.body.innerHTML = '';

    this.subElements.body.innerHTML = this.getSlider();

    this.getSubElements();
    this.onDragThumb();
  }

  reset = () => {
    const {min, max} = this.state;

    this.state.selected.from = min;
    this.state.selected.to = max;

    this.update(this.state);
  };

  getSubElements() {
    const result = {};
    const elements = this.element.querySelectorAll('[data-element]');

    for (const subElement of elements) {
      const name = subElement.dataset.element;

      result[name] = subElement;
    }

    this.subElements = result;
  }

  onMouseUp(){
    const thumbLeft = this.subElements.thumbLeft;
    const thumbRight= this.subElements.thumbRight;
    const slider = this.subElements.slider;
    const {min,max,precision} = this.state;

    document.removeEventListener('mouseup', this.onMouseUp);
    document.removeEventListener('mousemove', this.onMouseMoveLeftThumb);
    document.removeEventListener('mousemove', this.onMouseMoveRightThumb);

    this.state.selected.from = Math.round((thumbLeft.offsetLeft / slider.offsetWidth * (max - min) + min)
                                          * Math.pow(10,precision)) / Math.pow(10,precision);
    this.state.selected.to = Math.round((thumbRight.offsetLeft / slider.offsetWidth * (max - min) + min)
                                            * Math.pow(10,precision)) / Math.pow(10,precision);
    this.shift = null;
  }

  onMouseMoveLeftThumb(){
    const {min,max, selected,precision} = this.state;
    const slider = this.subElements.slider;
    const thumbRight = this.subElements.thumbRight;
    const thumbLeft = this.subElements.thumbLeft;
    const progress = this.subElements.progress;
    const rightEdge = thumbRight.offsetLeft;

    let newLeft = ((selected.from - min)/(max - min)) * slider.offsetWidth + event.clientX - this.shift;

    if (newLeft < 0) {
      newLeft = 0;
    }

    if (newLeft > rightEdge) {
      newLeft = rightEdge;
    }

    thumbLeft.style.left =   newLeft + 'px';
    progress.style.left =   newLeft + 'px';

    const from = Math.round((newLeft / slider.offsetWidth * (max - min) + min) * Math.pow(10,precision)) / Math.pow(10,precision);
    const to = Math.round((rightEdge / slider.offsetWidth * (max - min) + min) * Math.pow(10,precision)) /Math.pow(10,precision);
    this.updateRange(from, to);
  };

  onMouseMoveRightThumb(){
    const {min,max, selected,precision} = this.state;
    const slider = this.subElements.slider;
    const thumbRight = this.subElements.thumbRight;
    const thumbLeft = this.subElements.thumbLeft;
    const progress = this.subElements.progress;
    const leftEdge = thumbLeft.offsetLeft;
    const thumbWidth = thumbLeft.offsetWidth;

    let newRight = ((max - selected.to)/(max - min)) * slider.offsetWidth - event.clientX + this.shift;

    if (newRight <= 0) {
      newRight = 0;
    }

    if (slider.offsetWidth - newRight < leftEdge + thumbWidth) {
      newRight = slider.offsetWidth - leftEdge - thumbWidth ;
    }

    thumbRight.style.right =   newRight + 'px';
    progress.style.right =   newRight + 'px';

    const from = Math.round(((leftEdge + thumbWidth) / slider.offsetWidth * (max - min) + min)
                            * Math.pow(10,precision)) / Math.pow(10,precision);
    const to = Math.round((newRight / slider.offsetWidth * ( min - max) + max)
                            * Math.pow(10,precision)) / Math.pow(10,precision);

    this.updateRange(from, to);
  }

  onDragThumb() {
    const thumbLeft = this.subElements.thumbLeft;
    const thumbRight = this.subElements.thumbRight;

    thumbLeft.addEventListener("mousedown", (event) => {
      this.shift = event.clientX;

      document.addEventListener("mousemove",this.onMouseMoveLeftThumb);
      document.addEventListener("mouseup", this.onMouseUp);

    });

    thumbRight.addEventListener("mousedown", (event) => {
      this.shift = event.clientX;

      document.addEventListener("mousemove",this.onMouseMoveRightThumb);
      document.addEventListener("mouseup", this.onMouseUp);
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
