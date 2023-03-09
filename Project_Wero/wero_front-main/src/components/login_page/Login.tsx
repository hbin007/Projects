import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const Login = () => {
  const BaseUrl = "/api/user/login";


    const focusRef = useRef<HTMLInputElement>(null);

    const [values, setValues] = useState({
        id: "",
        password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = () => {
        fetch(BaseUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userCreatedWhen: "",
                userEmail: "",
                userId: values.id,
                userNickName: "",
                userNotify: true,
                userPw: values.password,
            }),
        })
            .then((resp) => resp.json())
            .then((resp) => {
                if (Object.keys(resp).includes("message")) {
                    alert(resp.message);
                } else {
                    localStorage.setItem("token", resp.token);
                    localStorage.setItem("user_id", values.id);
                    document.location.href = "/";
                }
            });
    };

  useEffect(() => {
    focusRef.current!.focus();
  }, []);

  const onEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
      <div className="flex flex-col items-center">
        <div>
            <div className='flex flex-col items-center'>
                <div>
                    <input type='text'
                        name='id'
                        value={values.id}
                        onChange={handleChange}
                        className="h-12 my-3 border-b border-[#4F4F4F] border-solid w-72 md:w-96 text-[#4F4F4F] placeholder-[#787878] outline-none"
                        placeholder='ID'
                        ref={focusRef}
                    />
                </div>
                <div>
                    <input type='password'
                        name='password'
                        value={values.password}
                        onChange={handleChange}
                        onKeyDown={onEnter}
                        className="h-12 my-3 border-b border-[#4F4F4F] w-72 md:w-96 text-[#4F4F4F] placeholder-[#787878] outline-none"
                        placeholder='Password'
                    />
                </div>
                <div className='flex mb-20 space-x-5 md:space-x-24'>
                    <div className='flex'>
                        <input type="checkbox" name="" id="my-checkbox" />
                        <label htmlFor="my-checkbox" className="mx-1 text-sm text-[#4F4F4F]" >아이디 기억하기</label>
                    </div>
                    <div className='space-x-2 text-xs md:text-sm text-[#4F4F4F]'>
                        <Link to='/findId' className=' border-[#4F4F4F] text-[#4F4F4F]'>아이디 찾기</Link>
                        <Link to='/findPw' className=' border-[#4F4F4F] text-[#4F4F4F]'>비밀번호 찾기</Link>
                    </div>
                </div>
                <button onClick={handleSubmit}
                    className='h-10 text-white bg-black rounded-md w-72 md:w-96 border-slate-300'
                >Log In</button>
            </div>
        </div>
    </div>
  );
};

export default Login;
