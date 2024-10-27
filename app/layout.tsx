import './globals.css';
import LayoutWrapper from './components/LayoutWrapper'; // New Client Component for Navbar/Footer

// export const metadata = {
//   title: 'Cute Blog',
//   description: 'A cute and responsive blog with a sweet navbar',
// };

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
