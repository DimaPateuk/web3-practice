"use client";

import { Contract, ethers } from "ethers";
import { useCallback, useEffect } from "react";
import { hooks } from "@/walletUtils/connectors/metaMask";
import { useSuspenseQuery } from "@tanstack/react-query";

export function getErc20Info(contract: Contract, addrToApprove: string) {
  const signer = hooks.useProvider()?.getSigner();
  const queryFn = useCallback(async () => {
    const address = await signer?.getAddress();
    const decimals = await contract.decimals();

    return {
      decimals,
      balanceOf: ethers.utils.formatUnits(
        await contract.balanceOf(address),
        decimals
      ),
      allowance: ethers.utils.formatUnits(
        await contract.allowance(address, addrToApprove),
        decimals
      ),
      symbol: await contract.symbol(),
    };
  }, [contract, signer]);
  const query = useSuspenseQuery({
    queryKey: ["erc20", contract.address],
    queryFn,
  });

  useEffect(() => {
    if (!signer) {
      return;
    }
    if (!contract) {
      return;
    }

    function onApproval(...args: string[]) {
      console.log("onApproval", ...args);
      query.refetch();
    }
    contract.on("Approval", onApproval);

    return () => {
      contract.off("Approval", onApproval);
    };
  }, [contract, query]);

  return {
    info: query,
    approve: useCallback(
      async (amount: string) => {
        const decimals = await contract.decimals();

        await contract.approve(
          addrToApprove,
          ethers.utils.parseUnits(amount, decimals)
        );
      },
      [contract]
    ),
  };
}
