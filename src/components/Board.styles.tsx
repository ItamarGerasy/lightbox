//Board.styles.tsx 
import styled from "@emotion/styled";

export const BoardStyle = styled.div({
  border: '8px solid black',
  padding: '3px',
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
  flexWrap: "wrap"
})

export const BoardH = styled.div({
  display: 'flex',
  flex: `1 1 10%`,
  justifyContent: 'center', 
  top: 0, 
  border: "2px solid yellow",
  width: '100%',
  height: '8%',
  backgroundColor: 'white',
  alignSelf: 'flex-start',
  flexDirection: 'row',
  alignItems: 'center',
})

export const Compartments = styled.div({
  display: 'flex',
  flex: '10 0 90%',
  flexDirection: 'row',
  alignSelf: 'flex-end',
  width: '100%',
  height: '90%'
})
