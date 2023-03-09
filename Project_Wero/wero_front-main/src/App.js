import React, { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import FindPw from './components/login_page/FindPw';
import FindId from './components/login_page/FindId';
import LoginPage from './components/login_page/LoginPage';
import SignUp from './components/login_page/SignUp';
import MainPage from './components/MainPage';

const App = props => {
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('user_id') === null) {
    } else {
      setIsLogin(true)
    }
  })

  return (
    <div className='font-sans'>
      {
        isLogin ?
          <MainPage /> :
          <BrowserRouter>
            <Routes>
              < Route path='/' element={< LoginPage />} />
              < Route path='/signUp' element={< SignUp />} />
              < Route path='/findId' element={< FindId />} />
              < Route path='/findPw' element={< FindPw />} />
            </ Routes>
          </ BrowserRouter>
      }</ div>
  );
}

export default App