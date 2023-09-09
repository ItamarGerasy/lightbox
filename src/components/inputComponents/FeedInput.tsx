// FeedInput.tsx
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

type FeedInputProps = {
  feedList: Array<string>;
  addToFeedList: (feed: string) => void;
  removeFromFeedList: (feed: string) => void;
};

export const FeedInput = (props: FeedInputProps) => {
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [input, setInput] = useState("");

  const onAddClick = () => {
    let feed = input;
    if (!feed) {
      setError(true);
      setErrorMessage("Feed cannot be empty");
      return;
    }
    if (props.feedList.indexOf(feed) >= 0) {
      setError(true);
      setErrorMessage("Feed already exist");
      return;
    }
    setError(false);
    setErrorMessage("");
    setInput("");
    props.addToFeedList(feed);
  };

  const handleRemove = (feed: string) => {
    props.removeFromFeedList(feed);
  };

  return (
    <div style={{ display: "flex", paddingBottom: '8px'}}>
      <TextField
        size="small"
        id="feed"
        label="Add Feed"
        error={error}
        helperText={errorMessage}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <Button variant="contained" onClick={onAddClick} size="small">
        Add
      </Button>
      {props.feedList.map((feed, index) => (
        <div key={index}>
          <Typography>{feed}</Typography>
          <CloseIcon onClick={() => handleRemove(feed)} />
        </div>
      ))}
    </div>
  );
};
