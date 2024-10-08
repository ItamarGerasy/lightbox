// AddCompartmentMenu.tsx
// Author: Itamar Gerasy
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import TextField from '@mui/material/TextField'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContentText from '@mui/material/DialogContentText'
import { useBoard } from '../../hooks/BoardHook'
import { defaultCompartmentDimensions } from '../general/generalTypes'
import { useState } from 'react'

type CompartmentMenuProps = {
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const AddCompartmentMenu: React.FC<CompartmentMenuProps> = ({isOpen, setIsOpen}) => {
    const { board, setBoard } = useBoard()
    const closeDialog = () => setIsOpen(false)
    const [input, setInput] = useState({
        name: "Cool Compartment",
        feed: "Thor god of thunder",
        width: defaultCompartmentDimensions.width,
        height: defaultCompartmentDimensions.height,
        depth: defaultCompartmentDimensions.depth
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
        let {name, feed, width, height, depth} = formJson
        width = parseInt(width)
        height = parseInt(height)
        depth = parseInt(depth)

        const newBoard = board.clone()
        let succsess = newBoard.createCompartment({name: name, feed: feed, dimensions: {width: width, height: height, depth: depth}})
        if(!succsess) throw new Error("Could not create compartment for some reason")
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
                Compartment Height and Depth cannot be bigger then Board height and depth, and width cannot be bigger then
                board free width. <br/> Don't worry the form won't let you fill illegal values.
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
                    id="feed" name="feed" label="Feed"
                    type="text"
                    fullWidth
                    variant="filled" 
                    onChange={handleInputChange}
                    inputProps={{ value: input.feed }}/>
                <TextField
                    required
                    margin="dense"
                    id="width" name="width" label="Width"
                    type="number"
                    fullWidth
                    variant="filled" 
                    onChange={handleInputChange}
                    inputProps={{ min: 1, max: board.freeWidth, value: input.width }}/>
                <TextField
                    required
                    margin="dense"
                    id="height" name="height" label="Height"
                    type="number"
                    fullWidth
                    variant="filled" 
                    onChange={handleInputChange}
                    inputProps={{ min: 1, max: board.dimensions.height, value: input.height }}/>
                <TextField
                    required
                    margin="normal"
                    id="depth" name="depth" label="depth"
                    type="number"
                    fullWidth
                    variant="filled" 
                    onChange={handleInputChange}
                    inputProps={{ min: 1, max: board.dimensions.depth, value: input.depth }}
                    />
                    
            </DialogContent>
            <DialogActions>
                <Button onClick={closeDialog}>Cancel</Button>
                <Button type="submit"> Add </Button>
            </DialogActions>
        </Dialog>)
}