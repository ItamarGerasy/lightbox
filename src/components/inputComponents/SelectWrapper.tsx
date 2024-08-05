// SelectWrapper.tsx
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { FlexBox } from "../general/GeneralStyles.styles";

type SelectWrapperProps = {
  selectedFeed: string;
  handleFeedChange: (e: SelectChangeEvent<string>) => void;
  feedList: Array<string>;
};

export const SelectWrapper = (props: SelectWrapperProps) => {
  return (
    <FlexBox>
      <Select
        style={{paddingBottom: '8px', maxHeight: '30px', fontSize: "10", textAlign: 'center'}}
        value={props.selectedFeed}
        onChange={props.handleFeedChange}
        displayEmpty
        inputProps={{ "aria-label": "Select Feed" }}
      >
        <MenuItem value="" disabled>
          Select Feed
        </MenuItem>
        {props.feedList.map((feed, index) => (
          <MenuItem key={index} value={feed}>
            {feed}
          </MenuItem>
        ))}
      </Select>
    </FlexBox>
  );
};
