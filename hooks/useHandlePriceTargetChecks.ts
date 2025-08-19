import React from "react";
import { useMutation } from "@tanstack/react-query";
import { checkPriceTargets } from "@/server/actions/stocks";
import { TStockPrice } from "@/utils/types";

const useHandlePriceTargetChecks = () => {
    return useMutation({
        mutationFn: () => checkPriceTargets(),
        onSuccess: (data) => data,
    });
};

export default useHandlePriceTargetChecks;
