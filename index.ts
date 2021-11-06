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
    this.element.addEventListener('keydown', this.keydownRef);
  }

  private keydown(event: any) {
    const key = event.key as string;
  }

  private keyup() {}

  private blur() {}
}

const input = document.getElementById('input') as HTMLInputElement;

const numeric = new NumericInput(input);
