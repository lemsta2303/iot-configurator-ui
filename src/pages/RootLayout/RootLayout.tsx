import { Outlet } from 'react-router-dom';
import Header from 'src/components/layout/Header';
import Sidebar from 'src/components/layout/Sidebar';

/**
 * RootLayout component that defines the main layout structure with a header, sidebar, and main content area.
 */
function RootLayout() {
  return (
    <div className="wrapper min-h-screen text-text flex flex-col">
      <Header className="h-35" />
      <div className={`flex flex-1 mt-35`}>
        <Sidebar />
        <main className="flex-1 p-30 py-15 w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default RootLayout;
