// Module.styles.tsx
import styled from "@emotion/styled";
import dinRailImage from "../pictures/DIN-rail.png";

type ModuleStyleProps = {
  isDragging: boolean;
}

export const ModuleStyle = styled.div((props: ModuleStyleProps) => ({
    display: "flex" as const,
    flexWrap: "nowrap" as const,
    flexDirection: "row",
    alignItems: "flex-start",
    width: "100%", 
    height: "80%", // Adjusted height
    maxHeight: "15%",
    overflow: "hidden", // Hide any overflowing content
    backgroundImage: `url('${dinRailImage}')`, // Set the background image
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "100% 120%", // Set background size to 100% width and 50% height
    border: "1px solid blue",
    flex: 1,
}));

type SwitchesListProps = {
  isDraggingOver: boolean;
}

export const SwitchesList = styled.div((props:SwitchesListProps) => ({
  transition: "background-color 0.2s ease",
  backgroundColor: props.isDraggingOver ? 'lightgrey' : 'inherit',
  flexGrow: 1,
  overflow: "hidden", // Hide any overflowing content
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  height: '100%',
  width: '100%',
}))
