//Board.styles.tsx 
import styled from "@emotion/styled";

export const BoardStyle = styled.div({
  border: '8px solid black',
  padding: '8px',
  flexDirection: 'row',
  alignItems: 'flex-start',
  position: 'relative',
  width: '100%',
  height: '100%',
  boxSizing: 'border-box', // Add box-sizing property
  overflow: 'hidden', // Hide overflowing compartments
  justifyContent: 'flex-start', // Align compartments to the left
  display: 'flex',
  flex: 1,
});
