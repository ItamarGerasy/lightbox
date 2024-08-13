// EditBoardPropsForm.tsx
// Author: Itamar Gerasy
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import TextField from '@mui/material/TextField'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContentText from '@mui/material/DialogContentText'
import { useBoard } from '../../hooks/BoardHook'
import { useState } from 'react'

type EditBoardPropsFormProps = {
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const EditBoardPropsForm: React.FC<EditBoardPropsFormProps> = ({isOpen, setIsOpen}) => {
    const { board, setBoard } = useBoard()
    const closeDialog = () => setIsOpen(false)
    const [input, setInput] = useState({
        name: board.name,
        width: board.dimensions.width,
        height: board.dimensions.height,
        depth: board.dimensions.depth
    })
    
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
        const {name, width, height, depth} = formJson

        const newBoard = board.clone()

        newBoard.name = name
        newBoard.dimensions = {width: width, height: height, depth: depth}
        
        setBoard(newBoard)
    
        closeDialog()
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
            {"Enter Compartment Size"}
            </DialogTitle>
            <DialogContentText>
                Note: you cannot shrink the board dimension in a way that doesn't fit the existing compartments modules and switches. <br/>
                minimum values that can be set: width: {board.minimumWidthToSet()}, height: {board.minimumHeightToSet()}, depth: {board.minimumDepthToSet()}
            </DialogContentText>
            <DialogContent>
               
                <TextField
                    required
                    margin="dense"
                    id="name" name="name" label="Name"
                    type="text"
                    fullWidth
                    variant="filled" 
                    onChange={handleInputChange}
                    inputProps={{ value: input.name }}/>

                <TextField
                    required
                    margin="dense"
                    id="width" name="width" label="Width"
                    type="number"
                    fullWidth
                    variant="filled" 
                    onChange={handleInputChange}
                    inputProps={{ min: board.minimumWidthToSet(), value: input.width }}/>
                <TextField
                    required
                    margin="dense"
                    id="height" name="height" label="Height"
                    type="number"
                    fullWidth
                    variant="filled" 
                    onChange={handleInputChange}
                    inputProps={{ min: board.minimumHeightToSet(), value: input.height }}/>
                <TextField
                    required
                    margin="normal"
                    id="depth" name="depth" label="depth"
                    type="number"
                    fullWidth
                    variant="filled" 
                    onChange={handleInputChange}
                    inputProps={{ min: board.minimumDepthToSet(), value: input.depth }}
                    />
                
            </DialogContent>
            <DialogActions>
                <Button onClick={closeDialog}>Cancel</Button>
                <Button type="submit"> Confirm </Button>
            </DialogActions>
        </Dialog>)
}