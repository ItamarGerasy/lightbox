// InfoDragRemove.tsx
import React from 'react'
import { DraggableProvided } from 'react-beautiful-dnd';
import DeleteIcon from '@mui/icons-material/Delete';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import { Info } from './Info'
import InfoIcon from '@mui/icons-material/Info'

type InfoDragRemoveProps = {
    provided: DraggableProvided;
    infoStr: string;
  };
  
export const InfoDragRemove: React.FC<InfoDragRemoveProps> = ({ provided, infoStr }) => {
    // const [isInfoOpen, setIsInfoOpen] = useState(false);

    // const handleInfoClick = () => {
    //     setIsInfoOpen(!isInfoOpen);
    // };

    return (
        <div style={{backgroundColor: 'lightblue', display: 'flex', flexDirection: 'column', height: '100%'}}>
            <div {...provided.dragHandleProps} style={{display: 'flex'}}>
                <DragHandleIcon sx={{ fontSize: '15px' }} />
            </div>
            <InfoIcon sx={{ fontSize: '15px' }}/>
            <DeleteIcon sx={{ fontSize: '15px' }} />
        </div>
    );
};