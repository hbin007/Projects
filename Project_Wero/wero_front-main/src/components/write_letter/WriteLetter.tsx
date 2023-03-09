import React, { useState } from "react";

const WriteLetter = () => {
  const BaseUrl = "/api/myLetter/createMyLetter";
  const [letter, setLetter] = useState({
    title: "",
    content: "",
    isCheck: false,
  });
  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setLetter({
      ...letter,
      [e.target.name]: e.target.value,
    });
  };
  const handleClick = () => {
    if (letter.content.length > 255) {
      alert('편지 제목은 최대 30자 만큼 쓸 수 있습니다.');
    } else if (letter.title.length > 30) {
      alert('편지 내용은 최대 255자 만큼 쓸 수 있습니다.');
    } else {
      let now = new Date();
      let todayYear = now.getFullYear();
      let todayMonth: number | string = now.getMonth() + 1;
      if (todayMonth < 10) {
        todayMonth = `0${todayMonth}`
      }
      let todayDate: number | string = now.getDate();
      if (todayDate < 10) {
        todayDate = `0${todayDate}`
      }
      let hours: number | string = now.getHours();
      if (hours < 10) {
        hours = `0${hours}`
      }
      let minutes: number | string = now.getMinutes();
      if (minutes < 10) {
        minutes = `0${minutes}`
      }
      let seconds: number | string = now.getSeconds();
      if (seconds < 10) {
        seconds = `0${seconds}`
      }
      const nowDate = `${todayYear}-${todayMonth}-${todayDate} ${hours}:${minutes}:${seconds}`;
      fetch(BaseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          myLetterId: `${localStorage.getItem("user_id")}-${letter.title}`,
          writerId: localStorage.getItem("user_id"),
          myLetterTitle: letter.title,
          myLetterContent: letter.content,
          myLetterCreatedWhen: nowDate,
          myLetterIsPrivate: !letter.isCheck,
        }),
      });
      alert("전송이 완료되었습니다!");
      document.location.href = "/";
    }
  };
  const handleCheck = () => {
    setLetter({
      ...letter,
      isCheck: !letter.isCheck,
    });
  };

  return (
    <div>
      <div className="flex mt-8 mb-3 ml-10 text-2xl font-bold md:text-3xl md:mt-14 h-fit">
        <img
          src="img/Write.png"
          alt=""
          className="w-8 h-8 ml-4 mr-2 md:ml-0 md:w-10 md:h-10 "
        />
        <h1 className='text-[#5F5F5F]'>편지 쓰기</h1>
      </div>
      <div className="mx-20 mt-10 md:mt-16">
        <input
          type="text"
          onChange={handleChange}
          name="title"
          className="w-full mb-10 border-b-2 border-slate-500 outline-none"
          placeholder="제목"
        />
        <textarea
          onChange={handleChange}
          name="content"
          value={letter.content}
          className="w-full border-b-2 border-black h-96 outline-none"
          placeholder="오늘의 이야기를 들려주세요. :)"
        />
        <div className="flex items-center justify-between mt-4 space-x-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              onClick={handleCheck}
              className="w-4 h-4 mr-2"
              name=""
              id="open"
            />
            <label htmlFor="open">편지 공개</label>
          </div>
          <button
            onClick={handleClick}
            className="h-10 mt-16 bg-black right-20 md:h-12 w-28 md:w-52 rounded-2xl text-slate-200 border-slate-300"
          >
            전송
          </button>
        </div>
      </div>
    </div>
  );
};

export default WriteLetter;
