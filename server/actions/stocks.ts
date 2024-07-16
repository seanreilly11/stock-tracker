export const searchStocks = async (keyword: string) => {
    // const res = await fetch(
    //     `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${keyword}&apikey=891N0XBQAZW5FS4Q`
    // );
    const res = await fetch(
        `https://api.polygon.io/v3/reference/tickers?search=${keyword}&market=stocks&active=true&sort=ticker&order=desc&limit=25&apiKey=${process.env.NEXT_PUBLIC_POLYGON_API_KEY}`
    );
    return res.json();
};

// export const getStock = async (ticker: string) => {
//     const res = await fetch(
//         `https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?adjusted=true&apiKey=${process.env.NEXT_PUBLIC_POLYGON_API_KEY}`
//     );

//     return res.json();
// };

export const getStockPrices = async (ticker: string) => {
    // const res = await fetch(
    //     `https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers/${ticker}/?apiKey=${process.env.NEXT_PUBLIC_POLYGON_API_KEY}`
    // );
    const res = await fetch(
        `https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?adjusted=true&apiKey=${process.env.NEXT_PUBLIC_POLYGON_API_KEY}`
    );
    // const res = await fetch(
    //     `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=891N0XBQAZW5FS4Q`
    // );
    return res.json();
};

export const getStockDetails = async (ticker: string) => {
    const res = await fetch(
        `https://api.polygon.io/v3/reference/tickers/${ticker}?apiKey=${process.env.NEXT_PUBLIC_POLYGON_API_KEY}`
    );
    return res.json();
};

export const getStockNews = async (ticker: string) => {
    const res = await fetch(
        `https://api.polygon.io/v2/reference/news?ticker=${ticker.toUpperCase()}&limit=10&apiKey=${
            process.env.NEXT_PUBLIC_POLYGON_API_KEY
        }`
    );
    return res.json();
};

export const getRelatedCompanies = async (ticker: string) => {
    const res = await fetch(
        `https://api.polygon.io/v1/related-companies/${ticker.toUpperCase()}?apiKey=${
            process.env.NEXT_PUBLIC_POLYGON_API_KEY
        }`
    );
    return res.json();
};
