// InfoDragRemove.tsx
import React from 'react'
import { DraggableProvided } from 'react-beautiful-dnd';
import DeleteIcon from '@mui/icons-material/Delete';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import { Info } from './Info'
import InfoIcon from '@mui/icons-material/Info'
import { FlexBox, ColumnFlexBox } from '../general/GeneralStyles.styles'

type InfoDragRemoveProps = {
    provided: DraggableProvided;
    infoStr: string;
  };
  
export const InfoDragRemove: React.FC<InfoDragRemoveProps> = ({ provided, infoStr }) => {

    return (
        <ColumnFlexBox style={{backgroundColor: 'lightblue'}}>
            <FlexBox {...provided.dragHandleProps}>
                <DragHandleIcon sx={{ fontSize: '15px' }} />
            </FlexBox>
            <InfoIcon sx={{ fontSize: '15px' }}/>
            <DeleteIcon sx={{ fontSize: '15px' }} />
        </ColumnFlexBox>
    );
};