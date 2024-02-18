// Switch.tsx
import React from 'react'
import { Switch as SwitchType } from '../../framework/Switch'
import { Draggable } from "react-beautiful-dnd";
import { SwitchStyle, SwitchWrapper } from './Switch.styles'
import { withGlobalState } from '../MainAppState';
import { SwitchMenu } from './SwitchMenu'

type SwitchProps = {
    switch: SwitchType,
    index: number
}

export const Switch = (props: SwitchProps) => {
    const [menuOpen, setMenuOpen] = React.useState(false);
    const menuAnchorRef = React.useRef<HTMLDivElement>(null); // refrence for the anchor of the menu
    const menuElemetRef = React.useRef<HTMLDivElement>(null); // refrence for the anchor of the menu

    const handleToggleMenu = () => {
        setMenuOpen((prevOpen) => !prevOpen);
    };
    
    const handleMenuClose = (event: Event | React.SyntheticEvent) => {
        if (
            menuAnchorRef.current &&
            menuAnchorRef.current.contains(event.target as HTMLElement) &&
            menuElemetRef.current?.contains(event.target as HTMLElement)
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
            <SwitchWrapper onClick={handleToggleMenu} ref={menuAnchorRef}>
                <SwitchStyle
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                ref={provided.innerRef}
                isDragging={snapshot.isDragging}
                switchSize={props.switch.size}
                >  
                </SwitchStyle>
                <SwitchMenu menuOpen={menuOpen} menuAnchorRef={menuAnchorRef} handleMenuClose={handleMenuClose} handleListKeyDown={handleListKeyDown} switch={props.switch}/>
            </SwitchWrapper>
        )}
        </Draggable>
    )
}

export default withGlobalState(Switch)
