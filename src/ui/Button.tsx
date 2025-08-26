import React from 'react';
import cls from './Button.module.css';

export type ButtonVariant = 'accent' | 'gray';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  stretch?: boolean;
};

export default function Button({
  variant = 'accent',
  stretch = true,
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = [cls.base, cls[variant], stretch ? cls.stretch : undefined, className]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
