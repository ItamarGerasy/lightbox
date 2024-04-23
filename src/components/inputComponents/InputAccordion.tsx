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
import { SelectChangeEvent } from "@mui/material/Select";
import { InputTextFields } from "./InputTextFields";
import { SelectWrapper } from "./SelectWrapper";
import { useGlobalState, withGlobalState } from "../MainAppState";
import { Switch } from "../../framework/Switch"
import { defaultSwitchDimensions } from "../general/generalTypes";


type InputAccordionProps = {
  feedList: Array<string>;
};

function InputAccordion(props: InputAccordionProps) {
  const { actions, globalState } = useGlobalState()
  const [inputError, setInputError] = useState<string>("")
  const [selectedFeed, setSelectedFeed] = useState<string>("")
  const [feedInput, setFeedInput] = useState<string>("")
  const [input, setInput] = useState({
    switchSpecs: "",
    switchAmount: "1",
    switchDescription: ""
  }as {
    switchSpecs: string;
    switchAmount: string;
    switchDescription: string;
  });

  const validateInputBeforeSubmit = (): boolean => {
    const switchSpecsRegex = /[1-9]\d?X[1-9]\d?A/;
    console.log(
      JSON.stringify({
        ss: input.switchSpecs,
        sa: input.switchAmount,
        sd: input.switchDescription,
        sf: feedInput
      })
    );
    if (
      !input.switchSpecs ||
      !input.switchAmount ||
      !input.switchDescription
    ) {
      setInputError("You cannot submit without filling all fields");
      return false;
    }
    if (!switchSpecsRegex.test(input.switchSpecs)) {
      setInputError("Switch Prefix doesn't match known pattern");
      return false;
    }
    if (feedInput === "0"){
      setInputError("switches amount cannot be 0");
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
    // Update the input state with the selected feed
    setFeedInput(e.target.value as string)
  };

  const handleSubmit = (): void => {
    let isInputValid = validateInputBeforeSubmit();
    if (!isInputValid) {
      return;
    }
    // Removes the switchAmount property
    const switchesAmount = parseInt(input.switchAmount ?? '1', 10);

    // Create an array of switches with separate copies of the inputCopy object
    console.log("creating switch array")
    const newSwitchesArray = new Array(switchesAmount)
      .fill(null)
      .map((_, i) => {
        let index = globalState.switches.generateIndex() // new index of the shape: s23, s11, s123
        let numericalIndex = Number(index.substring(1)) + i
        index = `s${numericalIndex}`
        const switchParams = {
          id: `${index}`, 
          name:`switch${index[1]}`, 
          description: input.switchDescription, 
          prefix: input.switchSpecs, 
          feed: feedInput,  
          dimensions: defaultSwitchDimensions
        }
        return new Switch(switchParams)
      });
    console.log(`switch array: ${JSON.stringify(newSwitchesArray)}`)
    actions.crud.addSwitches(newSwitchesArray)
    // cleaning input rows
    setInput({
      switchSpecs: "",
      switchAmount: "0",
      switchDescription: ""
    })
    setFeedInput("")
    

  };

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<AddIcon />}
        aria-controls="input-content"
        id="input-header"
        style={{ minHeight: '30px', height: '30px', alignItems: 'center' }}
      >
        <Typography sx={{fontSize: 15}}>Add Switch</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <InputTextFields handleInputChange={handleInputChange} inputValues={input} />
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

export default withGlobalState(InputAccordion)
