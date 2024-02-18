// ModuleMenu.tsx
import React, { LegacyRef } from 'react'
import { DraggableProvided } from 'react-beautiful-dnd';
import DeleteIcon from '@mui/icons-material/Delete';
import Popper from '@mui/material/Popper';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import InfoIcon from '@mui/icons-material/Info'
import { FlexBox, ColumnFlexBox, InfoWindowStyle, mediumIcon } from './general/GeneralStyles.styles'
import { Module as ModuleType } from '../framework/Module';
import { useGlobalState } from './MainAppState';

type ModuleMenuProps = {
    provided: DraggableProvided;
    module: ModuleType;
};
  
export const ModuleMenu: React.FC<ModuleMenuProps> = ({module, provided}) => {
    const {actions} = useGlobalState();
    const InfoAnchorRef = React.useRef<HTMLDivElement>(null);
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
        const modleInfoString = `Name: ${module.name} \n Feed: ${module.feed} \n Switches: ${module.switchesAmount} \n ${moduleDimensionsString}`;
        return modleInfoString
    };

    const handleModuleAndSwitchesDelete = () =>  actions.crud.deleteModuleWithSwitches(module.id)

    return (
        <ColumnFlexBox style={{backgroundColor: 'lightblue'}} ref={InfoAnchorRef as LegacyRef<HTMLDivElement> | undefined }>
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