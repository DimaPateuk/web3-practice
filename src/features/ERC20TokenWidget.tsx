"use client";

import { getErc20Info } from "@/contractsUtils/useERCContract";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import { TOKEN_LOCKER_ADDR } from "./constants";
import { useForm } from "react-hook-form";
import { useContract } from "@/contractsUtils/useContract";
import ERC20_ABI from "../contractsUtils/ERC20_ABI.json";
import { createContextStuff } from "./contextFactory";
import { Contract } from "ethers";
import React, { PropsWithChildren } from "react";

type ERC20TokenWidgetProps = {
  tokenAddr: string;
};

export const contextErc20Stuff = createContextStuff({
  tokenAddr: "",
  erc20Contract: {} as Contract,
  erc20Info: {} as ReturnType<typeof getErc20Info>,
});

export function ERC20TokenWidgetProvider(
  props: PropsWithChildren<ERC20TokenWidgetProps>
) {
  const contract = useContract(props.tokenAddr, ERC20_ABI);
  const info = getErc20Info(contract, TOKEN_LOCKER_ADDR);

  return (
    <contextErc20Stuff.context.Provider
      value={{
        tokenAddr: props.tokenAddr,
        erc20Contract: contract,
        erc20Info: info,
      }}
    >
      {props.children}
    </contextErc20Stuff.context.Provider>
  );
}

export function ERC20TokenWidget() {
  const info = contextErc20Stuff.useContext();
  const {
    erc20Info: {
      approve,
      info: { data },
    },
  } = info;
  const form = useForm<{
    approveAmount: number;
  }>({
    defaultValues: {
      approveAmount: 0,
    },
  });
  const approveAmount = form.watch("approveAmount");

  return (
    <Card>
      <CardContent>
        <Typography variant="h5">Token information</Typography>

        {Object.entries(data || {}).map(([key, item]) => {
          return (
            <Box key={key} display={"flex"} gap={1}>
              <Typography component={"strong"} variant="subtitle1">
                {key}
              </Typography>
              <Typography variant="body1">{item}</Typography>
            </Box>
          );
        })}
      </CardContent>
      <CardActions>
        <TextField
          {...form.register("approveAmount", {
            validate: (value) => {
              return value > 0;
            },
          })}
          error={Boolean(form.formState.errors["approveAmount"])}
          type="number"
        />
        <Button
          disabled={!form.formState.isValid}
          onClick={form.handleSubmit((values) => {
            approve(values.approveAmount.toString());
          })}
        >
          Approve: {approveAmount}
        </Button>
      </CardActions>
    </Card>
  );
}
