import React, { ReactNode } from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info'
import { Switch as SwitchType, GlobalStateContextType } from './typeForComponents'
import { Draggable } from "react-beautiful-dnd";
import { SwitchStyle } from './Switch.styles'
import { infoWindowDefaultStyle } from './Info';
import { withGlobalState } from './MainAppState';
import Popper from '@mui/material/Popper';
import { convertToObject } from 'typescript';

type InfoWindowProps = {
    infoStr: string;
    position: {top: number; left: number;}
}

const InfoWindow: React.FC<InfoWindowProps> = ({ infoStr, position }) => {
    return <div style={{
        ...infoWindowDefaultStyle
    }}>{infoStr}</div>
}

type SwitchOptionsMenuWindowProps = {
    onInfoClick: () => void;
}

export const SwitchOptionsMenu: React.FC<SwitchOptionsMenuWindowProps> = ({ onInfoClick }) => {
    const style:React.CSSProperties = {
        ...infoWindowDefaultStyle, 
        position: 'absolute',
        display: 'flex',
        justifyContent: 'flex-start',
        flexDirection: 'column-reverse',
        flexWrap: 'wrap',
        width: '15px',
        height: '40px',
    } 
    return <div style={style}>
        <div>
            <DeleteIcon sx={{fontSize: 15}} />
        </div>
        <div onClick={onInfoClick}>
            <InfoIcon sx={{fontSize: 15}}/>
        </div>
    </div>
}

type SwitchProps = {
    switch: SwitchType,
    index: number
}

interface SwitchState {
    showInfo: boolean;
    anchorEl: null | HTMLDivElement;
}

class Switch extends React.Component<GlobalStateContextType & SwitchProps, SwitchState>{

    constructor(props: GlobalStateContextType & SwitchProps){
        super(props);
        this.state = {
            showInfo: false,
            anchorEl: null,
        };
        this.handleClick = this.handleClick.bind(this);
        this.setAnchorEl = this.setAnchorEl.bind(this);
    }

    setAnchorEl = (newElement: HTMLDivElement | null) => {
        this.setState(() => {
            return { anchorEl: newElement };
        })
    }

    setShowInfo = (show: boolean) => {
        this.setState(() => {
            return { showInfo: show };
        });
    }

    toggleShowInfo = () => {
        this.setState((prevState) => {
          const newShowInfo = !prevState.showInfo;
          return { showInfo: newShowInfo };
        });
    };

    handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if(this.state.showInfo){
            this.setShowInfo(false)
        }
        this.setAnchorEl(this.state.anchorEl ? null : event.currentTarget);
    };

    shouldComponentUpdate(nextProps: SwitchProps, nextState: SwitchState) {
        if (
            nextProps.switch !== this.props.switch || 
            nextProps.index !== this.props.index  ||
            nextState.showInfo !== this.state.showInfo ||
            nextState.anchorEl !== this.state.anchorEl
        ) {
          return true;
        }
        return false;
    }

    render(): ReactNode {
        const { showInfo, anchorEl } = this.state
        const feedStr = this.props.switch.feed ? `feed: ${this.props.switch.feed}` : '';
        const dim = this.props.switch.dimensions
        const dimensionsStr =  dim ? `Dimensions: height ${dim.height} width ${dim.width} depth: ${dim.depth}`: '';
        const infoStr = `name: ${this.props.switch.name} description: ${this.props.switch.description} details: ${this.props.switch.prefix} ${feedStr} ${dimensionsStr}`;
        const isMenuPopperOpen = Boolean(anchorEl);
        const menuPopperId = isMenuPopperOpen ? `${this.props.switch.id}-menu-popper` : undefined;
        
        return (
            <Draggable draggableId={this.props.switch.id} index={this.props.index}>
            {(provided, snapshot) => (
                <div>
                    <SwitchStyle onClick={(event) => this.handleClick(event)}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    isDragging={snapshot.isDragging}
                    switchSize={this.props.switch.size}
                    >  
                    </SwitchStyle>
                    <Popper id={menuPopperId} open={isMenuPopperOpen} anchorEl={anchorEl} placement='right' >
                        <SwitchOptionsMenu onInfoClick={this.toggleShowInfo} />
                    </Popper>


                </div>
            )}
            </Draggable>
        );
    }
}
export default withGlobalState(Switch)
