// App.js
import './App.css';
import Home from './01/Home';
import Portfolio from './01/Portfolio';
import Contact from './01/Contact';

import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div>
        <header>
          <ul className='navi'>
            <li>
              <NavLink to='/'
              className={({ isActive }) => isActive ? 'nav-link nav-link--active' : 'nav-link'
              }>siisat</NavLink>
            </li>
            <li>
              <NavLink to='/Portfolio'
              className={({ isActive }) => isActive ? 'nav-link nav-link--active' : 'nav-link'
              }>Portfolio</NavLink>
            </li>
            <li>
              <NavLink to='/Contact'
              className={({ isActive }) => isActive ? 'nav-link nav-link--active' : 'nav-link'
              }>Contact</NavLink>
            </li>
          </ul>
        </header>

        <main>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/Portfolio' element={<Portfolio />} />
            <Route path='/Contact' element={<Contact />} />
          </Routes>
        </main>


      </div>
    </BrowserRouter>
  );
}

export default App;
