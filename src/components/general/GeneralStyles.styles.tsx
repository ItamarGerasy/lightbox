import styled from "@emotion/styled";

export const Title = styled.h6(() => ({
    margin: 0,
    padding: '8px',
    textAlign: 'center'
}));

export const FlexBox = styled.div({
    display: 'flex',
    flex: 1,
    height: '100%',
    width: '100%',
    zIndex: 'inherit'
})

export const FlexBoxSpaceBetween = styled.div({
    display: 'flex',
    flex: 1,
    height: '100%',
    width: '100%',
    zIndex: 'inherit',
    justifyContent: "space-between"
})

/**Inherit from FlexBox */
export const ISFlexBox = styled.div({
    display: 'flex',
    flex: 1,
    height: '10px',
    width: 'inherit',
    zIndex: 'inherit',
    alignItems: 'center',
})

export const ColumnFlexBox = styled.div({
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    height: '100%',
    width: '100%'
})

export const InfoWindowStyle = styled.div({
    backgroundColor: 'whitesmoke',
    border: "1px solid black",
    fontSize: '5',
});

export const Div = styled.div({})

export const smallIcon = {"fontSize": 10, "padding": 0}

export const mediumIcon = {"fontSize": 15, "padding": 0}