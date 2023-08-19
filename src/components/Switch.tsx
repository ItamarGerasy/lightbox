import React from 'react'
import { Switch as SwitchType, GlobalStateContextType } from './typeForComponents'
import { ReactNode } from 'react'
import { Draggable } from "react-beautiful-dnd";
import { SwitchStyle } from './Switch.styles'
import { InfoWindow, infoWindowDefaultStyle } from './Info';
import DeleteIcon from '@mui/icons-material/Delete';
import { withGlobalState } from './MainAppState';

type InfoDeleteWindowProps = {
    handleDelete: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    infoRef: React.RefObject<HTMLDivElement> | null;
    infoStr: string
}

export const InfoDeleteWindow: React.FC<InfoDeleteWindowProps> = (props) => {
    const style:React.CSSProperties = {
        ...infoWindowDefaultStyle, 
        display: 'flex',
        justifyContent: 'flex-start',
        flexDirection: 'column',
        flexWrap: 'wrap',
    } 
    return <div style={style}>
        <div onClick={props.handleDelete}>
            <DeleteIcon fontSize='small' />
        </div>
        <InfoWindow infoRef={props.infoRef} infoStr={props.infoStr} style={{}}/>
    </div>
}

type SwitchProps = {
    switch: SwitchType,
    index: number
}

class Switch extends React.Component<GlobalStateContextType & SwitchProps>{
    infoRef: React.RefObject<HTMLDivElement> | null = null;
    state: { showInfo: boolean }; // Define the state type

    constructor(props: GlobalStateContextType & SwitchProps){
        super(props);
        this.state= {
            showInfo: false,
        }
        this.handleInfoClick = this.handleInfoClick.bind(this);
    }

    setShowInfo = (show: boolean) => {
        this.setState({
            ...this.state,
            showInfo: show
        });
    }

    handleInfoClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation(); // Prevent click propagation to document
        this.setShowInfo(!this.state.showInfo);
    };

    shouldComponentUpdate(nextProps: SwitchProps) {
        if (nextProps === this.props) {
            return false;
        }
        return true;
    }
    
    render(): ReactNode {
        // const { globalState, setGlobalState } = this.props
        const { showInfo } = this.state
        this.infoRef = React.createRef()
        const feedStr = this.props.switch.feed ? `feed: ${this.props.switch.feed}` : '';
        const dim = this.props.switch.dimensions
        const dimensionsStr =  dim ? `Dimensions: height ${dim.height} width ${dim.width} depth: ${dim.depth}`: '';
        const infoStr = `name: ${this.props.switch.name} description: ${this.props.switch.description} details: ${this.props.switch.prefix} ${feedStr} ${dimensionsStr}`;
        
        return (
            <Draggable draggableId={this.props.switch.id} index={this.props.index}>
            {(provided, snapshot) => (
                <SwitchStyle onClick={this.handleInfoClick}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                ref={provided.innerRef}
                isDragging={snapshot.isDragging}
                switchSize={this.props.switch.size}
                >
                    {showInfo && <InfoDeleteWindow infoRef={this.infoRef} infoStr={infoStr} handleDelete={()=>undefined}/>}
                </SwitchStyle>      
            )}
            </Draggable>
        );
    }
}
export default withGlobalState(Switch)
