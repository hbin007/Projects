import React, { useEffect, useState } from "react";
import "./Letter.css";

interface MailData {
    letterCreatedWhen: string;
    myLetterId: string;
    myLetterTitle: string;
    userId: string;
    userNickName: string;
}

interface ReadMail {
    id: string;
    letterName: string;
    content: string;
    nickName: string;
}

const SendLetter = () => {
    const [letters, setLetters] = useState<MailData[]>([]);

    const findAllMySendLetters = "/api/user/sendLetters";

    useEffect(() => {
        fetch(findAllMySendLetters + `/${localStorage.getItem("user_id")}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then((resp) => resp.json())
            .then((resp) => setLetters(resp));
    }, []);

    const [letter, setLetter] = useState<ReadMail>({
        id: "",
        letterName: "",
        content: "",
        nickName: "",
    });
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const findMySendLetter = "/api/user/sendLetters/check";
    const handleShow = (data: MailData) => {
        fetch(findMySendLetter, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: data.myLetterId,
        })
            .then((resp) => resp.json())
            .then((resp) =>
                setLetter({
                    id: resp.myLetterId,
                    letterName: resp.myLetterTitle,
                    content: resp.myLetterContent,
                    nickName: data.userNickName,
                })
            );
        setShow(true);
    };

    // 삭제할 편지 id 리스트 : deleteLetters
    const [deleteLetters, setDeleteLetters] = useState<string[]>([]);
    const handleCheck = (e: React.MouseEvent<HTMLInputElement>) => {
        const target = e.target as Element;
        for (let i = 0; i < deleteLetters.length; i++) {
            const element = deleteLetters[i];
            if (element === target.id) {
                setDeleteLetters(
                    deleteLetters.filter((element) => element !== target.id)
                );
                return "";
            }
        }
        setDeleteLetters([...deleteLetters, target.id]);
    };
    const deleteSendLetter = "/api/user/sendLetters";
    const handleDelete = async () => {
        await fetch(deleteSendLetter, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(deleteLetters),
        });
        setLetters(
            letters.filter((data) => {
                return !deleteLetters.includes(data.myLetterId);
            })
        );
        setDeleteLetters([]);
    };

    return (
        <div className="ml-10 mr-10 md:ml-12 md:mr-20">
            <img
                src="img/delete.png"
                onClick={handleDelete}
                className="float-right w-6"
                alt=""
            />
            <ol style={{ listStyleType: "decimal" }} reversed className="pt-10">
                {letters.map((data, index) => {
                    return (
                        <div
                            key={data.myLetterId}
                            className="flex space-x-5 text-sm md:text-base"
                        >
                            <input
                                type="checkbox"
                                id={data.myLetterId}
                                onClick={handleCheck}
                                className="check w-12 h-10 appearance-none bg-[url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%22-10%20-18%20100%20135%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2250%22%20fill%3D%22none%22%20stroke%3D%22%23ededed%22%20stroke-width%3D%223%22/%3E%3C/svg%3E')]
                            checked:bg-[url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%22-10%20-18%20100%20135%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2250%22%20fill%3D%22none%22%20stroke%3D%22%23bddad5%22%20stroke-width%3D%223%22/%3E%3Cpath%20fill%3D%22%235dc2af%22%20d%3D%22M72%2025L42%2071%2027%2056l-4%204%2020%2020%2034-52z%22/%3E%3C/svg%3E')]"
                            />
                            <div
                                onClick={() => handleShow(data)}
                                className="flex justify-between w-full py-2 mb-3 border-b-2"
                            >
                                <div className="flex space-x-4">
                                    <li>보냄</li>
                                    <p>{data.userNickName}</p>
                                </div>
                                <p>{data.myLetterTitle}</p>
                                <p>{data.letterCreatedWhen}</p>
                            </div>
                        </div>
                    );
                })}
            </ol>

            {show && (
                <div className="modal">
                    <div className="overlay" onClick={handleClose}>
                        <div className="modal-content overflow-auto">
                            <div className="flex justify-between">
                                <h1 className="pr-8 mb-5 text-2xl font-semibold border-b-2 border-slate-600">
                                    {letter.letterName}
                                </h1>
                                <h3 className="pl-4 mb-5 text-xl border-b-2 border-slate-600">
                                    {letter.nickName}
                                </h3>
                            </div>
                            <p className="pb-20 mb-10 text-xl border-b-2 border-slate-600">
                                {letter.content}
                            </p>
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

export default SendLetter;
