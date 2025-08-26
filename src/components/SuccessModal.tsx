import Modal from './Modal';
import Button from '../ui/Button';
import successImg from '../assets/successful.png';

export type SuccessModalProps = {
  isOpen: boolean;
  onClose: () => void;
  score?: number;
  onSubmitScore: () => void;
  onPlayAgain: () => void;
};

export default function SuccessModal({ isOpen, onClose, score, onSubmitScore, onPlayAgain }: SuccessModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} ariaLabel="Успех">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <img src={successImg} alt="Успех" style={{ height: '30vh', width: 'auto', borderRadius: 12 }} />
        {typeof score === 'number' && (
          <div style={{ color: '#fff', fontFamily: 'Golos Text, system-ui, sans-serif', fontSize: 16, opacity: 0.9 }}>
            Ваши баллы: <strong>{score}</strong>
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', alignItems: 'stretch' }}>
          <Button onClick={onSubmitScore}>Засчитать мои балы</Button>
          <Button variant="gray" onClick={onPlayAgain}>Сыграть ещё раз</Button>
        </div>
      </div>
    </Modal>
  );
}
