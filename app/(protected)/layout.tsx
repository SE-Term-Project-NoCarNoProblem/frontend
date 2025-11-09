import { ReactNode }  from 'react';
// import SuspendedModalLayout from '../components/SuspendedModalLayout';
import SuspendLayout from '../components/SuspendLayout';
import { AuthProvider } from '../components/AuthContext';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  console.log("Layout rendered");
  return <AuthProvider><SuspendLayout>{children}</SuspendLayout></AuthProvider>;
}
