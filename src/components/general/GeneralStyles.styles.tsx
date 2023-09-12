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

export const InfoWindowStyle = styled.div({
    backgroundColor: 'whitesmoke',
    border: "1px solid black",
    fontSize: '5',
});

export const Div = styled.div({})

export const smallIcon = {"fontSize": 10, "padding": 0}

export const mediumIcon = {"fontSize": 15, "padding": 0}