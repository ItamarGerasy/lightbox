import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import { Button } from '@mui/material';

export const InfoDialog = ({deatils, open, closeDialog}: 
    {
        deatils: {title: string, message: string}, 
        open: boolean, 
        closeDialog: () => void
    }) => {
    return (
        <Dialog open={open} style={{zIndex: 50000}}>
            <DialogTitle>{deatils.title}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {deatils.message}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeDialog}>OK</Button>
            </DialogActions>
        </Dialog>
    )
}