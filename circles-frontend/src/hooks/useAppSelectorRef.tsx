import React from "react";
import { RootState, useAppSelector } from "@redux/store";

export default function useAppSelectorRef(func: (root: RootState) => any) {
  const value = useAppSelector(func);

  return value;
}
