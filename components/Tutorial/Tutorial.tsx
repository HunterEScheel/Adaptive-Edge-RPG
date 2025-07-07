import { RootState } from "@/store/rootReducer";
import React from "react";
import { useSelector } from "react-redux";

export default function Tutorial() {
  const tutorialStep = useSelector((state: RootState) => state.tutorial);
  return <>{tutorialStep > 0 && <></>}</>;
}
