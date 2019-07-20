export class Debounce {
  t;
  constructor() {
    this.t = null;
  }

  debounce = (fn, delay) => {
    if (this.t) {
      clearTimeout(this.t);
      this.t = null
    }
    this.t = setTimeout(() => {
      fn();
    }, delay);
  }
}
