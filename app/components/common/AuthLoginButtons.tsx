import React from "react";
import AuthButton from "../ui/AuthButton";
import { GoogleOutlined } from "@ant-design/icons";
import { signInWithGoogle } from "@/server/actions/auth";

type Props = {};

const AuthLoginButtons = (props: Props) => {
    return (
        <div className="mt-3 space-y-2">
            <h5 className="text-center font-semibold text-sm">
                Or sign in with
            </h5>
            <AuthButton
                text="Google"
                outline="outline"
                icon={<GoogleOutlined className="text-xl" />}
                onClick={signInWithGoogle}
            />
        </div>
    );
};

export default AuthLoginButtons;
