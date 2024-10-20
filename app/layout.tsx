import './globals.css';
import Navbar from './components/Navbar'; 

export const metadata = {
  title: 'Cute Blog',
  description: 'A cute and responsive blog with a sweet navbar',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
