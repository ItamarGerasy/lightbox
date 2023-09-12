// InfoDragRemove.tsx
import React, { LegacyRef } from 'react'
import { DraggableProvided } from 'react-beautiful-dnd';
import DeleteIcon from '@mui/icons-material/Delete';
import Popper from '@mui/material/Popper';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import InfoIcon from '@mui/icons-material/Info'
import { FlexBox, ColumnFlexBox, InfoWindowStyle, mediumIcon } from '../general/GeneralStyles.styles'
import { Module as ModuleType } from './typeForComponents';
import { useGlobalState } from '../MainAppState';

type InfoDragRemoveProps = {
    provided: DraggableProvided;
    module: ModuleType;
};
  
export const InfoDragRemove: React.FC<InfoDragRemoveProps> = ({module, provided}) => {
    const {globalState, setGlobalState} = useGlobalState();
    const [infoAnchorEl, setInfoAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(infoAnchorEl);
    const id = open ? 'switch-info-popper' : undefined;

    const handleClose = (event: Event | React.SyntheticEvent) => {
        setInfoAnchorEl(null)
    }

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setInfoAnchorEl(infoAnchorEl ? null : event.currentTarget);
    };

    const generateModuleInfoString = () => {
        const dimensions = module.dimensions
        const moduleDimensionsString = dimensions ? `width:${dimensions.width} height: ${dimensions.height} depth:${dimensions.depth}` : '';
        const modleInfoString = `Name: ${module.name} \n Feed: ${module.feed} \n Switches: ${module.switchesOrderedList.length} \n ${moduleDimensionsString}`;
        return modleInfoString
    };

    const handleModuleAndSwitchesDelete = (event: React.MouseEvent<HTMLElement>) => {
        let parentCompartment
        const moduleId = module.id
        const newGlobalState = {...globalState}
        const switchesToDelete = module.switchesOrderedList

        console.log(`switch to remove: ${moduleId}`)
        // validating module id exists
        if ( !(moduleId in newGlobalState.modules)){
            throw new Error(`module ID ${moduleId} doesn't exist`);
        }
        // removing switch from the switches map
        delete newGlobalState.modules[moduleId]

        // finding the parent module
        // eslint-disable-next-line
        for (const [compartmentId, compartmentObj] of Object.entries(newGlobalState.compartments)) {
            console.log(JSON.stringify(compartmentObj))
            if(compartmentObj.modulesOrderedList.indexOf(moduleId) !== -1){
                parentCompartment = compartmentObj
            }
        }
        if (!parentCompartment){
            throw new Error(`no parent module found for switch: ${moduleId}`);
        }

        // removing switch from the module switches list
        const switchIndex = parentCompartment.modulesOrderedList.indexOf(moduleId)
            parentCompartment.modulesOrderedList.splice(switchIndex, 1)

        // removing switches from global state
        for( const switchId in switchesToDelete ){
            delete newGlobalState.switches[switchId]
        }

        setGlobalState(newGlobalState)
    };

    return (
        <ColumnFlexBox style={{backgroundColor: 'lightblue'}} ref={infoAnchorEl as LegacyRef<HTMLDivElement> | undefined }>
            <FlexBox {...provided.dragHandleProps}>
                <DragHandleIcon sx={mediumIcon} />
            </FlexBox>
            <FlexBox onClick={handleClick}>
                <InfoIcon sx={mediumIcon}/>
            </FlexBox>
            <FlexBox onClick={handleModuleAndSwitchesDelete}>
                <DeleteIcon sx={mediumIcon} />
            </FlexBox>
            <Popper id={id} open={open} anchorEl={infoAnchorEl} placement="right">  
                <ClickAwayListener onClickAway={handleClose}>
                    <InfoWindowStyle>
                        {generateModuleInfoString()}
                    </InfoWindowStyle>               
                </ClickAwayListener>
            </Popper>
        </ColumnFlexBox>
    );
};