import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import s from './ProfilePage.module.css';

// Types for list items
 type Item = {
  id: string;
  icon: 'trophy' | 'globe';
  label: string;
  onClick?: () => void;
  href?: string;
};

export default function Profile() {
  const { t } = useTranslation();

  useEffect(() => {
    // unify background per design
    document.body.style.background = '#0f141b';
  }, []);

  const items: Item[] = [
    { id: 'leaders', icon: 'trophy', label: t('welcome.resultsButton'), href: '/leaders' },
  ];

  return (
    <div className={s.page}>
      <section className={s.profile}>
        <div className={s.avatar} aria-hidden>
          <span className={s.initials}>AA</span>
        </div>

        <div className={s.nameBlock}>
          <div className={s.name}>Avatar Aang</div>

          <div className={s.score}>
            <Star className={s.star} />
            <span className={s.scoreText}>299</span>
          </div>
        </div>
      </section>

      <nav className={s.actionList} aria-label={t('profile.actionsAria')}>
        {items.map((item) => (
          <ListRow key={item.id} item={item} />
        ))}
      </nav>
    </div>
  );
}

function ListRow({ item }: { item: Item }) {
  const content = (
    <>
      <span className={s.left}>
        <span className={s.iconCircle}>
          {item.icon === 'trophy' ? <Trophy className={s.icon} /> : <Globe className={s.icon} />}
        </span>
        <span className={s.itemText}>{item.label}</span>
      </span>
      <span className={s.right} aria-hidden>
        <ChevronRight className={s.chevron} />
      </span>
    </>
  );

  if (item.href) {
    return (
      <a className={s.row} href={item.href}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" className={s.row} onClick={item.onClick}>
      {content}
    </button>
  );
}

/* --- tiny inline icons (SVG) --- */
function Star({ className = '' }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}
function Trophy({ className = '' }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 2h12v3h3a5 5 0 0 1-5 5c-.6 2.3-2.5 4-4.9 4H10a6 6 0 0 1-4-5A5 5 0 0 1 1 5h3V2Zm0 3H3a3 3 0 0 0 3 3V5Zm12 0v3a3 3 0 0 0 3-3h-3ZM8 20h8v2H8v-2Zm8-4v2H8v-2h8Z" />
    </svg>
  );
}
function Globe({ className = '' }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 2c1.5 0 3.3 2.7 3.8 6H8.2C8.7 6.7 10.5 4 12 4Zm-3.9 8h7.8c-.5 3.3-2.3 6-3.9 6s-3.4-2.7-3.9-6Zm10.7 0c-.2 1.6-.7 3-1.4 4.2A7.98 7.98 0 0 0 20 12a8 8 0 0 0-2.2-5.7 12 12 0 0 1 1.1 5.7ZM5.2 6.3A8 8 0 0 0 4 12c0 2 .8 3.9 2.1 5.3-.7-1.2-1.2-2.6-1.4-4.3.1-2 .5-4 1.5-6.7Z" />
    </svg>
  );
}
function ChevronRight({ className = '' }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M10 6l6 6-6 6" />
    </svg>
  );
}
