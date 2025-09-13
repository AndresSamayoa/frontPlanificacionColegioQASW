import logo from './logo.svg';
import './App.css';
import LoginScreen from './screens/Login/LoginScreen.js';

import 'bootstrap-icons/font/bootstrap-icons.css';
import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';

const Header = lazy(() => import('./components/Header/Header.js'));
const UsersScreen = lazy(() => import('./screens/Users/UsersScreen.js'));
const ResourcesScreen = lazy(() => import('./screens/Resources/ResourcesScreen.js'));
const SchoolYears = lazy(() => import('./screens/SchoolYears/SchoolYearsScreen.js'));
const EvaluationsScreen = lazy(() => import('./screens/Evaluations/EvaluationsScreen.js'));
const CiclesScreen = lazy(() => import('./screens/Cicles/CiclesScreen.js'));
const CoursesScreen = lazy(() => import('./screens/Courses/CoursesScreen.js'));
const AssignationsScreen = lazy(() => import('./screens/Assignations/AssignationsScreen.js'));
const RolsScreen = lazy(() => import('./screens/Rols/RolsScreen.js'));
const SchedualsScreen = lazy(() => import('./screens/Scheduals/SchedualsScreen.js'));

function App() {
  console.log(localStorage.getItem('token'));
  const session = localStorage.getItem('token');

  if (session) {
    return (<>
      <Header />
      <Suspense fallback={<div class="loading">Loading&#8230;</div>}>
      <Routes>
        <Route path='user/crud' element={<UsersScreen />}/>
        <Route path='resource/crud' element={<ResourcesScreen />}/>
        <Route path='schoolYear/crud' element={<SchoolYears />}/>
        <Route path='evaluation/crud' element={<EvaluationsScreen />}/>
        <Route path='cicle/crud' element={<CiclesScreen />}/>
        <Route path='course/crud' element={<CoursesScreen />}/>
        <Route path='assignation/crud' element={<AssignationsScreen />}/>
        <Route path='rol/crud' element={<RolsScreen />}/>
        <Route path='schedual/crud' element={<SchedualsScreen />}/>
        <Route path='/' element={<div className="App">
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
      </div>}/>
      </Routes>
      </Suspense>
    </>);
  } else {
    return <LoginScreen />
  }
}

export default App;
