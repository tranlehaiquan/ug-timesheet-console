import React from "react";
import NoUpdateModal, { NoUpdateModalProps } from "./NoUpdateModal";
import SingleUpdateModal, { SingleUpdateModalProps } from "./SingleUpdateModal";
import BatchUpdateModal, { BatchUpdateModalProps } from "./BatchUpdateModal";

export type UpdateStatusModalProps =
  | SingleUpdateModalProps
  | BatchUpdateModalProps
  | NoUpdateModalProps;
export { Action as SingleUpdateModalAction } from "./SingleUpdateModal";

export default (props: UpdateStatusModalProps) => {
  if (!props.isOpened) return null;
  if (props.timesheetsToUpdateCount === 0)
    return <NoUpdateModal {...(props as NoUpdateModalProps)} />;
  if (props.timesheetsCount === 1)
    return <SingleUpdateModal {...(props as SingleUpdateModalProps)} />;
  return <BatchUpdateModal {...(props as BatchUpdateModalProps)} />;
};
