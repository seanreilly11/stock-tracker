import {
    Button,
    Card,
    Input,
    List,
    Modal,
    Skeleton,
    Switch,
    message,
} from "antd";
import React, { useEffect, useState } from "react";
import { getUserStock, removeStock, updateStock } from "../server/actions/db";
import { Stock } from "../lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleFilled,
} from "@ant-design/icons";

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
    const [messageApi, contextHolder] = message.useMessage();
    const [editTarget, setEditTarget] = useState(false);
    const { data: savedStock, isLoading } = useQuery({
        queryKey: ["savedStock", ticker, "TAnsGp6XzdW0EEM3fXK7"],
        queryFn: () => getUserStock(ticker, "TAnsGp6XzdW0EEM3fXK7"),
        staleTime: Infinity, // could be set to a minute ish to help with live but might just leave
    });
    const updateMutation = useMutation({
        mutationFn: (_stock: Stock) => {
            return updateStock(_stock, "TAnsGp6XzdW0EEM3fXK7");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["savedStock", ticker, "TAnsGp6XzdW0EEM3fXK7"],
            });
            // TODO: user id needs to be passed in correctly
        },
    });
    const removeMutation = useMutation({
        mutationFn: () => {
            loadingRemove();
            return removeStock(ticker, "TAnsGp6XzdW0EEM3fXK7");
        },
        onSuccess: () => {
            setStockNotes((prev) => ({
                ...prev,
                holding: false,
                targetPrice: null,
            }));
            successRemove();
            queryClient.invalidateQueries({
                queryKey: ["savedStocks", "TAnsGp6XzdW0EEM3fXK7"],
            });
            // TODO: user id needs to be passed in correctly
        },
    });

    const [stockNotes, setStockNotes] = useState<Stock>({
        holding: savedStock?.holding,
        mostRecentPrice: prices?.results?.[0].c,
        ticker: prices?.ticker,
        targetPrice: savedStock?.targetPrice,
        name,
    });
    // console.log(prices);

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
        let _stock: Stock = {
            ...stockNotes,
            holding: stockNotes.holding ?? false,
        };
        updateMutation.mutate(_stock);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStockNotes((prev) => ({
            ...prev,
            targetPrice: parseFloat(e.currentTarget.value),
        }));
    };

    const handleRemove = () => {
        removeMutation.mutate();
    };

    const showDeleteModal = () => {
        Modal.confirm({
            title: "Do you want to remove this stock from your portfolio?",
            icon: <ExclamationCircleFilled />,
            content:
                "All of your notes and prices about this stock will be lost.",
            onOk() {
                return handleRemove();
            },
            onCancel() {
                console.log("Why you cancel??");
            },
        });
    };

    const loadingRemove = () => {
        messageApi.open({
            key: "RemoveMessage",
            type: "loading",
            content: "Removing...",
        });
    };
    const successRemove = () => {
        messageApi.open({
            key: "RemoveMessage",
            type: "success",
            content: "Removed!",
            duration: 2,
        });
    };

    return (
        <>
            {contextHolder}
            <Card className="basis-full">
                <div>
                    <div className="flex items-end justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            <h3 className="text-xl font-bold">Target price:</h3>
                            {editTarget ? (
                                <Input
                                    className="w-1/3"
                                    value={
                                        stockNotes?.targetPrice ||
                                        savedStock?.targetPrice ||
                                        ""
                                    }
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                    ) =>
                                        setStockNotes((prev: Stock) => ({
                                            ...prev,
                                            targetPrice: parseFloat(
                                                e.target.value
                                            ),
                                        }))
                                    }
                                />
                            ) : savedStock?.targetPrice ? (
                                <p className="text-lg">
                                    <span className="mr-2">
                                        ${savedStock?.targetPrice}
                                    </span>
                                    <EditOutlined
                                        onClick={() => setEditTarget(true)}
                                    />
                                </p>
                            ) : (
                                <EditOutlined
                                    className="text-lg"
                                    onClick={() => setEditTarget(true)}
                                />
                            )}
                        </div>
                        {savedStock ? (
                            <p className="text-xl">
                                <DeleteOutlined onClick={showDeleteModal} />
                            </p>
                        ) : null}
                    </div>
                    <div className="flex items-center mb-4 space-x-3">
                        <h3 className="text-xl font-bold">
                            Are you holding any {ticker}?
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
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold">Notes:</h3>
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
        </>
    );
};

export default StockNotes;
