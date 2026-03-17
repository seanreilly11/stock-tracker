import Spinner from "@/app/components/ui/Spinner";

const Loading = () => {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <Spinner size="large" colour="primary" />
        </div>
    );
};

export default Loading;
