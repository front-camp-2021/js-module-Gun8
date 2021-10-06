export default class DoubleSlider {
  element;
  subElements;

  constructor({
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

    this.shift = null;

    this.render();
    this.getSubElements();
    this.onDragThumb();
    this.onMouseMoveLeftThumb = this.onMouseMoveLeftThumb.bind(this);
    this.onMouseMoveRightThumb = this.onMouseMoveRightThumb.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
  }

  getTemplate() {
    return `
        <div class="range-slider">
           <span>$${this.state.selected.from}</span>
              <div class="range-slider__inner" data-element="body">
                <span data-element="progress" class="range-slider__progress"></span>
                <span data-element="thumbLeft" class="range-slider__thumb-left"></span>
                <span data-element="thumbRight" class="range-slider__thumb-right"></span>
              </div>
           <span>$${this.state.selected.to}</span> 
        </div>
    `;
  }

  render() {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = this.getTemplate();

    this.element = wrapper.firstElementChild;
  }

  updateRange = (from,to) => {
    this.element.firstElementChild.innerHTML = '$' + from;
    this.element.lastElementChild.innerHTML = '$' + to;
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
    this.render();
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

  onMouseUp(){
    const thumbLeft = this.subElements.thumbLeft;
    const thumbRight= this.subElements.thumbRight;
    const body = this.subElements.body;
    const {min,max} = this.state;

    document.removeEventListener('mouseup', this.onMouseUp);
    document.removeEventListener('mousemove', this.onMouseMoveLeftThumb);
    document.removeEventListener('mousemove', this.onMouseMoveRightThumb);

    this.state.selected.from = Math.round(thumbLeft.offsetLeft / body.offsetWidth * (max - min) + min);
    this.state.selected.to = Math.round(thumbRight.offsetLeft / body.offsetWidth * (max - min) + min);
    this.shift = null;
  }

  onMouseMoveLeftThumb(){
    const {min,max, selected} = this.state;
    const body = this.subElements.body;
    const thumbRight = this.subElements.thumbRight;
    const thumbLeft = this.subElements.thumbLeft;
    const progress = this.subElements.progress;
    const rightEdge = thumbRight.offsetLeft;

    let newLeft = ((selected.from - min)/(max - min)) * body.offsetWidth + event.clientX - this.shift;

    if (newLeft < 0) {
      newLeft = 0;
    }

    if (newLeft > rightEdge) {
      newLeft = rightEdge;
    }

    thumbLeft.style.left =   newLeft + 'px';
    progress.style.left =   newLeft + 'px';

    const from = Math.round(newLeft / body.offsetWidth * (max - min) + min );
    const to = Math.round(rightEdge / body.offsetWidth * (max - min) + min);
    this.updateRange(from, to);
  };

  onMouseMoveRightThumb(){
    const {min,max, selected} = this.state;
    const body = this.subElements.body;
    const thumbRight = this.subElements.thumbRight;
    const thumbLeft = this.subElements.thumbLeft;
    const progress = this.subElements.progress;
    const leftEdge = thumbLeft.offsetLeft;
    const thumbWidth = thumbLeft.offsetWidth;

    let newRight = ((max - selected.to)/(max - min)) * body.offsetWidth - event.clientX + this.shift;

    if (newRight <= 0) {
      newRight = 0;
    }

    if (body.offsetWidth - newRight < leftEdge + thumbWidth) {
      newRight = body.offsetWidth - leftEdge - thumbWidth ;
    }

    thumbRight.style.right =   newRight + 'px';
    progress.style.right =   newRight + 'px';

    const from = Math.round((leftEdge + thumbWidth) / body.offsetWidth * (max - min) + min );
    const to = Math.round(newRight / body.offsetWidth * ( min - max) + max);

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
