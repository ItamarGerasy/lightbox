import React, { ReactNode } from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info'
import { Switch as SwitchType, GlobalStateContextType } from './typeForComponents'
import { Draggable } from "react-beautiful-dnd";
import { SwitchStyle } from './Switch.styles'
import { infoWindowDefaultStyle } from './Info';
import { withGlobalState } from './MainAppState';

type SwitchOptionsMenuWindowProps = {
}

export const SwitchOptionsMenu: React.FC<SwitchOptionsMenuWindowProps> = (props) => {
    const style:React.CSSProperties = {
        ...infoWindowDefaultStyle, 
        position: 'initial',
        top: 0,
        right: 0,
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
        <div>
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
}

class Switch extends React.Component<GlobalStateContextType & SwitchProps, SwitchState>{
    infoRef: React.RefObject<HTMLDivElement> | null = null;

    constructor(props: GlobalStateContextType & SwitchProps){
        super(props);
        this.state = {
            showMenu: false,
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
          console.log(`Toggled showMenu to: ${newShowMenu}`);
          return { showMenu: newShowMenu };
        });
      };

    handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        this.toggleShowMenu()
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
    
    
    render(): ReactNode {
        // const { globalState, setGlobalState } = this.props
        const { showMenu } = this.state
        console.log('showMenu:', showMenu)
        this.infoRef = React.createRef()
        const feedStr = this.props.switch.feed ? `feed: ${this.props.switch.feed}` : '';
        const dim = this.props.switch.dimensions
        const dimensionsStr =  dim ? `Dimensions: height ${dim.height} width ${dim.width} depth: ${dim.depth}`: '';
        const infoStr = `name: ${this.props.switch.name} description: ${this.props.switch.description} details: ${this.props.switch.prefix} ${feedStr} ${dimensionsStr}`;
        
        return (
            <Draggable draggableId={this.props.switch.id} index={this.props.index}>
            {(provided, snapshot) => (
                <SwitchStyle onClick={this.handleClick}
                onMouseLeave={() => this.setShowMenu(false)}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                ref={provided.innerRef}
                isDragging={snapshot.isDragging}
                switchSize={this.props.switch.size}
                >
                    {showMenu && <SwitchOptionsMenu />}
                </SwitchStyle>      
            )}
            </Draggable>
        );
    }
}
export default withGlobalState(Switch)
