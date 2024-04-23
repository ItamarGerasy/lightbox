import TextField from "@mui/material/TextField";

type InputTextFieldsProps = {
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  inputValues: {
    switchSpecs: string,
    switchAmount: string,
    switchDescription: string
  }
}

export const InputTextFields = ({ handleInputChange, inputValues }: InputTextFieldsProps) => {
  return (
    <div>
      <TextField
        style={{paddingBottom: '5px', paddingTop: '5px'}}
        required
        size="small"
        id="switchSpecs"
        label="Switch Prefix"
        helperText="Examples: 3X16A, 1X10A"
        onChange={handleInputChange}
        value={inputValues.switchSpecs}
      />
      <br />
      <TextField
        style={{paddingBottom: '5px', paddingTop: '5px'}}
        required
        size="small"
        id="switchAmount"
        label="Switch Amount"
        type="number"
        onChange={handleInputChange}
        value={inputValues.switchAmount}
      />
      <br />
      <TextField
        style={{paddingBottom: '5px', paddingTop: '5px'}}
        size="small"
        id="switchDescription"
        label="Switch Description"
        onChange={handleInputChange}
        value={inputValues.switchDescription}
      />
    </div>
  );
};
