import { NavLink, Route, Routes } from 'react-router-dom'
import AllLetter from './AllLetter'
import ReadLetter from './ReadLetter'
import NotReadLetter from './NotReadLetter'
import SendLetter from './SendLetter'
import './LetterStorage.css'

const LetterStorge = () => {
    return (

        <div>
            <div className='flex items-center mb-3 ml-10 mt-14 font-bold text-xl md:text-3xl h-auto'>
                <img src="img/Email.png" alt="" className='mr-2 w-8 md:w-10' />
                <h1 className=' text-[#5F5F5F]'>편지보관함</h1>
            </div>
            <br />
            <div className='flex space-x-2 ml-14 text-sm md:space-x-3 md:text-base'>
                <NavLink to='/'><p className='font-semi-bold'>받은 편지</p></NavLink>
                <NavLink to='/read'><p className='font-semi-bold'>읽은 편지</p></NavLink>
                <NavLink to='/notRead'><p className='font-semi-bold'>안읽은 편지</p></NavLink>
                <NavLink to='/send'><p className='font-semi-bold'>보낸 편지</p></NavLink>
            </div>
            <Routes>
                <Route path='/' element={<AllLetter />} />
                <Route path='/read/*' element={<ReadLetter />} />
                <Route path='/notRead/*' element={<NotReadLetter />} />
                <Route path='/send/*' element={<SendLetter />} />
            </Routes>
        </div>
    )
}

export default LetterStorge