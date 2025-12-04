import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { initializeApp } from 'firebase/app';
import { getDatabase} from 'firebase/database';


const firebaseConfig = {
  apiKey: "AIzaSyAP8pAQfeCU54ZJ8rUvzCyye0DJoDd6uHg",
  authDomain: "info-340-project-mumtaz-angel.firebaseapp.com",
  databaseURL: "https://info-340-project-mumtaz-angel-default-rtdb.firebaseio.com",
  projectId: "info-340-project-mumtaz-angel",
  storageBucket: "info-340-project-mumtaz-angel.firebasestorage.app",
  messagingSenderId: "696112293840",
  appId: "1:696112293840:web:2baf89376ea6166e8fbbd5"
};

export const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
);

