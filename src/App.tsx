import MainApp from "./components/MainApp"
import { useEffect } from "react"

export default function App() {
    useEffect(() => {
        document.title = "ThunderBox"
      }, []);
    return (
            <MainApp />
    );
}