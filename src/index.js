import React from 'react';
import ReactDOM from 'react-dom';

import Routes from './routes';

import './index.css';

import firebase from 'firebase';

var config = {
    apiKey: "AIzaSyD-4pgqQsrKG0jJSSlEWVcBxYkQr5cTw34",
    authDomain: "team-food.firebaseapp.com",
    databaseURL: "https://team-food.firebaseio.com",
    storageBucket: "team-food.appspot.com",
    messagingSenderId: "657467428717"
};
firebase.initializeApp(config);

ReactDOM.render(
	<Routes />,
  document.getElementById('root')
);

if (!Object.values) {
  Object.values = (thing) => {
    return Object.keys(thing).map((key) => {
      return thing[key];
    });
  }
}
