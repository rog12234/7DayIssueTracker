
import {
    MapContainer,
    TileLayer,
    Marker,
    useMapEvents,
} from "react-leaflet";

import { Icon } from "leaflet";
import type { LatLngTuple } from "leaflet";

import "leaflet/dist/leaflet.css";

import markerIconUrl from "leaflet/dist/images/marker-icon.png";
import markerShadowUrl from "leaflet/dist/images/marker-shadow.png";

type LocationPickerProps = {
    latitude: number | null;
    longitude: number | null;
    onChange: (latitude: number, longitude: number) => void;
};

const defaultLocation: LatLngTuple = [
    18.0425,
    -63.0548,
];

const markerIcon = new Icon({
    iconUrl: markerIconUrl,
    shadowUrl: markerShadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

// Listens for clicks inside the map
function MapClickHandler({
    onSelect,
}: {
    onSelect: (lat: number, lng: number) => void;
}) {
    useMapEvents({
        click(e) {
            onSelect(e.latlng.lat, e.latlng.lng);
        },
    });

    return null;
}

export default function LocationPicker({
    latitude,
    longitude,
    onChange,
}: LocationPickerProps) {
    const selectedLocation: LatLngTuple | null =
        latitude !== null && longitude !== null
            ? [latitude, longitude]
            : null;

    const mapCenter = selectedLocation ?? defaultLocation;

    return (
        <div className="location-picker">
            <MapContainer
                center={mapCenter}
                zoom={selectedLocation ? 16 : 12}
                scrollWheelZoom={false}
                className="location-picker-map"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                    maxZoom={19}
                />

                <MapClickHandler onSelect={onChange} />

                {selectedLocation && (
                    <Marker
                        position={selectedLocation}
                        icon={markerIcon}
                    />
                )}
            </MapContainer>

            {selectedLocation ? (
                <p className="map-coordinates">
                    Latitude: {latitude?.toFixed(5)}
                    <br />
                    Longitude: {longitude?.toFixed(5)}
                </p>
            ) : (
                <p className="map-coordinates">
                    No location selected.
                </p>
            )}
        </div>
    );
}
