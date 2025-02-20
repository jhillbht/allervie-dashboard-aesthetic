import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import TestPage from './pages/test';
import AuthCallback from './pages/auth/callback';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/test',
    element: <TestPage />,
  },
  {
    path: '/auth/callback',
    element: <AuthCallback />,
  }
]);