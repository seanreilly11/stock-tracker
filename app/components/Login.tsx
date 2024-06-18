import { Button } from "antd";
import { signIn } from "next-auth/react";
import React from "react";

type Props = {};

const Login = (props: Props) => {
    return <Button onClick={() => signIn()}>Sign in</Button>;
};

export default Login;
