import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HealthCheck() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard if accessed directly
    navigate('/');
  }, [navigate]);

  return null;
}