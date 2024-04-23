// InputForm.tsx
import InputAccordion from "./InputAccordion";
import { useState } from "react";
import { FeedInput } from "./FeedInput";
import { withGlobalState } from "../MainAppState";

const InputForm = () => {
  const [feedList, setFeedList] = useState<Array<string>>([])

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

  return (
    <div style={{maxWidth: '200px'}}>
      <FeedInput
        feedList={feedList}
        addToFeedList={addToFeedList}
        removeFromFeedList={removeFromFeedList}
      />{" "}
      <InputAccordion
        feedList={feedList}
      />
    </div>
  );
};


export default withGlobalState(InputForm)