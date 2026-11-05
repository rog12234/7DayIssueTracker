import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
} from "react-leaflet";

import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIconUrl from "leaflet/dist/images/marker-icon.png";
import markerShadowUrl from "leaflet/dist/images/marker-shadow.png";

import type { Issue } from "./NewIssueCard";

type IssueMapProps = {
    issue: Issue;
};

// Default location: Sint Maarten
const defaultLocation: [number, number] = [
    18.0425,
    -63.0548,
];

// Custom marker configuration
const markerIcon = new Icon({
    iconUrl: markerIconUrl,
    shadowUrl: markerShadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

export default function IssueMap({ issue }: IssueMapProps) {
    const issueLocation: [number, number] | null =
        typeof issue.latitude === "number" &&
            typeof issue.longitude === "number" &&
            Number.isFinite(issue.latitude) &&
            Number.isFinite(issue.longitude)
            ? [issue.latitude, issue.longitude]
            : null;

    const mapCenter = issueLocation ?? defaultLocation;

    return (
        <div>
            <MapContainer
                key={issue.id}
                center={mapCenter}
                zoom={issueLocation ? 16 : 12}
                scrollWheelZoom={false}
                className="issue-map"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                    maxZoom={19}
                />

                {issueLocation && (
                    <Marker
                        position={issueLocation}
                        icon={markerIcon}
                    >
                        <Popup>
                            <strong>{issue.title}</strong>
                            <p>Category: {issue.category}</p>
                            <p>Status: {issue.status}</p>
                        </Popup>
                    </Marker>
                )}
            </MapContainer>

            {issueLocation ? (
                <p className="map-coordinates">
                    Latitude: {issueLocation[0].toFixed(5)}
                    <br />
                    Longitude: {issueLocation[1].toFixed(5)}
                </p>
            ) : (
                <p className="map-coordinates">
                    Location not assigned yet. Showing Sint Maarten.
                </p>
            )}
        </div>
    );
}