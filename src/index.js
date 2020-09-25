import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
// import RegisFormAllCourses from './components/RegisFormAllCourses';
import { LiffProvider } from 'react-liff';

const liffId = process.env.REACT_APP_LINE_LIFF_ID;
const stubEnabled = process.env.NODE_ENV !== 'production';

ReactDOM.render(
  <React.StrictMode>
    <LiffProvider liffId={liffId} stubEnabled={stubEnabled}>
      <App />
    </LiffProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
