import logo from './logo.svg';
import './App.css';
import LoginScreen from './screens/Login/LoginScreen';

import 'bootstrap-icons/font/bootstrap-icons.css';
import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';

const Header = lazy(() => import('./components/Header/Header.js'));

function App() {
  console.log(localStorage.getItem('token'));
  const session = localStorage.getItem('token');

  if (session) {
    return (<>
      <Header />
      <Suspense fallback={<div class="loading">Loading&#8230;</div>}>
      <Routes>
        <Route path='user/crud'/>
      </Routes>
      </Suspense>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    </>);
  } else {
    return <LoginScreen />
  }
}

export default App;
