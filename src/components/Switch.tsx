// Switch.tsx
import React, { ReactNode, useRef } from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info'
import { Switch as SwitchType, GlobalStateContextType } from './typeForComponents'
import { Draggable } from "react-beautiful-dnd";
import { SwitchStyle } from './Switch.styles'
import { withGlobalState } from './MainAppState';
import Popper from '@mui/material/Popper';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';


type SwitchProps = {
    switch: SwitchType,
    index: number
}

export const Switch = (props: SwitchProps) => {
    const [menuOpen, setMenuOpen] = React.useState(false);
    const menuAnchorRef = React.useRef<HTMLDivElement>(null); // refrence for the anchor of the menu
    
    const handleToggleMenu = () => {
        setMenuOpen((prevOpen) => !prevOpen);
    };
    
    const handleMenuClose = (event: Event | React.SyntheticEvent) => {
        if (
        menuAnchorRef.current &&
        menuAnchorRef.current.contains(event.target as HTMLElement)
        ) {
        return;
        }
    
        setMenuOpen(false);
    };
    
    function handleListKeyDown(event: React.KeyboardEvent) {
        if (event.key === 'Tab') {
        event.preventDefault();
        setMenuOpen(false);
        } else if (event.key === 'Escape') {
            setMenuOpen(false);
        }
    }
    
    // return focus to the button when we transitioned from !open -> open
    const prevOpen = React.useRef(menuOpen);
    React.useEffect(() => {
        if (prevOpen.current === true && menuOpen === false) {
            menuAnchorRef.current!.focus();
        }
    
        prevOpen.current = menuOpen;
    }, [menuOpen]);
    
    return  (
        <Draggable draggableId={props.switch.id} index={props.index}>
        {(provided, snapshot) => (
            <div onClick={handleToggleMenu} ref={menuAnchorRef}>
                <SwitchStyle
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                ref={provided.innerRef}
                isDragging={snapshot.isDragging}
                switchSize={props.switch.size}
                >  
                </SwitchStyle>
                <Popper
                    open={menuOpen}
                    anchorEl={menuAnchorRef.current}
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
                            <ClickAwayListener onClickAway={handleMenuClose}>
                            <MenuList
                                autoFocusItem={menuOpen}
                                id="composition-menu"
                                aria-labelledby="composition-button"
                                onKeyDown={handleListKeyDown}
                            >
                                <MenuItem><InfoIcon sx={{fontSize:12}}/></MenuItem>
                                <MenuItem onClick={handleMenuClose} sx={{fontSize:12}}><DeleteIcon /></MenuItem>
                            </MenuList>
                            </ClickAwayListener>
                        </Paper>
                        </Grow>
                    )}
                </Popper>
            </div>
        )}
        </Draggable>
    )
}

export default withGlobalState(Switch)
