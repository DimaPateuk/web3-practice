"use client";
import React from "react";
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
import { Controller, useForm } from "react-hook-form";
import { useContract } from "@/contractsUtils/useContract";
import TOKEN_LOCKER_ABI from "../contractsUtils/TOKEN_LOCKER_ABI.json";
import { useTokenLockerContract } from "@/contractsUtils/useTokenLockerContract";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";

export function TokenLockerWidget() {
  const contract = useContract(TOKEN_LOCKER_ADDR, TOKEN_LOCKER_ABI);
  const {
    info: { data },
    lock,
    withdraw,
    panicWithdraw,
  } = useTokenLockerContract(contract);
  const form = useForm<{
    lockAmount: number;
    date: Dayjs;
  }>({
    defaultValues: {
      lockAmount: 0,
      date: dayjs(+new Date() + 10000),
    },
  });
  const lockAmount = form.watch("lockAmount");

  return (
    <Card>
      <CardContent>
        <Typography variant="h5">Lock information</Typography>
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
          {...form.register("lockAmount", {
            validate: (value) => {
              return value > 0;
            },
          })}
          type="number"
        />

        <Controller
          control={form.control}
          name="date"
          rules={{
            required: {
              value: true,
              message: "Required",
            },
          }}
          render={({ field: { onChange, value, ref } }) => (
            <DateTimePicker
              label="Start Date"
              disablePast
              onChange={onChange}
              onAccept={onChange}
              value={value}
              inputRef={ref}
            />
          )}
        />
        <Button
          disabled={!form.formState.isValid}
          onClick={form.handleSubmit((values) => {
            lock(values.lockAmount.toString(), +values.date.toDate());
          })}
        >
          Lock: {lockAmount}
        </Button>
      </CardActions>
      <CardActions>
        <Button
          disabled={!data.balance || parseFloat(data.balance) === 0}
          onClick={() => {
            withdraw();
          }}
        >
          Withdraw
        </Button>
        <Button
          disabled={!data.balance || parseFloat(data.balance) === 0}
          onClick={() => {
            panicWithdraw();
          }}
        >
          Panic Withdraw
        </Button>
      </CardActions>
    </Card>
  );
}
