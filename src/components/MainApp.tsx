// MainApp.tsx
import BoxView from './BoxView';
import { MainAppStyle, MainContainerStyle } from './MainApp.styles';
import { BoardContextProvider } from '../hooks/BoardHook';

const MainApp = () => {

    return (
        <MainContainerStyle>
            <h1 style={{textAlign: "center"}}>Welcome to the lightbox project</h1>
            <MainAppStyle>
                <BoardContextProvider>
                    <BoxView />
                </BoardContextProvider>
            </MainAppStyle>
        </MainContainerStyle>
    );
};

export default MainApp;
