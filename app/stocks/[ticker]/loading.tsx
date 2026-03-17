import Spinner from "@/app/components/ui/Spinner";

const StockLoading = () => {
    return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <Spinner size="large" colour="primary" />
        </div>
    );
};

export default StockLoading;
