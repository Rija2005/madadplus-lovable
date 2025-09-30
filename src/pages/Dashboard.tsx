import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin, 
  Filter, 
  AlertTriangle,
  Heart,
  Flame,
  Shield,
  Car,
  Clock,
  Eye,
  CheckCircle,
  XCircle,
  Calendar,
  TrendingUp,
  Users,
  Activity
} from 'lucide-react';
import { getEmergencyReports, EmergencyReport } from '@/services/backendHooks';
import { useLanguage } from '@/contexts/LanguageContext';

const Dashboard = () => {
  const { t } = useLanguage();
  const [reports, setReports] = useState<EmergencyReport[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  useEffect(() => {
    // Load reports from backend
    const loadReports = async () => {
      const data = await getEmergencyReports();
      setReports(data);
    };
    loadReports();
  }, []);

  // Category statistics
  const stats = {
    total: reports.length,
    medical: reports.filter(r => r.type === 'medical').length,
    fire: reports.filter(r => r.type === 'fire').length,
    crime: reports.filter(r => r.type === 'crime').length,
    traffic: reports.filter(r => r.type === 'traffic').length,
    pending: reports.filter(r => r.status === 'submitted').length,
    active: reports.filter(r => r.status === 'acknowledged' || r.status === 'dispatched').length,
    resolved: reports.filter(r => r.status === 'resolved').length,
  };

  const getCategoryIcon = (type: string) => {
    switch (type) {
      case 'medical': return Heart;
      case 'fire': return Flame;
      case 'crime': return Shield;
      case 'traffic': return Car;
      default: return AlertTriangle;
    }
  };

  const getCategoryColor = (type: string) => {
    switch (type) {
      case 'medical': return 'emergency';
      case 'fire': return 'warning';
      case 'crime': return 'destructive';
      case 'traffic': return 'primary';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'secondary';
      case 'acknowledged': return 'warning';
      case 'dispatched': return 'primary';
      case 'resolved': return 'success';
      default: return 'secondary';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'emergency';
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  // Filter reports
  const filteredReports = reports.filter(report => {
    const matchesType = filterType === 'all' || report.type === filterType;
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          report.location.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Emergency Response Dashboard</h1>
          <p className="text-muted-foreground">
            ہنگامی ردعمل ڈیش بورڈ • Monitor and manage emergency reports in real-time
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Activity className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Reports</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Heart className="w-6 h-6 text-emergency mx-auto mb-2" />
                <p className="text-2xl font-bold">{stats.medical}</p>
                <p className="text-xs text-muted-foreground">Medical</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Flame className="w-6 h-6 text-warning mx-auto mb-2" />
                <p className="text-2xl font-bold">{stats.fire}</p>
                <p className="text-xs text-muted-foreground">Fire</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Shield className="w-6 h-6 text-destructive mx-auto mb-2" />
                <p className="text-2xl font-bold">{stats.crime}</p>
                <p className="text-xs text-muted-foreground">Crime</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Car className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold">{stats.traffic}</p>
                <p className="text-xs text-muted-foreground">Traffic</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <TrendingUp className="w-6 h-6 text-warning mx-auto mb-2" />
                <p className="text-2xl font-bold">{stats.active}</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <CheckCircle className="w-6 h-6 text-success mx-auto mb-2" />
                <p className="text-2xl font-bold">{stats.resolved}</p>
                <p className="text-xs text-muted-foreground">Resolved</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search reports by location, description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 rounded-md border border-input bg-background"
              >
                <option value="all">All Categories</option>
                <option value="medical">Medical</option>
                <option value="fire">Fire</option>
                <option value="crime">Crime</option>
                <option value="traffic">Traffic</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 rounded-md border border-input bg-background"
              >
                <option value="all">All Status</option>
                <option value="submitted">Submitted</option>
                <option value="acknowledged">Acknowledged</option>
                <option value="dispatched">Dispatched</option>
                <option value="resolved">Resolved</option>
              </select>

              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                onClick={() => setViewMode('list')}
              >
                List
              </Button>
              <Button
                variant={viewMode === 'map' ? 'default' : 'outline'}
                onClick={() => setViewMode('map')}
              >
                Map
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Reports List */}
        {viewMode === 'list' && (
          <div className="space-y-4">
            {filteredReports.length === 0 ? (
              <Card>
                <CardContent className="pt-12 pb-12 text-center">
                  <AlertTriangle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Reports Found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery || filterType !== 'all' || filterStatus !== 'all'
                      ? 'Try adjusting your filters'
                      : 'No emergency reports have been submitted yet'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredReports.map((report) => {
                const CategoryIcon = getCategoryIcon(report.type);
                const categoryColor = getCategoryColor(report.type);
                
                return (
                  <Card key={report.id} className="hover:shadow-primary transition-all duration-300">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className={`w-12 h-12 bg-${categoryColor}/10 rounded-lg flex items-center justify-center flex-shrink-0`}>
                            <CategoryIcon className={`w-6 h-6 text-${categoryColor}`} />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-semibold text-lg">{report.title}</h3>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                                  <div className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    <span>{report.location.address}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    <span>{new Date(report.timestamp).toLocaleString()}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <p className="text-muted-foreground mb-3">{report.description}</p>
                            
                            <div className="flex flex-wrap gap-2">
                              <Badge variant={getCategoryColor(report.type) as any}>
                                {report.type}
                              </Badge>
                              <Badge variant={getStatusColor(report.status) as any}>
                                {report.status.replace('_', ' ')}
                              </Badge>
                              <Badge variant={getPriorityColor(report.priority) as any}>
                                {report.priority} priority
                              </Badge>
                              {report.isAnonymous && (
                                <Badge variant="outline">
                                  <Eye className="w-3 h-3 mr-1" />
                                  Anonymous
                                </Badge>
                              )}
                              {report.media && (report.media.photos?.length || report.media.videos?.length || report.media.audio?.length) && (
                                <Badge variant="outline">
                                  Has Evidence
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 ml-4">
                          <Button variant="default" size="sm">
                            View Details
                          </Button>
                          <Button variant="outline" size="sm">
                            Update Status
                          </Button>
                          <Button variant="outline" size="sm">
                            Assign Team
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        )}

        {/* Map View Placeholder */}
        {viewMode === 'map' && (
          <Card>
            <CardContent className="p-8 text-center">
              <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Interactive Map Coming Soon</h3>
              <p className="text-muted-foreground mb-6">
                The map view will show all incident locations with color-coded markers based on category and priority.
                Real-time updates will show emergency responder locations and routes.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                <div className="p-4 bg-emergency/10 rounded-lg">
                  <Heart className="w-8 h-8 text-emergency mx-auto mb-2" />
                  <p className="text-sm font-medium">Medical</p>
                  <p className="text-xs text-muted-foreground">Red markers</p>
                </div>
                <div className="p-4 bg-warning/10 rounded-lg">
                  <Flame className="w-8 h-8 text-warning mx-auto mb-2" />
                  <p className="text-sm font-medium">Fire</p>
                  <p className="text-xs text-muted-foreground">Orange markers</p>
                </div>
                <div className="p-4 bg-destructive/10 rounded-lg">
                  <Shield className="w-8 h-8 text-destructive mx-auto mb-2" />
                  <p className="text-sm font-medium">Crime</p>
                  <p className="text-xs text-muted-foreground">Dark red markers</p>
                </div>
                <div className="p-4 bg-primary/10 rounded-lg">
                  <Car className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium">Traffic</p>
                  <p className="text-xs text-muted-foreground">Blue markers</p>
                </div>
              </div>
              <Button variant="outline" onClick={() => setViewMode('list')} className="mt-6">
                Back to List View
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
