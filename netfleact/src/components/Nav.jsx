// import React from 'react';

// // 컴포넌트 명은 파일명과 동일
// const Nav = props => {
//     return <h1>hello world</h1>
// }

// export default Nav

// rafce
import React, { useEffect, useState } from 'react'
import './Nav.css'


const Nav = props => {
    const [show, handleShow] = useState(false);

    useEffect(() => {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                handleShow(true);
            } else handleShow(false);
        });
    }, []);
    return (
        <div className={`nav ${show && 'nav__black'}`}>
            <img className='nav__logo' src="/images/Netflix_Logo_PMS.png" alt="Netflix Logo" />

            <img className='nav__avatar' src="/images/netflix-profile.jpg" alt="Netflix profile" />
        </div>
    )
}

export default Nav