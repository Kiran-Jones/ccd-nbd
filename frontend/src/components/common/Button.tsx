import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'text';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  type = 'button',
  className = '',
}: Props) {
  const baseStyles = `
    inline-flex items-center justify-center
    px-6 py-3
    rounded
    font-sans font-semibold text-base
    transition-all duration-200
    disabled:cursor-not-allowed
  `;

  const variants = {
    primary: `
      bg-[#00693E] text-white
      border-none
      hover:bg-[#003D1C]
      hover:shadow-[0_4px_8px_rgba(0,105,62,0.2)]
      active:bg-[#002D15] active:translate-y-px
      disabled:bg-[#E5E5E5] disabled:text-[#A3A3A3]
    `,
    secondary: `
      bg-white text-[#00693E]
      border-2 border-[#00693E]
      hover:bg-[#F5F5F5] hover:border-[#003D1C] hover:text-[#003D1C]
      active:bg-[#E5E5E5]
      disabled:bg-white disabled:border-[#D4D4D4] disabled:text-[#A3A3A3]
    `,
    text: `
      bg-transparent text-[#00693E]
      border-none underline
      px-4 py-2
      hover:text-[#003D1C]
      disabled:text-[#A3A3A3] disabled:no-underline
    `,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
