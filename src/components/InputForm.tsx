// InputForm.tsx
import { InputAccordion } from "./InputAccordion";
import { useState } from "react";
import { SwitchDetails, SwitchDetailsArrays } from "./typeForComponents";
import { FeedInput } from "./FeedInput";

export const InputForm = () => {
  const [feedList, setFeedList] = useState<Array<string>>([]);
  const [switchArray, setSwitchArray] = useState<Array<SwitchDetails>>([]);

  function addToFeedList(feed: string): void {
    if (!feed) {
      return;
    }
    setFeedList((prevFeedList) => [...prevFeedList, feed]);
  }

  function removeFromFeedList(feed: string): void {
    const updatedFeedList = feedList.filter((f) => f !== feed);
    setFeedList(updatedFeedList);
  }

  function appendToSwitchArray(
    switchDetails: SwitchDetails | SwitchDetailsArrays
  ): void {
    if (Array.isArray(switchDetails)) {
      setSwitchArray([...switchArray, ...switchDetails]);
      return;
    }
    setSwitchArray([...switchArray, switchDetails]);
  }

  return (
    <div style={{maxWidth: '200px'}}>
      <FeedInput
        feedList={feedList}
        addToFeedList={addToFeedList}
        removeFromFeedList={removeFromFeedList}
      />{" "}
      <InputAccordion
        appendToSwitchArray={appendToSwitchArray}
        feedList={feedList}
      />
    </div>
  );
};
