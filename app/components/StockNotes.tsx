import { Card, Input, List, Switch } from "antd";
import React, { useState } from "react";
import { addStock, getUserStocks } from "../server/actions";
import { Stock } from "../lib/types";
import { useQuery } from "@tanstack/react-query";
import { EditOutlined } from "@ant-design/icons";

type Props = {
    name: string;
    prices: {
        ticker: string;
        results: [
            {
                c: number;
            }
        ];
    };
    ticker: string;
};

const StockNotes = ({ name, prices, ticker }: Props) => {
    const [editTarget, setEditTarget] = useState(false);
    const { data: savedStocks, isLoading } = useQuery({
        queryKey: ["savedStocks", "TAnsGp6XzdW0EEM3fXK7"],
        queryFn: () => getUserStocks("TAnsGp6XzdW0EEM3fXK7"),
        staleTime: Infinity, // could be set to a minute ish to help with live but might just leave
    });
    const savedStock = savedStocks?.find(
        (stock: Stock) => stock.ticker === ticker
    );

    const handleSubmit = () => {
        let stock: Stock = {
            holding: true,
            mostRecentPrice: prices?.results?.[0].c,
            ticker: prices?.ticker,
            targetPrice: parseInt((prices?.results?.[0].c * 1.2).toFixed(2)),
            name,
        };
        addStock(stock, "TAnsGp6XzdW0EEM3fXK7");
    };

    const handleChange = (checked: boolean) => {
        console.log(checked);
    };

    return (
        <Card className="basis-full">
            <div>
                <div className="flex items-end mb-4 space-x-3">
                    <h3 className="text-xl font-bold">Target price:</h3>
                    <p className="text-lg">
                        {savedStock?.targetPrice ? (
                            "$" + savedStock?.targetPrice
                        ) : editTarget ? (
                            <Input />
                        ) : (
                            <EditOutlined onClick={() => setEditTarget(true)} />
                        )}
                    </p>
                </div>
                <div className="flex items-center mb-4 space-x-3">
                    <h3 className="text-xl font-bold">
                        Are you holding any {prices?.ticker}?
                    </h3>
                    <Switch
                        checkedChildren={"Yes"}
                        unCheckedChildren={"No"}
                        defaultChecked={savedStock?.holding}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-2">Notes:</h3>
                    <List
                        size="small"
                        bordered
                        dataSource={["Hi", "Cool", "Enjoy"]}
                        renderItem={(item: string) => (
                            <List.Item>{item}</List.Item>
                        )}
                    />
                    <Input.TextArea rows={4} />
                    {/* <button onClick={handleSubmit}>Submit</button> */}
                </div>
            </div>
        </Card>
    );
};

export default StockNotes;
