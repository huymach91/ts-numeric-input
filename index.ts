// Import stylesheets
import './style.css';

class NumericInput {
  private keydownRef: any;
  private keyupRef: any;
  private allowControlKeys = [
    'ArrowLeft',
    'ArrowUp',
    'ArrowDown',
    'ArrowRight',
    'Backspace',
    'Delete',
  ];
  private isControlKey: boolean = false;

  constructor(
    private element: HTMLInputElement,
    private optional: { separator: ',' | '.' } = { separator: ',' }
  ) {
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
    if (!/\d+/.test(key) && !this.allowControlKeys.includes(key)) {
      event.preventDefault();
      return false;
    }

    this.isControlKey = this.allowControlKeys.includes(key);
  }

  private keyup(event: any) {
    if (this.isControlKey) return;
    this.clearSeparator();
    setTimeout(() => {
      const value2 = this.element.value as string;
      console.log(value2);
      for (let i = value2.length - 3; i > 0; i -= 3) {
        this.insertSeparator(i, this.optional.separator);
      }
    }, 10);
  }

  private insertSeparator(position: number, insertValue: string) {
    this.element.setRangeText(insertValue, position, position);
  }

  private clearSeparator() {
    for (let i = 0; i < this.element.value.length; i++) {
      if (this.element.value[i] === this.optional.separator) {
        console.log(i);
        this.element.setRangeText('', i, i + 1);
      }
    }
  }
}

const input = document.getElementById('input') as HTMLInputElement;

const numeric = new NumericInput(input);
