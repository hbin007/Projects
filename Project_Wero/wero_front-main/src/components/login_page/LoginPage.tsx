import React from "react";
import { Link } from "react-router-dom";
import Login from "./Login";
import WhatIsWero from "./WhatIsWero";
import "./LoginPage.css";

const LoginPage = () => {
    const googleLoginUrl = "/api/user/getGoogleAuthUrl";
    const handleGoogle = () => {
        fetch(googleLoginUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((resp) => resp.text())
            .then((resp) => {
                window.open(resp, "_blank", "width=500, height=500");
            });
    };

    return (
        <div className="flex place-content-center 2xl:justify-between">
            {/* 왼쪽 로고,문구 */}

            <div className="hidden 2xl:inline w-full h-full mb-12 place-self-end bg-gray-200 bg-opacity-60 p-4 rounded-lg mr-96 ml-12 space-y-10">
                <p className="text-[#000000] 2xl:inline 2xl:text-3xl 2xl:font-semibold">
                    오늘 하루 힘든 일이 있었나요?
                </p>
                <div className="hidden 2xl:font-extrabold 2xl:inline 2xl:text-5xl">
                    <p className="mt-5">오늘의 나에게 편지를 쓰고</p>
                    <p className="mt-2 mb-8">타인의 편지로 위로 받아가세요</p>
                </div>
            </div>

            <div className="float-right h-screen bg-white">
                <div className="mt-2 ml-5 place-self-start mb-28">
                    <WhatIsWero />
                </div>
                <div className="flex flex-col items-center justify-center">
                    <div className="mx-56 md:mx-96"></div>
                    {/* 위에 welcome.. 문구 */}
                    <div className="mb-12">
                        <p className="mb-4 text-4xl font-bold text-[#5F5F5F]  hidden 2xl:inline">
                            Welcome!
                        </p>
                        <p className="mb-4 text-4xl font-bold text-[#5F5F5F]  2xl:hidden">
                            WeRo
                        </p>
                        <p className="font-medium">
                            반가워요! 자세한 내용을 들려주시겠어요?
                        </p>
                    </div>
                    {/* 구글로 로그인 */}
                    <div
                        onClick={handleGoogle}
                    >
                        <img src="img/btn_google_signin_light_normal_web.png" className="mx-24" />
                    </div>
                    <br />
                    {/* or 선 */}
                    <div className="flex items-center my-2 mx-14 ">
                        <div className="h-px bg-[#4F4F4F] md:text-[#4F4F4F] w-32 md:w-44"></div>
                        <p className="text-[#4F4F4F] md:text-[#4F4F4F] px-2">
                            or
                        </p>
                        <div className="h-px bg-[#4F4F4F] w-32 md:w-44"></div>
                    </div>

                    {/* 아이디, 비밀번호 입력칸 ~ 로그인버튼 */}
                    <Login />

                    <div className="flex justify-center space-x-2 text-sm mt-7 text-[#4F4F4F]">
                        <p>아직 회원이 아니신가요?</p>
                        <Link
                            to="/signUp"
                            className="border-b border-[#4F4F4F] text-[#4F4F4F]"
                        >
                            여기서 회원가입 하세요!
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
