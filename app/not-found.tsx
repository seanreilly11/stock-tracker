import Link from "next/link";

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <h1 className="text-4xl font-bold">404</h1>
            <p className="text-lg text-gray-500">Page not found.</p>
            <Link href="/" className="text-primary hover:underline">
                Go home
            </Link>
        </div>
    );
};

export default NotFound;
