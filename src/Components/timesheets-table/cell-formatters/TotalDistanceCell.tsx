import React from "react";
import { useSelector } from "react-redux";
import { ReduxDataTypes } from "../../../StoreV2/DataTypes";
import { NumberCell } from "./NumberCell";

interface Props {
  value: number | string;
}

export const TotalDistanceCell: React.FC<Props> = (props) => {
  const unit = useSelector(
    (state: ReduxDataTypes.State) => state.settings.distanceUnit
  );
  return <NumberCell value={props.value} unit={unit} bold />;
};
