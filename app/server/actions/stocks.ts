export const getStock = async (ticker: string) => {
    const res = await fetch(
        `https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?adjusted=true&apiKey=${process.env.NEXT_PUBLIC_POLYGON_API_KEY}`
    );
    // const res = await fetch(
    //     `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=891N0XBQAZW5FS4Q`
    // );
    return res.json();
};

export const getStockPrices = async (ticker: string) => {
    const res = await fetch(
        `https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?adjusted=true&apiKey=${process.env.NEXT_PUBLIC_POLYGON_API_KEY}`
    );
    return res.json();
};

export const getStockDetails = async (ticker: string) => {
    const res = await fetch(
        `https://api.polygon.io/v3/reference/tickers/${ticker}?apiKey=${process.env.NEXT_PUBLIC_POLYGON_API_KEY}`
    );
    return res.json();
};
