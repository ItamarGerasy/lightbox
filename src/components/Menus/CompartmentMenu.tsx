// CompartmentMenu.tsx
import { Compartment as CompartmentType } from "../../framework/Compartment"
import { useBoard } from "../../hooks/BoardHook";
import React, { LegacyRef } from 'react'
import Popper from '@mui/material/Popper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import { FlexBox, ColumnFlexBox, InfoWindowStyle, mediumIcon } from '../general/GeneralStyles.styles'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

type CompartmentMenuProps = {
    compartment: CompartmentType,
};

export const CompartmentMenu: React.FC<CompartmentMenuProps> = ({compartment}) => {
    const {actions} = useBoard();
    const InfoAnchorRef = React.useRef<HTMLDivElement>(null);
    const [infoAnchorEl, setInfoAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(infoAnchorEl);
    const id = open ? 'switch-info-popper' : undefined;

    const handleDelete = () => actions.crud.deleteCompartmentAndModules(compartment.id);

    const handleClose = (event: Event | React.SyntheticEvent) => {
        setInfoAnchorEl(null)
    }

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setInfoAnchorEl(infoAnchorEl ? null : event.currentTarget);
    };

    const generateCompartmentInfoString = () => {
        const dimensions = compartment.dimensions
        const compartmentDimensionsString = dimensions ? `width:${dimensions.width} height: ${dimensions.height} depth:${dimensions.depth}` : '';
        const compartmentInfoString = `Name: ${compartment.name} \n Feed: ${compartment.feed} \n Modules: ${compartment.modulesAmount} \n ${compartmentDimensionsString}`;
        return compartmentInfoString
    };

    return (
        <ColumnFlexBox  ref={InfoAnchorRef as LegacyRef<HTMLDivElement> | undefined }>
            <FlexBox onClick={handleClick}>
                <InfoOutlinedIcon sx={mediumIcon}/>
            </FlexBox>
            <FlexBox onClick={handleDelete}>
                <DeleteOutlineOutlinedIcon sx={mediumIcon} />
            </FlexBox>
            <Popper id={id} open={open} anchorEl={infoAnchorEl} placement="right">  
                <ClickAwayListener onClickAway={handleClose}>
                    <InfoWindowStyle>
                        {generateCompartmentInfoString()}
                    </InfoWindowStyle>               
                </ClickAwayListener>
            </Popper>
        </ColumnFlexBox>
    );
}