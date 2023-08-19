// InfoDragRemove.tsx
import React from 'react'
import { DraggableProvided } from 'react-beautiful-dnd';
import DeleteIcon from '@mui/icons-material/Delete';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import { Info } from './Info'

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
        <div style={{backgroundColor: 'lightblue'}}>
            <div {...provided.dragHandleProps}>
                <DragHandleIcon sx={{ fontSize: '15px' }} />
            </div>
            <Info infoStr={infoStr} />
            <DeleteIcon sx={{ fontSize: '15px' }} />
        </div>
    );
};