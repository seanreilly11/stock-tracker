import AuthWrapper from "./components/common/AuthWrapper";
import Home from "./components/common/Home";

const Page = () => {
    return (
        <AuthWrapper>
            <Home />
        </AuthWrapper>
    );
};

export default Page;
