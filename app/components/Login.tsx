import { Button } from "antd";
import React, { useState } from "react";
import { signIn, signUp } from "../server/actions/auth";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignIn = async () => {
        const result = await signIn(email, password);
        console.log(result);
    };

    const handleSignUp = async () => {
        const result = await signUp(email, password);
        console.log(result);
    };

    return (
        <form>
            <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
                placeholder="Email"
            />
            <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
                placeholder="Password"
            />
            <Button onClick={handleSignIn}>Sign in</Button>
            <Button onClick={handleSignUp}>Sign Up</Button>
        </form>
    );
};

export default Login;
