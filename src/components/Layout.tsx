import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Phone, 
  Menu, 
  X, 
  Home, 
  Ambulance, 
  Hospital, 
  Heart,
  Shield,
  AlertTriangle,
  Globe
} from 'lucide-react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();

  const navigation = [
    { name: 'nav.emergency', href: '/', icon: Home, color: 'emergency' },
    { name: 'nav.ambulance', href: '/ambulance', icon: Ambulance, color: 'primary' },
    { name: 'nav.hospitals', href: '/hospitals', icon: Hospital, color: 'success' },
    { name: 'nav.firstAid', href: '/first-aid', icon: Heart, color: 'warning' },
    { name: 'nav.reports', href: '/reports', icon: Shield, color: 'secondary' },
  ];

  const isActive = (href: string) => location.pathname === href;

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ur' : 'en');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-50 shadow-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary">
                  {t('header.title')}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {t('header.subtitle')}
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1">
              {navigation.map((item) => (
                <Link key={item.name} to={item.href}>
                  <Button
                    variant={isActive(item.href) ? 'default' : 'ghost'}
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <item.icon className="w-4 h-4" />
                    {t(item.name)}
                  </Button>
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              {/* Theme Toggle */}
              <ThemeToggle />
              
              {/* Language Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={toggleLanguage}
                className="flex items-center gap-2"
              >
                <Globe className="w-4 h-4" />
                {language === 'en' ? 'اردو' : 'EN'}
              </Button>

              {/* Emergency Call */}
              <Button variant="emergency" size="sm" className="hidden sm:flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {t('nav.callEmergency')}
              </Button>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-card">
            <div className="px-4 py-2 space-y-1">
              {navigation.map((item) => (
                <Link key={item.name} to={item.href}>
                  <Button
                    variant={isActive(item.href) ? 'default' : 'ghost'}
                    className="w-full justify-start gap-3"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    {t(item.name)}
                  </Button>
                </Link>
              ))}
              <div className="pt-2 border-t">
                <Button variant="emergency" className="w-full gap-2">
                  <Phone className="w-4 h-4" />
                  {t('nav.emergencyCall')}
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Offline Indicator */}
      <OfflineIndicator />

      {/* Emergency FAB for mobile */}
      <div className="fixed bottom-6 right-6 z-40 md:hidden">
        <Button
          variant="emergency"
          size="icon"
          className="w-14 h-14 rounded-full shadow-emergency"
        >
          <Phone className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};


export default Layout;