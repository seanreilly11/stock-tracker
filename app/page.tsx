import SearchBar from "./components/SearchBar";
import StockList from "./components/StockList";

export default function Home() {
    // githubSignIn();
    // getSignInResult();

    return (
        <>
            <SearchBar />
            {/* <Button onClick={githubSignIn}>GitHub Sign In</Button> */}
            <StockList />
        </>
    );
}
