import React, { ReactNode } from 'react'
import ReactDOM from "react-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info'
import { Switch as SwitchType, GlobalStateContextType } from './typeForComponents'
import { Draggable } from "react-beautiful-dnd";
import { SwitchStyle } from './Switch.styles'
import { infoWindowDefaultStyle } from './Info';
import { withGlobalState } from './MainAppState';

type InfoWindowProps = {
    infoStr: string;
    position: {top: number; left: number;}
}

const InfoWindow: React.FC<InfoWindowProps> = ({ infoStr, position }) => {
    return <div style={{
        ...infoWindowDefaultStyle,
        position: 'absolute',
        top: position.top,
        left: position.left,
    }}>{infoStr}</div>
}

type SwitchOptionsMenuWindowProps = {
    onInfoClick: () => void;
    position: {top: number; left: number;}
}

export const SwitchOptionsMenu: React.FC<SwitchOptionsMenuWindowProps> = ({ onInfoClick, position }) => {
    const style:React.CSSProperties = {
        ...infoWindowDefaultStyle, 
        position: 'absolute',
        top: position.top,
        left: position.left,
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
    showMenu: boolean;
    showInfo: boolean;
    menuPosition: {top: number; left: number;}
    infoPosition: {top: number; left: number;}
}

class Switch extends React.Component<GlobalStateContextType & SwitchProps, SwitchState>{
    switchRef: React.RefObject<HTMLDivElement> = React.createRef();

    constructor(props: GlobalStateContextType & SwitchProps){
        super(props);
        this.state = {
            showMenu: false,
            showInfo: false,
            menuPosition: {
                top: 0,
                left: 0,
            },
            infoPosition: {
                top: 0,
                left: 0,
            },
        };
        this.handleClick = this.handleClick.bind(this);
    }

    setShowMenu = (show: boolean) => {
        this.setState(() => {
            return { showMenu: show };
        });
    }

    toggleShowMenu = () => {
        this.setState((prevState) => {
          const newShowMenu = !prevState.showMenu;
          return { showMenu: newShowMenu };
        });
    };

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

    handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, ref: any) => {
        this.toggleShowMenu()
        if(this.state.showInfo){
            this.setShowInfo(false)
        }
        // Calculate positions based on the click event and the size of the Switch component
        const switchRect = ref.current.getBoundingClientRect();
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        const menuPosition = {
            top: switchRect.top, // Adjust as needed
            left: switchRect.left, // Adjust as needed
        };

        const infoPosition = {
            top: mouseY, // Adjust as needed
            left: mouseX, // Adjust as needed
        };
        console.log(`swithcRect ${JSON.stringify(switchRect)}`)
        console.log(`x: ${mouseX}, y: ${mouseY}`)
        console.log(`menu position: ${JSON.stringify(menuPosition)}`)
        console.log(`info position: ${JSON.stringify(infoPosition)}`)

        this.setState((prevState) => {
            return {
                ...prevState,
                menuPosition,
                infoPosition,
            }
        });
    };

    shouldComponentUpdate(nextProps: SwitchProps, nextState: SwitchState) {
        if (
            nextProps.switch !== this.props.switch || 
            nextProps.index !== this.props.index || 
            nextState.showMenu !== this.state.showMenu) {
          return true;
        }
        return false;
    }
    
    handleMouseLeave = () => {
        this.setShowMenu(false);
        this.setShowInfo(false);
    }

    render(): ReactNode {
        // const { globalState, setGlobalState } = this.props
        const { showMenu, showInfo, menuPosition, infoPosition } = this.state
        console.log('showMenu:', showMenu)
        const feedStr = this.props.switch.feed ? `feed: ${this.props.switch.feed}` : '';
        const dim = this.props.switch.dimensions
        const dimensionsStr =  dim ? `Dimensions: height ${dim.height} width ${dim.width} depth: ${dim.depth}`: '';
        const infoStr = `name: ${this.props.switch.name} description: ${this.props.switch.description} details: ${this.props.switch.prefix} ${feedStr} ${dimensionsStr}`;
        
        return (
            <Draggable draggableId={this.props.switch.id} index={this.props.index}>
            {(provided, snapshot) => (
                <SwitchStyle onClick={(event) => this.handleClick(event, this.switchRef)}
                onMouseLeave={this.handleMouseLeave}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                ref={provided.innerRef}
                isDragging={snapshot.isDragging}
                switchSize={this.props.switch.size}
                >
                    <div ref={this.switchRef}>
                        {showMenu && (
                            ReactDOM.createPortal(
                                <SwitchOptionsMenu onInfoClick={this.toggleShowInfo} position={menuPosition}/>,
                                document.body
                        ))}
                        {showInfo && (
                            ReactDOM.createPortal(
                                <InfoWindow infoStr={infoStr} position={infoPosition}/>,
                                document.body
                            )
                        )}
                    </div>
                </SwitchStyle>      
            )}
            </Draggable>
        );
    }
}
export default withGlobalState(Switch)
