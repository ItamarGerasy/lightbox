// MainApp.tsx
import { InputForm } from './InputForm';
import BoxView from './BoxView';
import { MainAppStyle, MainContainerStyle } from './MainApp.styles';
import { GlobalStateProvider } from './MainAppState';

const MainApp = () => {

    return (
        <MainContainerStyle>
            <h1>Welcome to the lightbox project</h1>
            <MainAppStyle>
                <GlobalStateProvider>
                    <InputForm />
                    <BoxView />
                </GlobalStateProvider>
            </MainAppStyle>
        </MainContainerStyle>
    );
};

export default MainApp;
