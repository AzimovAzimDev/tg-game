import Modal from './Modal';
import Button from '../ui/Button';
import failImg from '../assets/unseccessful.png';

export type UnsuccessModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onPlayAgain: () => void;
};

export default function UnsuccessModal({ isOpen, onClose, onPlayAgain }: UnsuccessModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} ariaLabel="Неуспех">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <img src={failImg} alt="Неуспех" style={{ height: '30vh', width: 'auto', borderRadius: 12 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', alignItems: 'stretch' }}>
          <Button onClick={onPlayAgain}>Сыграть ещё раз</Button>
        </div>
      </div>
    </Modal>
  );
}
