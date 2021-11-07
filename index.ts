// Import stylesheets
import './style.css';

export interface INumericInputOptional {
  separator: ',' | '.';
  fractionDigits: number;
}

class NumericInput {
  private keydownRef: any;
  private keyupRef: any;
  private arrowKeys = ['ArrowLeft', 'ArrowRight'];
  private removeKeys = ['Backspace', 'Delete'];
  private moveKeys = ['Home', 'End'];
  private separatorKeys = ['.', ','];
  private currentCaret: number = -1;
  private priorValue: string = '';

  private isArrowKey: boolean = false;
  private isNumberTyping: boolean;
  private isRemoveTyping: boolean = false;
  private isPaste: boolean = false;
  private isSeprator: boolean = false;

  constructor(
    private element: HTMLInputElement,
    private optional: INumericInputOptional = {
      separator: ',',
      fractionDigits: 2,
    }
  ) {
    this.init();
  }

  private init() {
    this.keydownRef = this.keydown.bind(this);
    this.keyupRef = this.keyup.bind(this);
    this.element.addEventListener('keydown', this.keydownRef);
    this.element.addEventListener('keyup', this.keyupRef);
  }

  private keydown(event: KeyboardEvent) {
    const key = event.key as string;
    const isSelect = event.ctrlKey && key === 'a';
    const isCopy = event.ctrlKey && key === 'c';
    const isPaste = event.ctrlKey && key === 'v';

    if (
      !/\d+/.test(key) &&
      !this.arrowKeys.includes(key) &&
      !this.removeKeys.includes(key) &&
      !this.moveKeys.includes(key) &&
      !isSelect &&
      !isCopy &&
      !isPaste &&
      !this.separatorKeys.includes(key)
    ) {
      event.preventDefault();
      return false;
    }

    this.isNumberTyping = /\d/g.test(key);
    this.isRemoveTyping = this.removeKeys.includes(key);
    this.isArrowKey = this.arrowKeys.includes(key);
    this.isPaste = isPaste;
    this.isSeprator = this.separatorKeys.includes(key);

    this.currentCaret = this.element.selectionStart;
    this.priorValue = this.element.value;
  }

  private keyup(event: any) {
    if (
      !this.isNumberTyping &&
      !this.isRemoveTyping &&
      !this.isPaste &&
      !this.isSeprator
    )
      return;
    this.formatted(event.target.value);
  }

  private formatted(value: string) {
    const pureValue = value.replace(
      new RegExp(this.optional.separator, 'gi'),
      ''
    );
    const formatted = this.formatNumber(pureValue);
    this.element.value = formatted;
    this.keepCaretIfSeparator(formatted);
    this.moveCaretIfFactionalDigit(formatted);
  }

  private insertChar(position: number, insertValue: string) {
    this.element.setRangeText(insertValue, position, position + 1);
  }

  private formatNumber(num: string) {
    return num
      .toString()
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + this.optional.separator);
  }

  /*
    summary: this function solves the case of current caret which is putted before the commas (,) or separator
    @param: formatted, ex: 1,200
    @param: separator can be ',' or '.'
  */
  private keepCaretIfSeparator(formatted: string) {
    if (this.isNumberTyping || this.isRemoveTyping) {
      const diff = this.element.value.length - this.priorValue.length; // difference of # chars between before and after being formatted
      let caret = this.currentCaret + diff; // new caret after formatted
      const currentChar = formatted.charAt(caret - 1); // commas char
      if (currentChar === this.optional.separator && this.isRemoveTyping) {
        this.insertChar(caret - 2, '');
        caret -= 1;
        const char = this.element.value.charAt(caret - 2); // if this char was empty
        if (char === '') {
          this.insertChar(caret - 1, '');
          caret = 0;
        }
      }
      setTimeout(() => {
        this.element.setSelectionRange(caret, caret);
      });
    }
  }

  private moveCaretIfFactionalDigit(formatted: string) {
    if (this.isNumberTyping || this.isRemoveTyping) {
      const diff = this.element.value.length - this.priorValue.length; // difference of # chars between before and after being formatted
      let caret = this.currentCaret + diff; // new caret after formatted
      const currentChar = formatted.charAt(caret - 1); // dot char
      const fractionChar = this.optional.separator === ',' ? '.' : ',';
      if (currentChar === fractionChar && this.isRemoveTyping) {
        const newCaret = caret - 2;
        this.element.setSelectionRange(newCaret, newCaret);
      }
    }
  }
}

const input = document.getElementById('input') as HTMLInputElement;

new NumericInput(input);
