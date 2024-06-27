import React from "react";
import AuthButton from "../ui/AuthButton";
import { GoogleOutlined } from "@ant-design/icons";
import { signInWithGoogle } from "@/app/server/actions/auth";

type Props = {};

const AuthLoginButtons = (props: Props) => {
    return (
        <div className="mt-3">
            {/* <span>Or</span> */}
            <AuthButton
                text="Sign in with Google"
                icon={<GoogleOutlined className="text-xl" />}
                onClick={signInWithGoogle}
            />
        </div>
    );
};

export default AuthLoginButtons;
