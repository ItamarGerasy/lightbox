// Compartmen.styles.tsx
import styled from "@emotion/styled";

type CompartmentStyleProps = {
    isDragging: boolean
}

export const CompartmentStyle = styled.div((props: CompartmentStyleProps) => ({
    border: '5px solid red',
    width: '100%',
    height: '100%',
    boxSizing: 'border-box', // Add box-sizing property
    marginBottom: '8px', // Add some spacing between compartments
    position: 'relative', // Add position property for dimension display
    display: 'flex',
    marginRight: '2px', // Add some spacing between compartments (horizontal spacing)
    marginLeft: '2px',
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
}));

type ModulesListProps = {
    isDraggingOver: boolean
}

export const ModulesList = styled.div((props:ModulesListProps) => ({
    transition: "background-color 0.2s ease",
    backgroundColor: props.isDraggingOver ? 'lightgrey' : 'inherit',
    flexGrow: 1,
}))
