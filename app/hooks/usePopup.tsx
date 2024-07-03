import React from "react";
import { message } from "antd";
import { NoticeType } from "antd/es/message/interface";

const usePopup = () => {
    const [messageApi, contextHolder] = message.useMessage();

    const messagePopup = (
        type: NoticeType,
        content: string,
        duration: number = 3
    ) => {
        messageApi.open({
            key: "popup",
            type,
            content,
            duration,
        });
    };

    return { messagePopup, contextHolder };
};

export default usePopup;
