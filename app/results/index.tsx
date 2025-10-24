import ResultsScreen from "@/components/results/ResultsScreen";
import RunProvider from "@/providers/RunProvider";
import React from "react";

export default function Results() {
  return (
    <RunProvider>
      <ResultsScreen />
    </RunProvider>
  );
}
