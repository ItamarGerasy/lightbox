// SwitchMenu.tsx
import React from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info'
import Popper from '@mui/material/Popper';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';


type SwitchMenuProps = {
    menuOpen: boolean;
    menuAnchorRef: React.RefObject<HTMLDivElement>;
    handleMenuClose: (event: Event | React.SyntheticEvent) => void;
    // @ts-ignore: Ignore the "Type 'KeyboardEvent' is not generic" TypeScript error
    handleListKeyDown: (event: KeyboardEvent<Element>) => void;
}

export const SwitchMenu = (props: SwitchMenuProps) => {
    return (
        <Popper
            open={props.menuOpen}
            anchorEl={props.menuAnchorRef.current}
            role={undefined}
            placement="left"
            transition
            disablePortal
            style={{
                zIndex: 9999, //  high z-index value
                width: 20,
                height: 20,
                padding: 0,
            }}
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
                    <ClickAwayListener onClickAway={props.handleMenuClose}>
                    <MenuList
                        autoFocusItem={props.menuOpen}
                        id="composition-menu"
                        aria-labelledby="composition-button"
                        onKeyDown={props.handleListKeyDown}
                    >
                        <MenuItem sx={{padding: 0, paddingBottom: 1, display: "flex", justifyContent:'center', flexDirection: 'row'}}  onClick={props.handleMenuClose}><InfoIcon sx={{fontSize: 10, padding: 0}}/></MenuItem>
                        <MenuItem sx={{padding: 0, display: "flex", justifyContent:'center', flexDirection: 'row'}}  ><DeleteIcon sx={{fontSize: 10, padding: 0}}/></MenuItem>
                    </MenuList>
                    </ClickAwayListener>
                </Paper>
                </Grow>
            )}
        </Popper>
    )
}