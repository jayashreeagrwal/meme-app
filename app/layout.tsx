import { AuthProvider } from '@/lib/contexts/AuthContext';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { Navigation } from '@/components/Navigation';

export const metadata = {
  title: 'MemeMaster',
  description: 'Full-Stack Meme Voting Platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <AuthProvider>
          <Navigation />
          {children}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#374151',
                borderRadius: '0.75rem',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
