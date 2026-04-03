import { useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MapPin, Crosshair } from "lucide-react";

// Fix default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface LocationPickerProps {
  latitude: number | null;
  longitude: number | null;
  onLocationChange: (lat: number, lng: number) => void;
  onLocationNameChange?: (name: string) => void;
}

const ClickHandler = ({ onLocationChange }: { onLocationChange: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click(e) {
      onLocationChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const RecenterMap = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);
  return null;
};

const LocationPicker = ({ latitude, longitude, onLocationChange, onLocationNameChange }: LocationPickerProps) => {
  const [center, setCenter] = useState<[number, number]>([20.5937, 78.9629]);
  const [latInput, setLatInput] = useState("");
  const [lngInput, setLngInput] = useState("");
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      setCenter([latitude, longitude]);
      setLatInput(latitude.toFixed(6));
      setLngInput(longitude.toFixed(6));
    }
  }, [latitude, longitude]);

  useEffect(() => {
    if (latitude === null && longitude === null) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude: lat, longitude: lng } = pos.coords;
          setCenter([lat, lng]);
          onLocationChange(lat, lng);
        },
        () => {},
        { timeout: 5000 }
      );
    }
  }, []);

  const handleManualLatLng = useCallback(() => {
    const lat = parseFloat(latInput);
    const lng = parseFloat(lngInput);
    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      onLocationChange(lat, lng);
    }
  }, [latInput, lngInput, onLocationChange]);

  const handleMapClick = useCallback((lat: number, lng: number) => {
    onLocationChange(lat, lng);
    // Reverse geocode for location name
    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
      .then(r => r.json())
      .then(data => {
        if (data.display_name && onLocationNameChange) {
          const parts = data.display_name.split(",").slice(0, 3).join(",").trim();
          onLocationNameChange(parts);
        }
      })
      .catch(() => {});
  }, [onLocationChange, onLocationNameChange]);

  const handleLocateMe = () => {
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        handleMapClick(pos.coords.latitude, pos.coords.longitude);
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="space-y-3">
      {/* Manual lat/lng inputs */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs">Latitude</Label>
          <Input
            type="number"
            step="any"
            value={latInput}
            onChange={(e) => setLatInput(e.target.value)}
            onBlur={handleManualLatLng}
            placeholder="20.5937"
            className="text-sm"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Longitude</Label>
          <Input
            type="number"
            step="any"
            value={lngInput}
            onChange={(e) => setLngInput(e.target.value)}
            onBlur={handleManualLatLng}
            placeholder="78.9629"
            className="text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" size="sm" onClick={handleLocateMe} disabled={locating} className="text-xs">
          <Crosshair className="h-3.5 w-3.5 mr-1.5" />
          {locating ? "Locating..." : "Use My Location"}
        </Button>
        <span className="text-xs text-muted-foreground">or click on the map</span>
      </div>

      {/* Map */}
      <div className="rounded-xl overflow-hidden border border-border" style={{ height: 280 }}>
        <MapContainer
          center={center}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onLocationChange={handleMapClick} />
          {latitude !== null && longitude !== null && (
            <>
              <Marker position={[latitude, longitude]} />
              <RecenterMap lat={latitude} lng={longitude} />
            </>
          )}
        </MapContainer>
      </div>

      {latitude !== null && longitude !== null && (
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <MapPin className="h-3 w-3" /> {latitude.toFixed(5)}, {longitude.toFixed(5)}
        </p>
      )}
    </div>
  );
};

export default LocationPicker;
