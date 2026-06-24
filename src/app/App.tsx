import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { EmployeeDirectory } from './pages/EmployeeDirectory';
import { AttendanceLogs } from './pages/AttendanceLogs';
import { LeaveRequests } from './pages/LeaveRequests';
import { Analytics } from './pages/Analytics';
import { SettingsPage } from './pages/Settings';
import { initStore } from '../store/dataStore';

initStore();

function getInitialPage(): string {
  return window.location.hash.replace('#', '') || '/';
}

export default function App() {
  const [activePage, setActivePage] = useState(getInitialPage);

  useEffect(() => {
    function onHashChange() {
      setActivePage(window.location.hash.replace('#', '') || '/');
    }
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  function navigate(href: string) {
    window.location.hash = href;
    setActivePage(href);
  }

  function renderPage() {
    switch (activePage) {
      case '/employees': return <EmployeeDirectory />;
      case '/attendance': return <AttendanceLogs />;
      case '/leave': return <LeaveRequests />;
      case '/analytics': return <Analytics />;
      case '/settings': return <SettingsPage />;
      default: return <Dashboard />;
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] dark">
      <Sidebar activePage={activePage} onNavigate={navigate} />
      <div className="ml-64">
        <Header activePage={activePage} />
        {renderPage()}
      </div>
    </div>
  );
}
