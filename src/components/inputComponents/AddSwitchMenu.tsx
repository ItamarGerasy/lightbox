// AddSwitchMenu.tsx
// Author: Itamar Gerasy
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContentText from '@mui/material/DialogContentText'
import { useBoard } from '../../hooks/BoardHook'
import { useState } from 'react'
import { InputTextFields } from './InputTextFields'
import Typography from "@mui/material/Typography"
import { InfoDialog } from "../general/InfoDialog"
import { SWITCH_SPECS_REGEX } from "../../framework/constants"

type SwitchMenuProps = {
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const AddSwitchMenu: React.FC<SwitchMenuProps> = ({isOpen, setIsOpen}) => {
    const { board, actions } = useBoard()
    const [inputError, setInputError] = useState<string>("")
    const [input, setInput] = useState({
        specs: "1X16A",
        amount: 1,
        description: "The best switch in the world",
        feed: "Thor god of thunder",
        name: "switchero"
    })
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [dialogDetails, setDialogDetails] = useState({title: "", message: ""})

    const closeDialog = () => setIsOpen(false)

    const clearAllInput = () => {
        setInput({ specs: "", amount: 1, description: "", feed: "", name: "" })
        setInputError("")
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        setInput((prevInput) => ({
            ...prevInput,
            [e.target.id]: e.target.value
        }))
    }

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const formJson = Object.fromEntries((formData as any).entries())
        let {name, feed, description, amount, specs} = formJson
        amount = parseInt(amount)

        let isInputValid = validateSpecsBeforeSubmit();
        if (!isInputValid) return

        // Create an array of switches with separate copies of the inputCopy object
        const newSwitchesArray = board.switches.createNewSwitchesArray(amount, description, specs, feed, name)

        let sucsess = actions.crud.addSwitches(newSwitchesArray)
        if (sucsess) {
            clearAllInput()
            return
        }

        board.switches.removeSwitches(newSwitchesArray)
        
        setDialogDetails({title: "Space Alert", 
        message: `There isn't enough space on the board to add ${amount} switches, nor there is space to add enough modules to accomedate them. \n try adding new compartments and than add the switches `})
        setIsDialogOpen(true)
    }

    const validateSpecsBeforeSubmit = (): boolean => {
        // checks theat specs have the correct syntax, examples: 3X16A, 1X64A
        if (!SWITCH_SPECS_REGEX.test(input.specs)) {
            setInputError("Switch specs doesn't match known pattern");
            return false
        }
        setInputError("")
        return true
    }

    return(
        <Dialog
            open={isOpen}
            onClose={closeDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            style={{zIndex: 40000}}
            PaperProps={{
                component: 'form',
                onSubmit: onSubmit,
            }}
            >
            <DialogTitle id="alert-dialog-title">
            {"Add Switches"}
            </DialogTitle>
            <DialogContentText></DialogContentText>
            <DialogContent>
        
                <InputTextFields handleInputChange={handleInputChange} inputValues={input}/>
                <Typography color={"red"}>{inputError}</Typography>
                <InfoDialog deatils={dialogDetails} open={isDialogOpen} closeDialog={() => {
                    setIsDialogOpen(false)
                    setDialogDetails({title: "", message: ""})
                    }} />
                
            </DialogContent>
            <DialogActions>
                <Button onClick={closeDialog}>Cancel</Button>
                <Button type="submit"> Add </Button>
            </DialogActions>
        </Dialog>)
}