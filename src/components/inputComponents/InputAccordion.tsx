// InputAccordion.tsx
import * as React from "react";
import { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import BoltIcon from "@mui/icons-material/Bolt";
import Button from "@mui/material/Button";
import { SwitchDetails, SwitchDetailsArrays } from "../general/typeForComponents";
import { SelectChangeEvent } from "@mui/material/Select";
import { InputTextFields } from "./InputTextFields";
import { SelectWrapper } from "./SelectWrapper";

type InputAccordionProps = {
  appendToSwitchArray: (args: SwitchDetails | SwitchDetailsArrays) => void;
  feedList: Array<string>;
};

export function InputAccordion(props: InputAccordionProps) {
  const [inputError, setInputError] = useState<string>("");
  const [selectedFeed, setSelectedFeed] = useState<string>("");
  const [input, setInput] = useState({
    switchSpecs: "",
    switchAmount: "0",
    switchDescription: "",
    switchFeed: ""
  }as {
    switchSpecs: string;
    switchAmount?: string;
    switchDescription: string;
    switchFeed: string;
  });

  const validateInputBeforeSubmit = (): boolean => {
    const switchSpecsRegex = /[1-9]\d?X[1-9]\d?A/;
    console.log(
      JSON.stringify({
        ss: input.switchSpecs,
        sa: input.switchAmount,
        sd: input.switchDescription,
        sf: input.switchFeed
      })
    );
    if (
      !input.switchSpecs ||
      !input.switchAmount ||
      !input.switchDescription ||
      !input.switchFeed
    ) {
      setInputError("You cannot submit without filling all fields");
      return false;
    }
    if (!switchSpecsRegex.test(input.switchSpecs)) {
      setInputError("Switch Prefix doesn't match known pattern");
      return false;
    }
    setInputError("");
    return true;
  };

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void {
    setInput((prevInput) => ({
      ...prevInput,
      [e.target.id]: e.target.value
    }));
  }

  const handleFeedChange = (e: SelectChangeEvent<string>): void => {
    setSelectedFeed(e.target.value as string); // Update the selected feed in state
    setInput((prevInput) => ({
      ...prevInput,
      switchFeed: e.target.value as string // Update the input state with the selected feed
    }));
  };

  const handleSubmit = (): void => {
    let isInputValid = validateInputBeforeSubmit();
    if (!isInputValid) {
      return;
    }
    // Removes the switchAmount property
    const inputCopy = { ...input };
    const switchesAmount = parseInt(inputCopy.switchAmount ?? '1', 10);
    console.log(typeof switchesAmount);
    delete inputCopy.switchAmount;

    // Create an array of switches with separate copies of the inputCopy object
    const newSwitchesArray = new Array(switchesAmount)
      .fill(null)
      .map(() => inputCopy);

    console.log(`going to add to switches array ${newSwitchesArray.length}`);
    // Updates the switchArray state
    props.appendToSwitchArray(newSwitchesArray);
  };

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<AddIcon />}
        aria-controls="input-content"
        id="input-header"
      >
        <Typography sx={{fontSize: 14}}>Add Switch</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <InputTextFields handleInputChange={handleInputChange} />
        <SelectWrapper
          selectedFeed={selectedFeed}
          handleFeedChange={handleFeedChange}
          feedList={props.feedList}
        />
        <Button
          size="small"
          variant="contained"
          endIcon={<BoltIcon />}
          onClick={handleSubmit}
        >
          Add
        </Button>
        <Typography color={"red"}>{inputError}</Typography>
      </AccordionDetails>
    </Accordion>
  );
}
