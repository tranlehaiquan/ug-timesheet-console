import * as React from "react";
import { Loading } from "skedulo-ui";

const LoadingIndicator: React.FC = () => {
  return (
    <div className="sk-flex sk-fixed sk-w-full sk-h-full sk-justify-center sk-pin-t sk-pin-l sk-bg-black/2 sk-z-10">
      <div className="sk-flex sk-justify-center sk-items-center">
        <Loading align="center" />
      </div>
    </div>
  );
};

export default React.memo(LoadingIndicator);
