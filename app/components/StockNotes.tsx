import { Card, Input, Switch } from "antd";
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
                <div className="flex items-end mb-4">
                    <h3 className="text-xl font-bold">Target price:</h3>
                    <p className="ml-3 text-lg">$120</p>
                </div>
                <div className="flex items-center mb-4">
                    <h3 className="text-xl font-bold">
                        Are you holding any {prices?.ticker}?
                    </h3>
                    <Switch
                        checkedChildren={"Yes"}
                        unCheckedChildren={"No"}
                        defaultChecked
                        className="ml-3"
                    />
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-2">Notes:</h3>
                    <Input.TextArea rows={4} />
                </div>
            </div>
        </Card>
    );
};

export default StockNotes;
