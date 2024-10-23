"use client";

import { Contract, ethers } from "ethers";
import { useMemo } from "react";
import { hooks } from "@/walletUtils/connectors/metaMask";

export function useContract(addr: string, abi: ethers.ContractInterface) {
  const signer = hooks.useProvider()?.getSigner();

  return useMemo(() => {
    return new Contract(addr, abi, signer);
  }, [addr, signer]);
}
