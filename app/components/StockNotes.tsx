import { Card, Input, List, Switch } from "antd";
import React from "react";

type Props = {
    prices: {
        ticker: string;
    };
};

const StockNotes = ({ prices }: Props) => {
    return (
        <Card className="basis-full">
            <div>
                <div className="flex items-end mb-4 space-x-3">
                    <h3 className="text-xl font-bold">Target price:</h3>
                    <p className="text-lg">$120</p>
                </div>
                <div className="flex items-center mb-4 space-x-3">
                    <h3 className="text-xl font-bold">
                        Are you holding any {prices?.ticker}?
                    </h3>
                    <Switch
                        checkedChildren={"Yes"}
                        unCheckedChildren={"No"}
                        defaultChecked
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
                </div>
            </div>
        </Card>
    );
};

export default StockNotes;
