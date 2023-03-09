import React, { useState, useEffect } from "react";
import SimpleSlider from "./SimpleSlider";

const WhatIsWero = () => {
    const [show, setShow] = useState(true);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setShow(false);
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    const handleOpen = () => {
        setShow(true);
    };
    const handleClose = () => {
        setShow(false);
    };

    return (
        <div className="flex text-[#4F4F4F]">
            <div onClick={handleOpen} className="text-sm border-b border-black">
                {" "}
                WeRo가 뭔가요?
            </div>

            {show && (
                <div className="modal">
                    <div className="overlay">
                        <div className="w-20 h-3/4 modal-content overflow-auto">
                            <div className="flex justify-between text-[24px] font-bold border-b-4 border-black">
                                <p>WeRo에 오신 것을 환영해요!</p>
                                <button
                                    className="h-9 w-10 bg-slate-300 rounded-xl mb-2 text-[20px]"
                                    onClick={handleClose}
                                >
                                    X
                                </button>
                            </div>
                            <div className="flex justify-center mt-8">
                                <SimpleSlider />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WhatIsWero;
