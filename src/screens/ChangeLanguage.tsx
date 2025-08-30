import React, { useState } from "react";
import s from "./ChangeLanguage.module.css";
import i18n from "../i18n";
import { USER_PREFERENCES } from "../config/userPreferences";

type Lang = "ru" | "kk";

export interface ChangeLanguageProps {
  initialLanguage?: Lang;
  onSave?: (lang: Lang) => void;
  /** If you already have a red button, pass it here (className is applied). */
  SaveButtonComponent?: React.ComponentType<
    React.ButtonHTMLAttributes<HTMLButtonElement>
  >;
}

function setCookie(name: string, value: string, days = 365) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${d.toUTCString()};path=/`;
}

export default function ChangeLanguage({
  initialLanguage = "ru",
  onSave,
  SaveButtonComponent,
}: ChangeLanguageProps) {
  const [lang, setLang] = useState<Lang>(initialLanguage);

  const Button =
    SaveButtonComponent ??
    ((props) => (
      <button type="button" {...props} className={`${s.saveBtn} ${props.className || ""}`}>
        {props.children}
      </button>
    ));

  return (
    <div className={s.page}>
      <header className={s.header}>
        <h1 className={s.title}>Сменить&nbsp;язык</h1>
      </header>

      <main className={s.content}>
        <ul className={s.list} role="radiogroup" aria-label="Выбор языка">
          <LanguageItem
            label="Русский"
            value="ru"
            checked={lang === "ru"}
            onChange={() => setLang("ru")}
          />
          <LanguageItem
            label="Қазақша"
            value="kk"
            checked={lang === "kk"}
            onChange={() => setLang("kk")}
          />
        </ul>
      </main>

      <footer className={s.footer}>
        <Button
          onClick={() => {
            i18n.changeLanguage(lang);
            setCookie(USER_PREFERENCES.languageCookie, lang);
            onSave?.(lang);
          }}
          aria-label="Сохранить"
        >
          Сохранить
        </Button>
      </footer>
    </div>
  );
}

function LanguageItem({
  label,
  value,
  checked,
  onChange,
}: {
  label: string;
  value: string;
  checked: boolean;
  onChange: () => void;
}) {
  const id = `lang-${value}`;
  return (
    <li className={s.item}>
      <label htmlFor={id} className={s.itemBody}>
        <div className={s.itemText}>{label}</div>
        <span className={`${s.radio} ${checked ? s.radioChecked : ""}`} aria-hidden />
      </label>

      {/* real radio for a11y; visually hidden but still focusable */}
      <input
        id={id}
        className={s.visuallyHidden}
        type="radio"
        name="language"
        value={value}
        checked={checked}
        onChange={onChange}
      />
    </li>
  );
}
