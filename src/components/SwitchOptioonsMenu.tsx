import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Stack from '@mui/material/Stack';
import InfoIcon from '@mui/icons-material/Info'
import DeleteIcon from '@mui/icons-material/Delete';

type SwitchOptionsMenuProps = {
    anchorEl: HTMLElement | null, // element to ancor the menu to (the Switch element)
    isOpen: boolean;
    handleClose: () => void;
    handleListKeyDown: (event: React.KeyboardEvent) => void;
}

export const SwitchOptionsMenu: React.FC<SwitchOptionsMenuProps> = ({anchorEl, handleClose, isOpen, handleListKeyDown}) => {

    // function handleListKeyDown(event: React.KeyboardEvent) {
    //     if (event.key === 'Tab') {
    //       event.preventDefault();
    //       setOpen(false);
    //     } else if (event.key === 'Escape') {
    //       setOpen(false);
    //     }
    // }

    return <Popper
                open={isOpen}
                anchorEl={anchorEl}
                role={undefined}
                placement="bottom-start"
                transition
                disablePortal
            >
                {({ TransitionProps, placement }) => (
                <Grow
                    {...TransitionProps}
                    style={{
                    transformOrigin:
                        placement === 'bottom-start' ? 'left top' : 'left bottom',
                    }}
                >
                    <Paper>
                    <ClickAwayListener onClickAway={handleClose}>
                        <MenuList
                        autoFocusItem={isOpen}
                        id="composition-menu"
                        aria-labelledby="composition-button"
                        onKeyDown={handleListKeyDown}
                        >
                        <MenuItem onClick={handleClose}><InfoIcon /></MenuItem>
                        <MenuItem onClick={handleClose}><DeleteIcon /></MenuItem>
                        </MenuList>
                    </ClickAwayListener>
                    </Paper>
                </Grow>
                )}
            </Popper>
};
