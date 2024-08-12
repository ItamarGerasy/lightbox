// InputForm.tsx
import InputAccordion from "./InputAccordion";
import { useState } from "react";
import { FeedInput } from "./FeedInput";
import { withBoard } from "../../hooks/BoardHook";
import { ColumnFlexBox } from "../general/GeneralStyles.styles";

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
    <ColumnFlexBox style={{maxWidth: '200px'}}>
      <FeedInput
        feedList={feedList}
        addToFeedList={addToFeedList}
        removeFromFeedList={removeFromFeedList}
      />{" "}
      <InputAccordion
        feedList={feedList}
      />
    </ColumnFlexBox>
  );
};


export default withBoard(InputForm)