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
    const allowKeys = [
      'ArrowLeft',
      'ArrowUp',
      'ArrowDown',
      'ArrowRight',
      'Backspace',
      'Delete',
    ];
    if (!/\d+/.test(key) && !allowKeys.includes(key)) {
      event.preventDefault();
      return false;
    }
  }

  private keyup(event: any) {
    const formatted = this.formatNumber(event.target.value.replace(/,/g, ''));
    this.element.value = formatted;
  }

  private formatNumber(num: string, separator: ',' | '.' = ',') {
    return num.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + separator);
  }
}

const input = document.getElementById('input') as HTMLInputElement;

const numeric = new NumericInput(input);
