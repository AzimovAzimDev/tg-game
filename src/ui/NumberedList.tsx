import css from "./NumberedList.module.css";

type Item = { id: number; text: string };
export default function NumberedList({ items }: { items: Item[] }) {
  return (
    <div className={css.card} role="list" aria-label="Правила">
      {items.map((it, i) => {
        const first = i === 0;
        const last = i === items.length - 1;
        return (
          <div key={it.id} className={css.row} role="listitem" aria-posinset={i+1} aria-setsize={items.length}>
            <div className={css.lineWrap} aria-hidden>
              <span className={css.circle}>{it.id}</span>
              {!first && <span className={`${css.line} ${css.lineTop}`} />}
              {!last && <span className={`${css.line} ${css.lineBottom}`} />}
            </div>
            <div className={css.text}>{it.text}</div>
          </div>
        );
      })}
    </div>
  );
}
