import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ChangePersonalInfo = () => {
    const [values, setValues] = useState({
        userCreatedWhen: "",
        id: "",
        notify: true,
        password: "",
        nickName: "",
        eMail: "",
    });
    const [pwValues, setPwValues] = useState({
        password: "",
        newPassword: "",
        checkPassword: "",
    });

    const findUser = "/api/user";
    useEffect(() => {
        fetch(findUser + `/${localStorage.getItem("user_id")}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then((resp) => resp.json())
            .then((resp) =>
                setValues({
                    ...values,
                    userCreatedWhen: resp.userCreatedWhen,
                    id: resp.userId,
                    notify: resp.userNotify,
                    eMail: resp.userEmail,
                    nickName: resp.userNickName,
                })
            );
    }, []);

    const [show, setShow] = useState(false);
    const [showPw, setShowPw] = useState(false);

    const handleClose = () => setShow(false);
    const handleClosePw = () => setShowPw(false);

    const [effectiveness, setEffectiveness] = useState({
        nickName: true,
        eMail: true,
        newPassword: false,
        checkPassword: false,
    });
    const isNickName = (nickName: string): boolean => {
        const nickNameRegex = /^[가-힣a-zA-Z0-9]{2,}$/;
        return nickNameRegex.test(nickName);
    };
    const isEmail = (email: string): boolean => {
        const emailRegex = /^[a-z0-9_+.-]{3,}@([a-z0-9-]+\.)+[a-z0-9]{2,4}$/i;
        return emailRegex.test(email);
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value,
        });
        let isGood = false;
        if (e.target.name === "nickName") {
            isGood = isNickName(e.target.value);
        } else if (e.target.name === "eMail") {
            isGood = isEmail(e.target.value);
        }
        setEffectiveness({
            ...effectiveness,
            [e.target.name]: isGood,
        });
    };
    const handleChangePw = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPwValues({
            ...pwValues,
            [e.target.name]: e.target.value,
        });
        let isGood = false;
        if (e.target.name === "newPassword") {
            isGood = isPassword(e.target.value);
        } else if (e.target.name === "checkPassword") {
            isGood = isVerifyPassword(pwValues.newPassword, e.target.value);
        }
        setEffectiveness({
            ...effectiveness,
            [e.target.name]: isGood,
        });
    };

    const handleShow = () => {
        if (effectiveness.nickName && effectiveness.eMail) {
            setShow(true);
        } else {
            alert("아직 완성되지 않은 부분이 있어요!");
        }
    };
    const handleShowPw = () => {
        setShowPw(true);
    };

    const updateUser = "/api/user/data";
    const handleSave = async () => {
        await fetch(updateUser, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
                userCreatedWhen: values.userCreatedWhen,
                userEmail: values.eMail,
                userId: values.id,
                userNickName: values.nickName,
                userNotify: values.notify,
                userPw: values.password,
            }),
        })
            .then((resp) => resp.json())
            .then((resp) => {
                if (Object.keys(resp).includes("message")) {
                    alert(resp.message);
                } else {
                    localStorage.removeItem("token");
                    localStorage.setItem("token", resp.token);
                    alert("변경 사항이 저장되었습니다!");
                    document.location.href = "/";
                }
            });
    };

    const checkPw = "/api/user/admin/IdPw";
    const updateUserPw = "/api/user/data/updateWord";
    const handleSavePw = async () => {
        if (effectiveness.newPassword && effectiveness.checkPassword) {
            await fetch(checkPw + `/${values.id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(pwValues.password),
            })
                .then((resp) => resp.json())
                .then((resp) => {
                    if (resp === true) {
                        fetch(updateUserPw + `/${values.id}`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${localStorage.getItem(
                                    "token"
                                )}`,
                            },
                            body: JSON.stringify(pwValues.newPassword),
                        })
                            .then((resp) => resp.json())
                            .then((resp) => {
                                alert(resp.message);
                                if (
                                    resp.message ===
                                    "비밀번호 변경이 성공적으로 이루어졌습니다."
                                ) {
                                    document.location.href = "/";
                                }
                            });
                    } else {
                        alert("현재 비밀번호가 틀렸습니다.");
                    }
                });
        } else {
            alert("다시 입력해주세요.");
        }
    };

    const commonStyle = "h-12 pl-2 my-3 font-mono text-lg w-96 border-b-2";

    return (
        <div>
            <div className="flex flex-col mx-20 mt-8">
                <div className="flex items-center space-x-2 mb-6">
                    <img
                        className="w-7 h-7 md:w-auto md:h-auto"
                        src="img/PersonalSettings.png"
                        alt=""
                    />
                    <p className="ml-1 mr-2 text-lg font-bold md:text-xl text-[#5F5F5F]">
                        회원정보
                    </p>
                    <img
                        className="w-2 mx-1 md:w-3"
                        src="img/arrow.png"
                        alt=""
                    />
                    <img
                        className="mx-1 w-7 h-7 md:w-auto md:h-auto"
                        src="img/ChangePersonalInfo.png"
                        alt=""
                    />
                    <p className="ml-1 text-lg font-bold md:text-xl text-[#5F5F5F]">
                        내정보 수정
                    </p>
                </div>
                <div className="items-center h-8 bg-gray-100 rounded-lg mb-7 w-28 md:w-40 md:h-10">
                    <Link
                        to={"/setting/userInfo"}
                        className="flex items-center justify-center w-full h-full"
                    >
                        <p className='text-[#5F5F5F] font-bold'>뒤로</p>
                        <p> </p>
                    </Link>
                </div>
                <div className="flex flex-col items-center">
                    <p className="mt-5">변경하실 닉네임을 입력해주세요.</p>
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
                    <p className="mt-14">변경하실 이메일을 입력해주세요</p>
                    <div>
                        <input
                            type="text"
                            name="eMail"
                            value={values.eMail}
                            onChange={handleChange}
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
                    <div className="flex space-x-4 place-self-center">
                        <div className="">
                            <button
                                onClick={handleShowPw}
                                className="h-12 mt-16 rounded-3xl bg-slate-200 w-44 border-slate-300 text-[#5F5F5F] font-bold"
                            >
                                비밀번호 변경
                            </button>
                        </div>
                        <div className="">
                            <button
                                onClick={handleShow}
                                className="h-12 mt-16 bg-black rounded-3xl text-slate-200 w-44 border-slate-300"
                            >
                                저장하기
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {show && (
                <div className="modal">
                    <div className="overlay">
                        <div
                            style={{ width: "300px" }}
                            className="modal-content"
                        >
                            <input
                                className="w-56 h-8 mb-3"
                                type="text"
                                value={localStorage.getItem("user_id")!}
                                readOnly
                            />
                            <br />
                            <input
                                className="w-56 h-8 mb-20"
                                onChange={handleChange}
                                value={values.password}
                                name="password"
                                type="password"
                                placeholder="password"
                            />
                            <button
                                className="mb-10 text-white bg-black close-modal rounded-xl"
                                onClick={handleSave}
                            >
                                저장하기
                            </button>
                            <button
                                className="close-modal bg-slate-200 rounded-xl"
                                onClick={handleClose}
                            >
                                뒤로가기
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showPw && (
                <div className="modal">
                    <div className="overlay">
                        <div
                            style={{ width: "300px" }}
                            className="modal-content"
                        >
                            <p>현재 비밀번호</p>
                            <input
                                className="w-56 h-8 mb-5"
                                onChange={handleChangePw}
                                value={pwValues.password}
                                name="password"
                                type="password"
                                placeholder="password"
                            />
                            <p>변경할 비밀번호</p>
                            <div>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={pwValues.newPassword}
                                    onChange={handleChangePw}
                                    className={
                                        effectiveness.newPassword
                                            ? `${commonStyle} w-56 h-8 border-gray-400 border-solid`
                                            : `${commonStyle} w-56 h-8 border-red-700 border-solid`
                                    }
                                    placeholder="Password"
                                />
                                {effectiveness.newPassword === false ? (
                                    <p className="font-sans text-sm text-yellow-600">
                                        비밀번호는 영어와 숫자만 가능하고 8~12로
                                        해주세요!
                                    </p>
                                ) : null}
                            </div>
                            <p>비밀번호 재입력</p>
                            <div className="mb-20">
                                <input
                                    type="password"
                                    name="checkPassword"
                                    value={pwValues.checkPassword}
                                    onChange={handleChangePw}
                                    className={
                                        effectiveness.checkPassword
                                            ? `${commonStyle} w-56 h-8 border-gray-400 border-solid`
                                            : `${commonStyle} w-56 h-8 border-red-700 border-solid`
                                    }
                                    placeholder="VerifyPassword"
                                />
                                {effectiveness.checkPassword === false ? (
                                    <p className="font-sans text-sm text-yellow-600">
                                        비밀번호를 한 번 더 입력해 주세요
                                    </p>
                                ) : null}
                            </div>
                            <button
                                className="mb-10 text-white bg-black close-modal rounded-xl"
                                onClick={handleSavePw}
                            >
                                변경하기
                            </button>
                            <button
                                className="close-modal bg-slate-200 rounded-xl"
                                onClick={handleClosePw}
                            >
                                뒤로가기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChangePersonalInfo;
