// Import stylesheets
import './style.css';

class NumericInput {
  keydownRef: any;
  keyupRef: any;

  constructor(private element: HTMLInputElement) {
    this.init();
  }

  private init() {
    this.keydownRef = this.keydown.bind(this);
    this.keyupRef = this.keyup.bind(this);
    this.element.addEventListener('keydown', this.keydownRef);
    this.element.addEventListener('keyup', this.keyupRef);
  }

  private keydown(event: any) {
    const key = event.key as string;
    if (!+key || isNaN(+key)) {
      event.preventDefault();
      return false;
    }
  }

  private keyup(event: any) {
    const value = +event.target.value;
    console.log(value);
  }
}

const input = document.getElementById('input') as HTMLInputElement;

const numeric = new NumericInput(input);
