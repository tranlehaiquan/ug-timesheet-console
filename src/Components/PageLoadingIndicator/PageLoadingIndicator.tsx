import * as React from "react";
import { LoadingSpinner } from "skedulo-ui";

const PageLoadingIndicator: React.FC<{}> = () => {
  return (
    <div
      className="sk-flex sk-absolute sk-w-full sk-h-full sk-justify-center"
      style={{
        backgroundColor: "white",
        zIndex: 99999,
        height: "100vh",
        width: "100vw",
      }}
    >
      <LoadingSpinner size={84} color="#0b86ff" />
    </div>
  );
};

export default PageLoadingIndicator;
