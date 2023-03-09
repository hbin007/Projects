import React, { useState } from "react";
import { Link } from "react-router-dom";

const MyPage = () => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => {
        setShow(true);
    };
    const [values, setValues] = useState({
        password: "",
    });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value,
        });
    };
    const deleteUserUrl = "/api/user/data";
    const handleDelete = async () => {
        await fetch(deleteUserUrl + `/${localStorage.getItem("user_id")}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: values.password,
        })
            .then((resp) => resp.json())
            .then((resp) => {
                if (resp.message === "회원탈퇴가 성공적으로 이루어졌습니다.") {
                    alert(resp.message);
                    localStorage.removeItem("user_id");
                    localStorage.removeItem("token");
                    document.location.href = "/";
                } else {
                    alert(resp.message);
                }
            });
    };
    const post = 0;
    const get = 0;
    return (
        <div>
            <div className="flex flex-col mx-20 mt-8">
                <div className="flex items-center space-x-2 mb-6">
                    <img
                        className="w-7 h-7 md:w-auto md:h-auto"
                        src="img/PersonalSettings.png"
                        alt=""
                    />
                    <p className="ml-1 text-lg font-bold md:text-xl text-[#5F5F5F]">
                        회원정보
                    </p>
                    <img
                        className="w-1/6 mx-1 md:w-3"
                        src="img/arrow.png"
                        alt=""
                    />
                    <img
                        className="mx-1 w-7 h-7 md:w-auto md:h-auto"
                        src="img/MyPage.png"
                        alt=""
                    />
                    <p className="ml-1 text-lg font-bold md:text-xl text-[#5F5F5F]">
                        마이페이지
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
                <div className="flex justify-between h-10 mb-5 text-lg border-b-2">
                    <p>내가 쓴 편지의 수:</p>
                    <div className="flex space-x-2">
                        <p>{post}</p>
                        <p>통</p>
                    </div>
                </div>
                <div className="flex justify-between h-10 text-lg border-b-2">
                    <p>내가 받은 편지의 수:</p>
                    <div className="flex space-x-2">
                        <p>{get}</p>
                        <p>통</p>
                    </div>
                </div>
                <div
                    onClick={handleShow}
                    className="flex items-center justify-center h-8 mt-10 bg-gray-100 rounded-lg place-self-center w-28 md:w-40 md:h-10"
                >
                    <p className='text-[#5F5F5F] font-bold'>탈퇴하기</p>
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
                                onClick={handleDelete}
                            >
                                탈퇴하기
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
        </div>
    );
};

export default MyPage;
