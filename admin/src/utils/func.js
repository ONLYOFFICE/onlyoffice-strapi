/*
 * (c) Copyright Ascensio System SIA 2025
 *
 * MIT Licensed
 */
export const pipe = (...fns) => {
  return (x) => fns.reduce((v, f) => f(v), x);
};

export const compose = (...fns) => {
  return (x) => fns.reduceRight((v, f) => f(v), x);
};

export class Maybe {
  constructor(value) {
    this.value = value;
  }

  bind = function (func) {
    const value = func(this.value);
    return new Maybe(value);
  };

  get value() {
    return this._value;
  }

  set value(val) {
    this._value = val;
  }
}
