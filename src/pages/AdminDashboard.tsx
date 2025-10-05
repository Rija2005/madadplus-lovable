
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { listenToLiveAmbulances, getEmergencyReports, updateReportStatus, EmergencyReport } from '@/services/backendHooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Leaflet icon fix
import L from 'leaflet';
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

export const AdminDashboard = () => {
  const [reports, setReports] = useState<EmergencyReport[]>([]);
  const [liveAmbulances, setLiveAmbulances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      const fetchedReports = await getEmergencyReports();
      setReports(fetchedReports);
      setLoading(false);
    };
    fetchReports();

    const unsubscribe = listenToLiveAmbulances(ambulances => {
      setLiveAmbulances(ambulances);
    });

    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (reportId: string, status: EmergencyReport['status']) => {
    await updateReportStatus(reportId, status);
    setReports(reports.map(r => r.id === reportId ? { ...r, status } : r));
  };

  return (
    <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2">
        <h1 className="text-2xl font-bold mb-4">Live Ambulance Map</h1>
        <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false} style={{ height: '600px', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {liveAmbulances.map(amb => (
            <Marker key={amb.id} position={[amb.location.latitude, amb.location.longitude]}>
              <Popup>Ambulance ID: {amb.id}<br/>Status: {amb.status}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      <div>
        <h1 className="text-2xl font-bold mb-4">Emergency Reports</h1>
        <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {loading ? <p>Loading reports...</p> : reports.map(report => (
                <Card key={report.id}>
                    <CardHeader><CardTitle>{report.title}</CardTitle></CardHeader>
                    <CardContent>
                        <p>{report.description}</p>
                        <p className="text-sm text-muted-foreground">{report.location.address}</p>
                        <Select value={report.status} onValueChange={(value) => handleStatusChange(report.id, value as any)}>
                            <SelectTrigger><SelectValue/></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="submitted">Submitted</SelectItem>
                                <SelectItem value="acknowledged">Acknowledged</SelectItem>
                                <SelectItem value="resolved">Resolved</SelectItem>
                            </SelectContent>
                        </Select>
                    </CardContent>
                </Card>
            ))}
        </div>
      </div>
    </div>
  );
};
