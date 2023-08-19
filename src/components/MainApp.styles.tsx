// MainApp.styles.tsx
import styled from "@emotion/styled";

export const MainAppStyle = styled.div({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1, // Allow the content to expand and fill the remaining vertical space
});

export const MainContainerStyle = styled.div({
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh', // Set the container to fill the viewport height
});