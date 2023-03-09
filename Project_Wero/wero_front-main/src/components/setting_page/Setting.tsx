import React from 'react'
import { Link } from 'react-router-dom'

const Setting = () => {
    return (
        <div>
            <div className='flex flex-col space-y-4 mt-20 mx-24'>
                <Link to={'/setting/userInfo'}>
                    <div className='flex justify-center items-center w-full h-16 rounded-lg bg-gray-100'>
                        <p> </p>
                        <div className='flex items-center'>
                            <img src="img/PersonalSettings.png" alt="" />
                            <p className='ml-1 font-bold text-[#5F5F5F]'>회원정보</p>
                        </div>
                    </div>
                </Link>
                <Link to={'/setting/alarmSetting'}>
                    <div className='flex justify-center items-center w-full h-16 rounded-lg bg-gray-100'>
                        <p> </p>
                        <div className='flex items-center'>
                            <img src="img/AlarmSettings.png" alt="" />
                            <p className='ml-1 font-bold text-[#5F5F5F]'>알림설정</p>
                        </div>
                    </div>
                </Link>
                <Link to={'/setting/service'}>
                    <div className='flex justify-center items-center w-full h-16 rounded-lg bg-gray-100'>
                        <p> </p>
                        <div className='flex items-center'>
                            <img src="img/CustService.png" alt="" />
                            <p className='ml-1 font-bold text-[#5F5F5F]'>고객센터</p>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default Setting