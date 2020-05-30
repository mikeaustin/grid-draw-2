/* eslint @typescript-eslint/no-unused-vars: "off" */

import React from 'react';
import { AppRegistry } from 'react-native-web';

import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

// if (process.env.NODE_ENV === 'development') {
//   const whyDidYouRender = require('@welldone-software/why-did-you-render');

//   whyDidYouRender(React, {
//     trackAllPureComponents: true,
//   });
// }

AppRegistry.registerComponent('App', () => props => (
  <App {...props} />
));

AppRegistry.runApplication('App', {
  initialProps: {},
  rootTag: document.getElementById('root')
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();


// const sub = (a: number, b: number) => a - b;
// const sub = (a: string, b: string) => a;

function add(a: number, b: number): number;
function add(a: string, b: string): string;

function add(a: any, b: any): any {
  return a + b;
}

// console.log(add(3, 2));

function method(types: any[], f: Function, cont?: Function) {
  return (...args) => {
    if (args.every((arg, index) => (
      arg.valueOf() === types[index].valueOf() || arg.constructor === types[index]
    ))) {
      return f(...args);
    }

    if (cont) {
      return cont(...args);
    }

    throw new Error('No match');
  };
}

function method2(types: any[], f: Function) {
  return (...args) => {
    if (args.every((arg, index) => (
      arg.valueOf() === types[index].valueOf() || arg.constructor === types[index]
    ))) {
      return f(...args);
    }

    // throw new Error('No match');
    return null;
  };
}

function multi2(method, delegate) {
  return (...args) => {
    const result = method(...args);

    if (result !== null) {
      return result;
    }

    if (delegate) {
      return delegate(...args);
    }

    throw new Error('No match');
  };
}

const add2 = method([Number, Number], (a, b) => a + b);
const add3 = method([1, 2], () => 3, add2);
const add4 = method([String, Number], (a, b) => 100, add3);

// console.log('>>>', add3(1, 2));
// console.log('>>>', add3(2, 3));
// console.log('>>>', add4('x', 3));

const add5 = method([Number, Number], (a, b) => a + b);
const add6 = multi2(method([1, 2], () => 3), add5);


// function add<T>(a: T, b: T): T {
//   return a + b;
// }
