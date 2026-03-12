// App.js
import './App.css';
import Home from './01/Home';
import Portfolio from './01/Portfolio';
import Contact from './01/Contact';

import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';

function AppContent() {
  const currentLocation = useLocation();

  return (
    <div>
      <header>
        <ul className='navi'>
          <li>
            <NavLink
              to='/siisat'
              className={({ isActive }) => isActive ? 'nav-link nav-link--active' : 'nav-link'}
              onClick={(e) => {
                if (currentLocation.pathname === '/siisat') {
                  e.preventDefault();
                  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                }
              }}
            >
              siisat
            </NavLink>
          </li>
          <li>
            <NavLink
              to='/'
              className={({ isActive }) => isActive ? 'nav-link nav-link--active' : 'nav-link'}
              onClick={(e) => {
                if (currentLocation.pathname === '/') {
                  e.preventDefault();
                  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                }
              }}
            >
              portfolio
            </NavLink>
          </li>
          <li>
            <NavLink
              to='/Contact'
              className={({ isActive }) => isActive ? 'nav-link nav-link--active' : 'nav-link'}
              onClick={(e) => {
                if (currentLocation.pathname === '/Contact') {
                  e.preventDefault();
                  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                }
              }}
            >
              contact
            </NavLink>
          </li>
        </ul>
      </header>

      <main>
        <Routes>
          <Route path='/siisat' element={<Home />} />
          <Route path='/' element={<Portfolio />} />
          <Route path='/Contact' element={<Contact />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
