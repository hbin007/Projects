import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const AlarmSetting = () => {
    const [pushStatus, setPushStatus] = useState(true);
    const [receiveStatus, setReceiveStatus] = useState(true);

    const onPushChangeToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPushStatus(!pushStatus);
    }
    const onReceiveChangeToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setReceiveStatus(!receiveStatus);
    }

    return (
        <div>
            <div className='flex flex-col mt-8 mx-20'>
                <div className='flex items-center mb-6'>
                    <img className='w-7 h-7 md:w-auto md:h-auto' src="img/AlarmSettings.png" alt="" />
                    <p className='text-lg font-bold md:text-xl ml-1 text-[#5F5F5F]'>알림설정</p>
                </div>
                <div className='mb-7 w-28 h-8 md:w-40 md:h-10 rounded-lg bg-gray-100 items-center'>
                    <Link to={'/setting'} className='flex justify-center items-center w-full h-full'>
                        <p className='text-[#5F5F5F] font-bold'>뒤로</p>
                        <p> </p>
                    </Link>
                </div>
                <div className='flex justify-between mt-8 font-semibold text-xl text-slate-700'>
                    <p> </p>
                    <p>PUSH 알림</p>
                    <div className='flex gap-1 items-center'>
                        <div className='relative inline-block w-12 mr-2 align-middle'>
                            <input type="checkbox" name='toggle' id='toggle' onChange={onPushChangeToggle} checked={pushStatus}
                                className={pushStatus ? `left-0 bg-white absolute block w-7 h-7 rounded-full border-4 appearance-none cursor-pointer`
                                    : `right-0 duration-200 ease-in absolute block w-7 h-7 rounded-full bg-yellow-point border-4 outline-none appearance-none cursor-pointer`} />
                            <label htmlFor="toggle" className='block overflow-hidden h-7 rounded-full bg-gray-300 cursor-pointer'></label>
                        </div>
                    </div>
                </div>
                <div className='flex justify-between mt-6 font-semibold text-xl text-slate-700'>
                    <p> </p>
                    <p>수신 편지 알림</p>
                    <div className='flex gap-1 items-center'>
                        <div className='relative inline-block w-12 mr-2 align-middle'>
                            <input type="checkbox" name='receiveToggle' id='receiveToggle' onChange={onReceiveChangeToggle} checked={receiveStatus}
                                className={receiveStatus ? `left-0 bg-white absolute block w-7 h-7 rounded-full border-4 appearance-none cursor-pointer`
                                    : `right-0 duration-200 ease-in absolute block w-7 h-7 rounded-full bg-yellow-point border-4 outline-none appearance-none cursor-pointer`} />
                            <label htmlFor="receiveToggle" className='block overflow-hidden h-7 rounded-full bg-gray-300 cursor-pointer'></label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AlarmSetting