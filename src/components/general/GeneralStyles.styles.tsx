import styled from "@emotion/styled";

export const Title = styled.h6(() => ({
    margin: 0,
    padding: '8px',
    textAlign: 'center'
}));

export const FlexBox = styled.div({
    display: 'flex',
    flex: 1,
})

export const ColumnFlexBox = styled.div({
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
})