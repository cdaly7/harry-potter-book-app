import elderWand from '../../assets/elder-wand.svg';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({ message = 'Loading...' }: LoadingSpinnerProps) {
  return (
    <div className="loading-spinner-container">
      <img src={elderWand} alt="Loading" className="loading-spinner" />
      <p className="loading-message">{message}</p>
    </div>
  );
}
