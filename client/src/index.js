import React from 'react';
import ReactDOM from 'react-dom';
import axios from "axios";
import './index.css'
import Router from './Router';
import { BrowserRouter } from 'react-router-dom';

axios.defaults.withCredentials = true;

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);