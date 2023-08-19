import styled from "@emotion/styled"
import switch1Img from "../pictures/1switch-frontview.png"
import switch2Img from "../pictures/2switch-fronview.png"
import switch3Img from "../pictures/3switch-frontview.png"
import switch4Img from "../pictures/4switch-frontview.png"

function getSwitchImg(size: number){
    switch(size){
        case 1:
            return switch1Img;
        case 2:
            return switch2Img;
        case 3:
            return switch3Img;
        case 4:
            return switch4Img
    }
}

type SwitchStyleProps = {
    isDragging: boolean;
    switchSize: number;
}

export const SwitchStyle = styled.div((props: SwitchStyleProps) => ({
    display: "flex" as const,
    height: "100%",
    width: `${15*props.switchSize}px`, // Assuming each SwitchSpot has a width of 50px
    backgroundImage: `url('${getSwitchImg(props.switchSize)}')`, // Set the background image
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    objectFit: 'fill',
    backgroundSize: '100% 100%',
    backgroundColor: props.isDragging ? 'rgba(211, 211, 211, 0.5)' : '',
    margin: 0,
    padding: 0,
    border: "1px solid black",
}));


