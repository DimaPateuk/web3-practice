"use client";

import { Contract, ethers } from "ethers";
import { useCallback, useEffect } from "react";
import { hooks } from "@/walletUtils/connectors/metaMask";
import { useSuspenseQuery } from "@tanstack/react-query";
import { contextErc20Stuff } from "@/features/ERC20TokenWidget";

export function useTokenLockerContract(contract: Contract) {
  const { tokenAddr, erc20Info } = contextErc20Stuff.useContext();
  const signer = hooks.useProvider()?.getSigner();
  const queryFn = useCallback(async () => {
    if (!contract) {
      return {};
    }

    return {
      price: ethers.utils.formatUnits(
        await contract.price(),
        erc20Info.info.data.decimals
      ),
      penaltyfee: ethers.utils.formatUnits(
        await contract.penaltyfee(),
        erc20Info.info.data.decimals
      ),
      balance: ethers.utils.formatUnits(
        await contract.GetBalance(tokenAddr),
        erc20Info.info.data.decimals
      ),
    };
  }, [contract]);
  const query = useSuspenseQuery({
    queryKey: ["tokenLocker", contract.address],
    queryFn,
  });

  useEffect(() => {
    if (!signer) {
      return;
    }
    if (!contract) {
      return;
    }

    function onHold(...args: string[]) {
      console.log("on Hold", ...args);
      query.refetch();
    }

    function onPanicWithdraw(...args: string[]) {
      console.log("on PanicWithdraw", ...args);
      query.refetch();
    }

    function onWithdrawal(...args: string[]) {
      console.log("on Withdrawal", ...args);
      query.refetch();
    }
    contract.on("Hold", onHold);
    contract.on("PanicWithdraw", onPanicWithdraw);
    contract.on("Withdrawal", onWithdrawal);

    return () => {
      contract.off("Hold", onHold);
    };
  }, [contract, query]);

  return {
    info: query,
    lock: useCallback(
      async (amount: string, date: number) => {
        const overrides = {
          value: ethers.utils.parseUnits(query.data.price || "", 18),
        };

        const address = await signer?.getAddress();
        await contract.tokenLock(
          tokenAddr,
          ethers.utils.parseUnits(amount, erc20Info.info.data.decimals),
          date,
          address,
          overrides
        );
      },
      [contract, erc20Info, contract]
    ),
    panicWithdraw: useCallback(async () => {
      await contract.panicWithdraw(tokenAddr);
    }, [contract, tokenAddr]),

    withdraw: useCallback(async () => {
      await contract.panicWithdraw(tokenAddr);
    }, [contract, tokenAddr]),
  };
}
