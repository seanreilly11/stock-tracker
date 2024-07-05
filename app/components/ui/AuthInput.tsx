import React, {
    HTMLInputTypeAttribute,
    InputHTMLAttributes,
    useState,
} from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    register: any;
    type: HTMLInputTypeAttribute;
    name: string;
    options: any;
    errors: any;
}

const AuthInput = ({
    register,
    name,
    type,
    options,
    errors,
    ...rest
}: Props) => {
    const [showPassword, setShowPassword] = useState(false);
    const password = type === "password";
    return (
        <>
            <div className="relative">
                <input
                    className={
                        "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" +
                        (errors[name] ? " border-red-500" : "")
                    }
                    type={
                        password ? (showPassword ? "text" : "password") : type
                    }
                    {...register(name, options)}
                    {...rest}
                />
                {password ? (
                    <button
                        type="button"
                        className="absolute top-0 end-0 p-3.5 rounded-e-md"
                        onClick={() => setShowPassword((prev) => !prev)}
                    >
                        <svg
                            className="flex-shrink-0 size-3.5 text-gray-400 dark:text-neutral-600"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path
                                className={showPassword ? "hidden" : "block"}
                                d="M9.88 9.88a3 3 0 1 0 4.24 4.24"
                            ></path>
                            <path
                                className={showPassword ? "hidden" : "block"}
                                d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"
                            ></path>
                            <path
                                className={showPassword ? "hidden" : "block"}
                                d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"
                            ></path>
                            <line
                                className={showPassword ? "hidden" : "block"}
                                x1="2"
                                x2="22"
                                y1="2"
                                y2="22"
                            ></line>
                            <path
                                className={showPassword ? "block" : "hidden"}
                                d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"
                            ></path>
                            <circle
                                className={showPassword ? "block" : "hidden"}
                                cx="12"
                                cy="12"
                                r="3"
                            ></circle>
                        </svg>
                    </button>
                ) : null}
            </div>
            {errors[name] ? (
                <p className="text-red-500 text-xs italic">
                    {errors[name].message}
                </p>
            ) : null}
        </>
    );
};

export default AuthInput;
