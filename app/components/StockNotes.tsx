import { Button, Card, Input, List, Modal, Switch, message } from "antd";
import React, { useEffect, useState } from "react";
import { getUserStock, removeStock, updateStock } from "../server/actions/db";
import { Stock } from "../server/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleFilled,
} from "@ant-design/icons";
import { NoticeType } from "antd/es/message/interface";
import useAuth from "./useAuth";

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
    const user = useAuth();
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();
    const [editTarget, setEditTarget] = useState(false);
    const [notesText, setNotesText] = useState("");
    const { data: savedStock, isLoading } = useQuery({
        queryKey: ["savedStocks", user?.uid, ticker],
        queryFn: () => getUserStock(ticker, user?.uid),
        staleTime: Infinity, // could be set to a minute ish to help with live but might just leave
    });
    const updateMutation = useMutation({
        mutationFn: (_stock: Stock) => {
            loadingPopup("loading", "Updating...");
            return updateStock(_stock, user?.uid);
        },
        onSuccess: () => {
            successPopup("success", "Updated!");
            queryClient.invalidateQueries({
                queryKey: ["savedStocks", user?.uid, ticker],
            });
            queryClient.invalidateQueries({
                queryKey: ["savedStocks", user?.uid],
            });
        },
    });
    const removeMutation = useMutation({
        mutationFn: () => {
            loadingPopup("loading", "Removing...");
            return removeStock(ticker, user?.uid);
        },
        onSuccess: () => {
            setStockNotes((prev) => ({
                ...prev,
                holding: false,
                targetPrice: null,
                notes: [],
            }));
            successPopup("success", "Removed!");
            queryClient.invalidateQueries({
                queryKey: ["savedStocks", user?.uid],
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
        notes: savedStock?.notes ?? [],
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
                notes: savedStock?.notes ?? [],
            });
    }, [savedStock, setStockNotes, name, prices]);

    const handleSubmit = () => {
        setEditTarget(false);
        let _stock: Stock = {
            ...stockNotes,
            holding: stockNotes.holding ?? false,
            notes: notesText
                ? [...stockNotes?.notes!, notesText]
                : [...stockNotes?.notes!],
        };
        setNotesText("");
        updateMutation.mutate(_stock);
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

    const loadingPopup = (type: NoticeType, content: string) => {
        messageApi.open({
            key: "popup",
            type,
            content,
        });
    };
    const successPopup = (type: NoticeType, content: string) => {
        messageApi.open({
            key: "popup",
            type,
            content,
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
                                    value={stockNotes?.targetPrice || ""}
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
                            dataSource={
                                !!stockNotes?.notes?.length
                                    ? stockNotes?.notes
                                    : ["Add notes below"]
                            }
                            renderItem={(item: string) => (
                                <List.Item
                                    actions={[<DeleteOutlined key="1" />]}
                                >
                                    {item}
                                </List.Item>
                            )}
                        />
                        <Input.TextArea
                            rows={4}
                            value={notesText}
                            onChange={(e) =>
                                setNotesText(e.currentTarget.value)
                            }
                        />
                        <Button onClick={handleSubmit}>Submit</Button>
                    </div>
                </div>
            </Card>
        </>
    );
};

export default StockNotes;
