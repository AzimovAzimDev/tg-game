import { useCallback } from 'react';
import Modal from './Modal';
import i18n from '../i18n';
import logo from '../assets/main.png';
import { USER_PREFERENCES } from '../config/userPreferences';

const btnStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '15px 12px',
  gap: 10,
  width: 329,
  minWidth: 50,
  height: 52,
  background: '#2E333E',
  borderRadius: 16,
  border: 'none',
  color: '#FFFFFF',
  cursor: 'pointer',
  fontFamily: 'Golos Text, system-ui, sans-serif',
  fontStyle: 'normal',
  fontWeight: 500,
  fontSize: 16,
  lineHeight: '19px',
};

const textStyle: React.CSSProperties = {
  width: 329,
  height: 19,
  fontFamily: 'Golos Text, system-ui, sans-serif',
  fontStyle: 'normal',
  fontWeight: 500,
  fontSize: 16,
  lineHeight: '19px',
  textAlign: 'center',
  color: '#FFFFFF',
};

export type LanguageSelectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  cookieName?: string;
};

function setCookie(name: string, value: string, days = 365) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${d.toUTCString()};path=/`;
}

export default function LanguageSelectModal({ isOpen, onClose, cookieName }: LanguageSelectModalProps) {
  const ck = cookieName ?? USER_PREFERENCES.languageCookie;
  const choose = useCallback(
    (lng: 'ru' | 'kk') => {
      i18n.changeLanguage(lng);
      setCookie(ck, lng);
      onClose();
    },
    [ck, onClose]
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} ariaLabel="Выбор языка">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <img src={logo} alt="Logo" style={{ height: '30vh', width: 'auto', borderRadius: 12 }} />
        <div style={textStyle}>Выберите язык / Tiлдi таңдаңыз</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', alignItems: 'center' }}>
          <button style={btnStyle} onClick={() => choose('ru')}>
            Русский
          </button>
          <button style={btnStyle} onClick={() => choose('kk')}>
            Қазақша
          </button>
        </div>
      </div>
    </Modal>
  );
}
