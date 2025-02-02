// src/components/ui/BackButton.tsx
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate('/')}
      className="fixed top-4 left-4 z-50 bg-black text-matrix-green px-4 py-2 border border-matrix-green rounded"
    >
      Back
    </button>
  );
};

export default BackButton;
