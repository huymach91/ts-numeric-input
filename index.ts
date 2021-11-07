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
  private isNumberKey: boolean;
  private isRemoveKey: boolean = false;
  private isPaste: boolean = false;
  private isSeprator: boolean = false;

  private fractionalPosition: number;
  private fractionalChar: string;

  constructor(
    private element: HTMLInputElement,
    private optional: INumericInputOptional = {
      separator: ',',
      fractionDigits: 2,
    }
  ) {
    this.fractionalChar = this.optional.separator === ',' ? '.' : ',';
    this.separatorKeys = this.optional.fractionDigits
      ? ['.', ',']
      : [this.optional.separator];
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
    const isCut = event.ctrlKey && key === 'x';
    const isUndo = event.ctrlKey && key === 'z';
    // reset
    this.isRemoveKey = false;
    this.isNumberKey = false;
    this.isArrowKey = false;
    this.isPaste = false;
    this.isSeprator = false;

    this.currentCaret = -1;
    this.priorValue = '';

    // case 1: not match any conditions below
    if (
      !/\d+/.test(key) &&
      !this.arrowKeys.includes(key) &&
      !this.removeKeys.includes(key) &&
      !this.moveKeys.includes(key) &&
      !isSelect &&
      !isCopy &&
      !isPaste &&
      !isCut &&
      !isUndo
    ) {
      event.preventDefault();
      return false;
    }

    // case 2: input's caret after separator with remove keys
    const value = this.element.value;
    const currentCaret = this.element.selectionStart;
    const previousChar = value[currentCaret - 1];
    // only move caret to previous it's position
    // if match condition below
    if (this.removeKeys.includes(key) && previousChar === this.fractionalChar) {
      const valueAtCaret = value[currentCaret];
      event.preventDefault();
      const newCaret = currentCaret - 1;
      this.element.setSelectionRange(newCaret, newCaret);
      // undefined
      if (!valueAtCaret) {
        this.insertChar(newCaret, '');
      }
      return false;
    }

    // case 3: with fractional digits > 0
    const isNumberKey = /\d/g.test(key);
    if (
      this.optional.fractionDigits > 0 &&
      this.fractionalPosition &&
      this.fractionalPosition !== -1 &&
      isNumberKey &&
      currentCaret > this.fractionalPosition
    ) {
      this.insertChar(currentCaret, key);
      event.preventDefault();
      return false;
    }

    this.isNumberKey = isNumberKey;
    this.isRemoveKey = this.removeKeys.includes(key);
    this.isArrowKey = this.arrowKeys.includes(key);
    this.isPaste = isPaste;
    this.isSeprator = this.separatorKeys.includes(key);

    this.currentCaret = currentCaret;
    this.priorValue = this.element.value;
  }

  private keyup(event: any) {
    if (
      !this.isNumberKey &&
      !this.isRemoveKey &&
      !this.isPaste &&
      !this.isSeprator
    )
      return;
    const unformatted = event.target.value.replace(
      new RegExp(this.optional.separator),
      ''
    ); // clear the current format
    const value = event.target.value
      ? Number(unformatted).toFixed(this.optional.fractionDigits)
      : '';
    const formatted = this.formatted(value);
    this.element.value = formatted;
    // move and remove previous it's caret
    this.keepCaretIfSeparator(formatted);
    // update fractional position
    this.fractionalPosition = formatted.split('').indexOf(this.fractionalChar);
  }

  private formatted(value: string) {
    const pureValue = value.replace(
      new RegExp(this.optional.separator, 'gi'),
      ''
    );
    return this.formatNumber(pureValue);
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
    if (this.isNumberKey || this.isRemoveKey) {
      let diff = this.element.value.length - this.priorValue.length; // difference of # chars between before and after being formatted
      if (!this.priorValue) {
        diff -= this.optional.fractionDigits + 1;
      }
      let caret = this.currentCaret + diff; // new caret after formatted
      const currentChar = formatted.charAt(caret - 1); // commas char
      if (currentChar === this.optional.separator && this.isRemoveKey) {
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
}

const input = document.getElementById('input') as HTMLInputElement;

new NumericInput(input);
