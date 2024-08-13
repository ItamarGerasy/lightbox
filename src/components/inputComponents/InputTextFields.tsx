import TextField from "@mui/material/TextField"
import { ColumnFlexBox } from "../general/GeneralStyles.styles"

type InputTextFieldsProps = {
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  inputValues: {
    specs: string,
    amount: number,
    description: string,
    feed: string,
    name: string
  }
}

export const InputTextFields = ({ handleInputChange, inputValues }: InputTextFieldsProps) => {
  return (
    <ColumnFlexBox>
      <TextField
        style={{paddingBottom: '5px', paddingTop: '5px'}}
        required
        size="small"
        id="name" name="name"
        label="Switches Names"
        onChange={handleInputChange}
        value={inputValues.name}
      /><br />
      <TextField
        style={{paddingBottom: '5px', paddingTop: '5px'}}
        required
        size="small"
        id="specs" name="specs"
        label="Switches Specs"
        helperText="Examples: 3X16A, 1X10A"
        onChange={handleInputChange}
        value={inputValues.specs}
      /><br />
      <TextField
        style={{paddingBottom: '5px', paddingTop: '5px'}}
        required
        size="small"
        id="amount" name="amount"
        label="Amount"
        type="number"
        onChange={handleInputChange}
        value={inputValues.amount}
        inputProps={{ min: 1 }}
      /><br />
      <TextField
        style={{paddingBottom: '5px', paddingTop: '5px'}}
        size="small"
        id="description" name="description"
        label="Description"
        multiline
        onChange={handleInputChange}
        value={inputValues.description}
      /><br />
      <TextField
        style={{paddingBottom: '5px', paddingTop: '5px'}}
        size="small"
        id="feed" name="feed"
        label="Feed"
        onChange={handleInputChange}
        value={inputValues.feed}
      />
    </ColumnFlexBox>
  );
};
