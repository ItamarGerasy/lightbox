// SwitchMenu.tsx
import React, { useContext } from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info'
import Popper from '@mui/material/Popper';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import { RefObject, LegacyRef } from 'react';
import { Switch as SwitchType } from './typeForComponents'
import { InfoWindowStyle } from './SwitchMenu.styles'
import { useGlobalState } from './MainAppState';

type SwitchMenuProps = {
    menuOpen: boolean;
    menuAnchorRef: RefObject<HTMLDivElement>;
    handleMenuClose: (event: Event | React.SyntheticEvent) => void;
    // @ts-ignore: Ignore the "Type 'KeyboardEvent' is not generic" TypeScript error
    handleListKeyDown: (event: KeyboardEvent<Element>) => void;
    switch: SwitchType;
}

export const SwitchMenu = (props: SwitchMenuProps) => {
    const {globalState, setGlobalState} = useGlobalState()
    const [infoAnchorEl, setInfoAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(infoAnchorEl);
    const id = open ? 'switch-info-popper' : undefined;

    const handleInfoClose = (event: Event | React.SyntheticEvent) => {
        setInfoAnchorEl(null)
    }

    const handleDelete = (event: React.MouseEvent<HTMLElement>) => {
        let parentModule
        const switchId = props.switch.id
        const newGlobalState = {...globalState}

        console.log(`switch to remove: ${switchId}`)
        // validating switch id exists
        if ( !(switchId in newGlobalState.switches)){
            throw new Error(`switch ID ${switchId} doesn't exist`);
        }
        // removing switch from the switches map
        delete newGlobalState.switches[switchId]

        // finding the parent module
        // eslint-disable-next-line
        for (const [moduleId, moduleObj] of Object.entries(newGlobalState.modules)) {
            console.log(JSON.stringify(moduleObj))
            if(moduleObj.switchesOrderedList.indexOf(switchId) !== -1){
                parentModule = moduleObj
            }
        }
        if (!parentModule){
            throw new Error(`no parent module found for switch: ${switchId}`);
        }

        // removing switch from the module switches list
        const switchIndex = parentModule.switchesOrderedList.indexOf(switchId)
            parentModule.switchesOrderedList.splice(switchIndex, 1)

        setGlobalState(newGlobalState)
    }

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        console.log(event.currentTarget.parentElement?.parentElement?.parentElement?.parentElement)
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
        <div ref={infoAnchorEl as LegacyRef<HTMLDivElement> | undefined }>
            <Popper
                open={props.menuOpen}
                anchorEl={props.menuAnchorRef.current}
                role={undefined}
                placement="top-start"
                transition
                disablePortal
                style={{
                    zIndex: 9999, //  high z-index value
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
                        >
                            <MenuItem 
                                sx={{padding: 0, paddingBottom: 1, display: "flex", justifyContent:'center', flexDirection: 'row'}} 
                                onClick={handleClick}
                            >
                                <InfoIcon sx={{fontSize: 10, padding: 0}} />
                            </MenuItem>
                            <MenuItem 
                                sx={{padding: 0, display: "flex", justifyContent:'center', flexDirection: 'row'}} 
                                onClick={handleDelete}
                            >
                                <DeleteIcon sx={{fontSize: 10, padding: 0}}/>
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
        </div>
    )
}