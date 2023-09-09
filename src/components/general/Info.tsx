// Info.tsx
import React, { useState, useRef, useEffect } from 'react';
import InfoIcon from '@mui/icons-material/Info'

export const infoWindowDefaultStyle = {
    position: 'absolute',
    backgroundColor: 'white',
    border: '1px solid gray',
    padding: '4px',
    borderRadius: '4px',
    zIndex: 1,
} as React.CSSProperties

type InfoWindowProps = {
    infoRef: React.RefObject<HTMLDivElement> | null;
    infoStr: string
    style?: React.CSSProperties
}

export const InfoWindow: React.FC<InfoWindowProps> = (props) => {
    const style = props.style ? props.style : infoWindowDefaultStyle;
    return <div ref={props.infoRef} style={style}>
        {props.infoStr}
    </div>
}

type InfoProps = {
    infoStr: string
}

export const Info: React.FC<InfoProps> = ({ infoStr }) => {
    const [showInfo, setShowInfo] = useState(false);
    const infoRef = useRef<HTMLDivElement | null>(null);

    const handleInfoClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation(); // Prevent click propagation to document
        setShowInfo(!showInfo);
    };

    useEffect(() => {
        // function that removes the visiablity of the info once the user clicked somewhere else
        const handleDocumentClick = (event: MouseEvent) => {
        if (showInfo && infoRef.current && !infoRef.current.contains(event.target as Node)) {
            setShowInfo(false);
        }
        };

        // attaching the event listener to the document
        document.addEventListener('click', handleDocumentClick);

        // removes the event listener when the window disappear
        return () => {
        document.removeEventListener('click', handleDocumentClick);
        };
    }, [showInfo]);

    return (
        <div onClick={handleInfoClick}>
            <InfoIcon sx={{ fontSize: '15px', paddingBottom: '4px' }}  />
            {showInfo && (<InfoWindow infoRef={infoRef} infoStr={infoStr} />
            )}
        </div>
    );
};