// InputTextFields.tsx
import TextField from "@mui/material/TextField";

type InputTextFieldsProps = {
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
};

export const InputTextFields = (props: InputTextFieldsProps) => {
  return (
    <div>
      <TextField
        style={{paddingBottom: '4px', paddingTop: '4px'}}
        required
        size="small"
        id="switchSpecs"
        label="Switch Prefix"
        helperText="Examples: 3X16A, 1X10A"
        onChange={props.handleInputChange}
      />
      <br />
      <TextField
        style={{paddingBottom: '4px', paddingTop: '4px'}}
        required
        size="small"
        id="switchAmount"
        label="Switch Amount"
        type="number"
        onChange={props.handleInputChange}
      />
      <br />
      <TextField
        style={{paddingBottom: '4px', paddingTop: '4px'}}
        size="small"
        id="switchDescription"
        label="Switch Description"
        onChange={props.handleInputChange}
      />
    </div>
  );
};
