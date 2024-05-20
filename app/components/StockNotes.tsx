import { Button, Card, Input, List, Switch } from "antd";
import React, { useEffect, useState } from "react";
import { getUserStocks, updateStock } from "../server/actions";
import { Stock } from "../lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
    const queryClient = useQueryClient();
    const [editTarget, setEditTarget] = useState(false);
    const { data: savedStocks, isLoading } = useQuery({
        queryKey: ["savedStocks", "TAnsGp6XzdW0EEM3fXK7"],
        queryFn: () => getUserStocks("TAnsGp6XzdW0EEM3fXK7"),
        staleTime: Infinity, // could be set to a minute ish to help with live but might just leave
    });
    const mutation = useMutation({
        mutationFn: () => {
            return updateStock(stockNotes, "TAnsGp6XzdW0EEM3fXK7");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["savedStocks", "TAnsGp6XzdW0EEM3fXK7"],
            });
            // TODO: user id needs to be passed in correctly
        },
    });
    const savedStock = savedStocks?.find(
        (stock: Stock) => stock.ticker === ticker
    );
    const [stockNotes, setStockNotes] = useState<Stock>({
        holding: savedStock?.holding,
        mostRecentPrice: prices?.results?.[0].c,
        ticker: prices?.ticker,
        targetPrice: savedStock?.targetPrice,
        name,
    });
    // const [stockNotes, setStockNotes] = useState({
    //     holding: savedStock?.holding,
    //     mostRecentPrice: prices?.results?.[0].c,
    //     ticker: prices?.ticker,
    //     targetPrice: savedStock?.targetPrice,
    //     name,
    // });
    useEffect(() => {
        savedStock &&
            setStockNotes({
                holding: savedStock?.holding,
                mostRecentPrice: prices?.results?.[0].c,
                ticker: prices?.ticker,
                targetPrice: savedStock?.targetPrice,
                name,
            });
    }, [savedStock, setStockNotes, name, prices]);

    const handleSubmit = () => {
        setEditTarget(false);
        console.log(stockNotes);
        mutation.mutate();
    };

    const handleChange = (e) => {
        setStockNotes((prev) => ({ ...prev, targetPrice: e.target.value }));
    };

    return (
        <Card className="basis-full">
            <div>
                <div className="flex items-end mb-4 space-x-3">
                    <h3 className="text-xl font-bold">Target price:</h3>
                    {editTarget ? (
                        <Input
                            className="w-1/3"
                            value={
                                stockNotes.targetPrice || savedStock.targetPrice
                            }
                            onChange={(e) =>
                                setStockNotes((prev: Stock) => ({
                                    ...prev,
                                    targetPrice: parseInt(e.target.value),
                                }))
                            }
                        />
                    ) : savedStock?.targetPrice ? (
                        <p className="text-lg">
                            <span className="mr-2">
                                ${savedStock?.targetPrice}
                            </span>
                            <EditOutlined onClick={() => setEditTarget(true)} />
                        </p>
                    ) : (
                        <EditOutlined
                            className="text-lg"
                            onClick={() => setEditTarget(true)}
                        />
                    )}
                </div>
                <div className="flex items-center mb-4 space-x-3">
                    <h3 className="text-xl font-bold">
                        Are you holding any {prices?.ticker}?
                    </h3>
                    <Switch
                        checkedChildren={"Yes"}
                        unCheckedChildren={"No"}
                        checked={stockNotes?.holding ?? savedStock?.holding}
                        onChange={(checked) =>
                            setStockNotes((prev) => ({
                                ...prev,
                                holding: checked,
                            }))
                        }
                    />
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-2">Notes:</h3>
                    <List
                        size="small"
                        bordered
                        dataSource={["Hi"]}
                        renderItem={(item: string) => (
                            <List.Item>{item}</List.Item>
                        )}
                    />
                    <Input.TextArea rows={4} />
                    <Button onClick={handleSubmit}>Submit</Button>
                </div>
            </div>
        </Card>
    );
};

export default StockNotes;
