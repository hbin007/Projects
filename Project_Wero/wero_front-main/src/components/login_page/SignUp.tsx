import React, { useEffect, useRef, useState } from "react";

const SignUp = () => {
    const BaseUrl = "/api/user";
    const focusRef = useRef<HTMLInputElement>(null);
    const [values, setValues] = useState({
        id: "",
        password: "",
        verifyPassword: "",
        nickName: "",
        eMail: "",
    });

    // 입력 값 유효성 검사
    const [effectiveness, setEffectiveness] = useState({
        id: false,
        password: false,
        verifyPassword: false,
        nickName: false,
        eMail: false,
    });
    const isId = (id: string): boolean => {
        const idRegex = /^\w{5,12}$/i;
        return idRegex.test(id);
    };
    const isPassword = (password: string): boolean => {
        const passwordRegex = /^\w{8,12}$/i;
        return passwordRegex.test(password);
    };
    const isVerifyPassword = (
        password: string,
        verifyPassword: string
    ): boolean => {
        return password === verifyPassword;
    };
    const isNickName = (nickName: string): boolean => {
        const nickNameRegex = /^[가-힣a-zA-Z0-9]{2,}$/;
        return nickNameRegex.test(nickName);
    };
    const isEmail = (email: string): boolean => {
        const emailRegex = /^[a-z0-9_+.-]{3,}@([a-z0-9-]+\.)+[a-z0-9]{2,4}$/i;
        return emailRegex.test(email);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value,
        });
        let isGood = false;
        if (e.target.name === "id") {
            isGood = isId(e.target.value);
        } else if (e.target.name === "password") {
            isGood = isPassword(e.target.value);
        } else if (e.target.name === "verifyPassword") {
            isGood = isVerifyPassword(values.password, e.target.value);
        } else if (e.target.name === "nickName") {
            isGood = isNickName(e.target.value);
        } else if (e.target.name === "eMail") {
            isGood = isEmail(e.target.value);
        }
        setEffectiveness({
            ...effectiveness,
            [e.target.name]: isGood,
        });
    };

    const handleSubmit = async () => {
        if (
            effectiveness.id &&
            effectiveness.password &&
            effectiveness.verifyPassword &&
            effectiveness.nickName &&
            effectiveness.eMail
        ) {
            let now = new Date();
            let todayYear = now.getFullYear();
            let todayMonth = now.getMonth() + 1;
            let todayDate = now.getDate();
            let hours = now.getHours();
            let minutes = now.getMinutes();
            const nowDate = `${todayYear}-${todayMonth}-${todayDate} ${hours}:${minutes}`;
            const message = await fetch(BaseUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userCreatedWhen: nowDate,
                    userEmail: values.eMail,
                    userId: values.id,
                    userNickName: values.nickName,
                    userNotify: true,
                    userPw: values.password,
                }),
            })
                .then((resp) => resp.json())
                .then((data) => String(data.message));
            if (message === "이미 존재하는 ID 입니다.") {
                alert(message);
            } else if (message === "이미 존재하는 Email 입니다.") {
                alert(message);
            } else {
                alert("이제 로그인 하여 WeRo를 이용해보세요!!");
                document.location.href = "/";
            }
        } else {
            alert("아직 완성되지 않은 부분이 있어요!");
        }
    };

    useEffect(() => {
        focusRef.current!.focus();
    }, []);
    const onEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSubmit();
        }
    };

    const handleCustomer = () => {
        alert('문의 메일: dlscksgnl@naver.com')
    }

    const commonStyle = "h-12 pl-2 my-3 font-mono text-lg w-96 border-b-2";

    return (
        <div className="flex flex-col items-center">
            <div className="h-screen overflow-y-auto bg-white">
                <div className="mx-60 md:mx-96"></div>
                <div className="ml-10 md:ml-44">
                    <div className="mt-24 text-[#4F4F4F]">
                        <h1 className="text-4xl font-bold">Welcome to We로!</h1>
                        <p className="mt-4 font-semibold">
                            회원이 되어 당신의 이야기를 모두에게 들려주세요
                        </p>
                    </div>
                    <div className="mt-16">
                        <div>
                            <input
                                type="text"
                                name="id"
                                value={values.id}
                                onChange={handleChange}
                                className={
                                    effectiveness.id
                                        ? `${commonStyle} border-gray-400 border-solid`
                                        : `${commonStyle} border-red-700 border-solid`
                                }
                                placeholder="ID"
                                ref={focusRef}
                            />
                            {effectiveness.id === false ? (
                                <p className="font-sans text-sm text-yellow-600">
                                    ID는 영어와 숫자만 가능하고 길이는 5~12에요!
                                </p>
                            ) : null}
                        </div>
                        <div>
                            <input
                                type="password"
                                name="password"
                                value={values.password}
                                onChange={handleChange}
                                className={
                                    effectiveness.password
                                        ? `${commonStyle} border-gray-400 border-solid`
                                        : `${commonStyle} border-red-700 border-solid`
                                }
                                placeholder="Password"
                            />
                            {effectiveness.password === false ? (
                                <p className="font-sans text-sm text-yellow-600">
                                    비밀번호는 영어와 숫자만 가능하고 8~12로
                                    해주세요!
                                </p>
                            ) : null}
                        </div>
                        <div>
                            <input
                                type="password"
                                name="verifyPassword"
                                value={values.verifyPassword}
                                onChange={handleChange}
                                className={
                                    effectiveness.verifyPassword
                                        ? `${commonStyle} border-gray-400 border-solid`
                                        : `${commonStyle} border-red-700 border-solid`
                                }
                                placeholder="VerifyPassword"
                            />
                            {effectiveness.verifyPassword === false ? (
                                <p className="font-sans text-sm text-yellow-600">
                                    비밀번호를 한 번 더 입력해 주세요
                                </p>
                            ) : null}
                        </div>
                        <div>
                            <input
                                type="text"
                                name="nickName"
                                value={values.nickName}
                                onChange={handleChange}
                                className={
                                    effectiveness.nickName
                                        ? `${commonStyle} border-gray-400 border-solid`
                                        : `${commonStyle} border-red-700 border-solid`
                                }
                                placeholder="Nickname"
                            />
                            {effectiveness.nickName === false ? (
                                <p className="font-sans text-sm text-yellow-600">
                                    닉네임은 두 글자 이상으로 정해주세요
                                </p>
                            ) : null}
                        </div>
                    </div>
                    <div>
                        <input
                            type="text"
                            name="eMail"
                            value={values.eMail}
                            onChange={handleChange}
                            onKeyDown={onEnter}
                            className={
                                effectiveness.eMail
                                    ? `${commonStyle} border-gray-400 border-solid`
                                    : `${commonStyle} border-red-700 border-solid`
                            }
                            placeholder="E-mail"
                        />
                        {effectiveness.eMail === false ? (
                            <p className="font-sans text-sm text-yellow-600">
                                이메일을 정확하게 적어주세요!
                            </p>
                        ) : null}
                    </div>
                    {effectiveness.id &&
                        effectiveness.password &&
                        effectiveness.verifyPassword &&
                        effectiveness.nickName &&
                        effectiveness.eMail ? (
                        <div className="mt-10 space-y-2 font-sans text-xl text-stone-500">
                            <p>이제 WeRo의 회원이 될 준비가 끝났어요!</p>
                            <p>아래 버튼을 눌러 WeRo의 회원이 되어보세요!</p>
                        </div>
                    ) : null}
                    <button
                        onClick={handleSubmit}
                        className="mt-16 bg-black rounded-md h-14 text-slate-200 w-96 border-slate-300"
                    >
                        Sign Up
                    </button>
                    <div className="flex">
                        <p onClick={handleCustomer} className="mt-3 text-sm border-b ml-80 border-[#4F4F4F]">
                            고객센터
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
