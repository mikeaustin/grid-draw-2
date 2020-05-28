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
