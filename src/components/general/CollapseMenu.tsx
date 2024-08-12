// CollapseMenu.tsx
import React, { useState } from 'react';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { FlexBox } from './GeneralStyles.styles';


interface CollapseMenuProps<T> {
    Menu: React.ComponentType<T>
    menuProps: T
    orientation: "horizontal" | "vertical" | undefined
    fontSize: "small" | "inherit" | "large" | "medium"
}

const CollapseMenu = <T extends {}>({
    Menu,
    menuProps,
    orientation,
    fontSize
  }: CollapseMenuProps<T>) => {
    const [isOpen, setIsOpen] = useState(false)

    const toggleOpen = () => setIsOpen(isOpen => !isOpen)
    return (

        <ClickAwayListener onClickAway={() => setIsOpen(false)}>
            <FlexBox>
                <IconButton aria-label="options" onClick={toggleOpen} hidden={isOpen} sx={{width: "10px"}}>
                    <MoreVertIcon fontSize={fontSize} />
                </IconButton>
                <Collapse orientation={orientation} in={isOpen}>
                    <Menu {...menuProps} />
                </Collapse>
            </FlexBox>
        </ClickAwayListener>
    )
}

export default CollapseMenu