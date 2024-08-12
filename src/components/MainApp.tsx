// MainApp.tsx
import InputForm from './inputComponents/InputForm';
import BoxView from './BoxView';
import { MainAppStyle, MainContainerStyle } from './MainApp.styles';
import { BoardContextProvider } from '../hooks/BoardHook';

const MainApp = () => {

    return (
        <MainContainerStyle>
            <h1>Welcome to the lightbox project</h1>
            <MainAppStyle>
                <BoardContextProvider>
                    <InputForm />
                    <BoxView />
                </BoardContextProvider>
            </MainAppStyle>
        </MainContainerStyle>
    );
};

export default MainApp;
