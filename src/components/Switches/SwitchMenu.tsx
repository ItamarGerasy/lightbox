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
import { RefObject, LegacyRef } from 'react';
import { Switch as SwitchType } from '../../framework/Switch'
import { useBoard } from '../../hooks/BoardHook';
import { FlexBox, InfoWindowStyle, smallIcon } from '../general/GeneralStyles.styles';

type SwitchMenuProps = {
    menuOpen: boolean;
    menuAnchorRef: RefObject<HTMLDivElement>;
    handleMenuClose: (event: Event | React.SyntheticEvent) => void;
    // @ts-ignore: Ignore the "Type 'KeyboardEvent' is not generic" TypeScript error
    handleListKeyDown: (event: KeyboardEvent<Element>) => void;
    switch: SwitchType;
}

export const SwitchMenu = (props: SwitchMenuProps) => {
    const {actions} = useBoard()
    const [infoAnchorEl, setInfoAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(infoAnchorEl);
    const id = open ? 'switch-info-popper' : undefined;

    const handleInfoClose = (event: Event | React.SyntheticEvent) => {
        setInfoAnchorEl(null)
    }

    const handleDelete = () => actions.crud.deleteSwitch(props.switch.id)

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        props.handleMenuClose(event)
        setInfoAnchorEl(infoAnchorEl ? null : event.currentTarget);
    };

    const generateSwitchInfoString = () => {
        const s = props.switch
        const dimesnsionsString = s.dimensions ? `width: ${s.dimensions.width} height: ${s.dimensions?.height}` : 'no info'
        const infoStr = `
            ${s.name} ${s.prefix} feed: ${s.feed} \n
            ${s.description} \n
            dimensions: ${dimesnsionsString}
        `
        return infoStr
    }

    return (
        <FlexBox ref={infoAnchorEl as LegacyRef<HTMLDivElement> | undefined }>
            <Popper
                open={props.menuOpen}
                anchorEl={props.menuAnchorRef.current}
                role={undefined}
                placement="top-start"
                transition
                disablePortal
                style={{
                    width: 20,
                    height: 20,
                    padding: 0,
                    margin: 0,
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
                            style={{padding: 0}}
                        >
                            <MenuItem 
                                sx={{padding: 0, paddingTop: "4px", paddingBottom: 1, display: "flex", justifyContent:'center', flexDirection: 'row'}} 
                                onClick={handleClick}
                            >
                                <InfoIcon sx={smallIcon} />
                            </MenuItem>
                            <MenuItem 
                                sx={{padding: 0, paddingBottom: "4px", display: "flex", justifyContent:'center', flexDirection: 'row'}} 
                                onClick={handleDelete}
                            >
                                <DeleteIcon sx={smallIcon}/>
                            </MenuItem>
                        </MenuList>
                        </ClickAwayListener>
                    </Paper>
                    </Grow>
                )}
            </Popper>
            <Popper id={id} open={open} anchorEl={infoAnchorEl} placement="right">  
                <ClickAwayListener onClickAway={handleInfoClose}>
                    <InfoWindowStyle>
                        {generateSwitchInfoString()}
                    </InfoWindowStyle>               
                </ClickAwayListener>
            </Popper>
        </FlexBox>
    )
}