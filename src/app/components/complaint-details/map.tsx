"use client"

import React, { useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Map, divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-react';
import ReactDOMServer from 'react-dom/server';

interface ComplaintMapProps {
    lat: number;
    lng: number;
}

const ComplaintMap: React.FC<ComplaintMapProps> = ({ lat, lng }) => {
    const position: [number, number] = [lat, lng];
    const ZOOM_LEVEL = 16;
    const mapRef = useRef<Map | null>(null);

    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.setView(position, ZOOM_LEVEL);
        }
    }, [lat, lng, position]);

    const customIcon = divIcon({
        html: ReactDOMServer.renderToString(
          <MapPin className="text-red-500" style={{ fontSize: '24px' }} />
        ),
        iconSize: [24, 24],
        iconAnchor: [12, 24],
        className: 'bg-transparent border-none',
    });

    return (
        <div className="w-full h-[300px] border rounded-lg overflow-hidden">
            <MapContainer 
                center={position} 
                zoom={ZOOM_LEVEL} 
                scrollWheelZoom={true} 
                className="h-full w-full"
                ref={mapRef}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position} icon={customIcon}>
                    <Popup>
                        Localização aproximada da reclamação.
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default ComplaintMap;