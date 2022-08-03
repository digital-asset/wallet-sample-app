import React from "react";

export const useClipboardCopy = (text: string) => {
  const [isCopied, setCopy] = React.useState(false);
  const copy = () => {
    navigator.clipboard
      .writeText(text)
      .then(() => setCopy(true))
      .then(() =>
        setTimeout(() => {
          setCopy(false);
        }, 2000)
      );
  };
  return {copy, isCopied}
};
