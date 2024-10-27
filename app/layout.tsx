import './globals.css';
import LayoutWrapper from './components/LayoutWrapper'; // New Client Component for Navbar/Footer



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <LayoutWrapper> {/* Use Client Component to handle both layouts */}
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
