import { useEffect, useMemo, useState } from 'react';
import LanguageSelectModal from '../components/LanguageSelectModal';
import { USER_PREFERENCES } from '../config/userPreferences';
import Button from '../ui/Button';

export default function Settings() {
  const [showLang, setShowLang] = useState(false);
  const cookieName = useMemo(() => USER_PREFERENCES.languageCookie, []);

  useEffect(() => {
    document.body.style.background = '#1D2129';
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ marginTop: 0 }}>Settings</h1>
      <p>Change app preferences.</p>

      <div style={{ display: 'flex', gap: 12 }}>
        <Button variant="gray" onClick={() => setShowLang(true)}>Change language</Button>
      </div>

      <LanguageSelectModal
        isOpen={showLang}
        onClose={() => setShowLang(false)}
        cookieName={cookieName}
      />
    </div>
  );
}
