// BoardMenu.tsx
import { useBoard } from "../hooks/BoardHook"
import React, { LegacyRef } from 'react'
import { mediumIcon, ISFlexBox } from './general/GeneralStyles.styles'
import { WhiteFlexBox } from './BoardMenu.styles'
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined'
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import CleaningServicesOutlinedIcon from '@mui/icons-material/CleaningServicesOutlined'
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined'
import { Tooltip } from 'react-tooltip'
import { AddCompartmentMenu } from './AddCompartmentMenu'


export const BoardMenu: React.FC = () => {
    const { board, setBoard} = useBoard()
    const InfoAnchorRef = React.useRef<HTMLDivElement>(null)
    const [ isAddCompOpen, setAddCompOpen] = React.useState(false)

    const openAddCompartmentMenu = () =>  setAddCompOpen(true)

    const clearBoard = (event: React.MouseEvent<HTMLElement>) => {
        const newBoard = board.clone()
        newBoard.clearBoard()
        setBoard(newBoard)
    }

    return (
        <WhiteFlexBox  ref={InfoAnchorRef as LegacyRef<HTMLDivElement> | undefined } >
            <Tooltip id="add-switch" style={{zIndex: 30000}}/>
            <Tooltip id="add-comp" style={{zIndex: 30000}}/>
            <Tooltip id="edit" style={{zIndex: 30000}}/>
            <Tooltip id="clear" style={{zIndex: 30000}}/>

            <ISFlexBox  data-tooltip-id="add-switch" data-tooltip-content="Add Switch" data-tooltip-place="bottom-start">
                <AddCircleOutlineOutlinedIcon sx={mediumIcon}/>
            </ISFlexBox>

            <ISFlexBox data-tooltip-id="add-comp" data-tooltip-content="Add Compartment" data-tooltip-place="bottom-start"
                onClick={openAddCompartmentMenu}>
                <AddBoxOutlinedIcon sx={mediumIcon}/>
            </ISFlexBox>

            <ISFlexBox data-tooltip-id="edit" data-tooltip-content="Edit Board Size" data-tooltip-place="bottom-start">
                <ModeEditOutlinedIcon sx={mediumIcon} />
            </ISFlexBox>

            <ISFlexBox data-tooltip-id="clear" data-tooltip-content="Clear Board" data-tooltip-place="bottom-start"
                onClick={clearBoard}>
                <CleaningServicesOutlinedIcon sx={mediumIcon}/>
            </ISFlexBox>

        <AddCompartmentMenu isOpen={isAddCompOpen} setIsOpen={setAddCompOpen}/> 
           
        </WhiteFlexBox>
    )
}