import { useState, useRef, useEffect, useCallback } from 'react';

interface Props {
  label: string;
  inputId: string;
  options: readonly string[];
  values: string[];
  maxSelections: number;
  noMatchText: string;
  placeholder?: string;
  placeholderAtLimit?: string;
  onChange: (values: string[]) => void;
}

export default function MultiSelectAutocomplete({
  label,
  inputId,
  options,
  values,
  maxSelections,
  noMatchText,
  placeholder = 'Start typing to search...',
  placeholderAtLimit = 'Selection limit reached',
  onChange,
}: Props) {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(inputValue.toLowerCase())
  );
  const availableOptions = filteredOptions.filter(
    (option) => !values.includes(option)
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  const handleSelect = useCallback(
    (option: string) => {
      if (values.includes(option) || values.length >= maxSelections) {
        return;
      }
      setInputValue('');
      onChange([...values, option]);
      setIsOpen(false);
      setHighlightedIndex(-1);
      inputRef.current?.blur();
    },
    [onChange, values, maxSelections]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        setIsOpen(true);
        return;
      }
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < availableOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < availableOptions.length) {
          handleSelect(availableOptions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const highlightedElement = listRef.current.children[
        highlightedIndex
      ] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isSelected = values.length > 0;
  const isAtLimit = values.length >= maxSelections;

  return (
    <div ref={containerRef} className="relative">
      <label
        htmlFor={inputId}
        className="block text-sm font-semibold text-[#404040] mb-2"
      >
        {label}
      </label>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {values.map((value) => (
            <div
              key={value}
              className="flex items-center gap-2 bg-[#00693E]/10 text-[#00693E] px-3 py-1 rounded-full text-sm font-medium"
            >
              <span>{value}</span>
              <button
                type="button"
                onClick={() =>
                  onChange(values.filter((selected) => selected !== value))
                }
                className="text-[#00693E] hover:text-[#003D1C] transition-colors"
                aria-label={`Remove ${value}`}
              >
                x
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="relative">
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={isAtLimit ? placeholderAtLimit : placeholder}
          disabled={isAtLimit}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls={`${inputId}-listbox`}
          aria-autocomplete="list"
          aria-activedescendant={
            highlightedIndex >= 0 ? `${inputId}-option-${highlightedIndex}` : undefined
          }
          className={`
            w-full px-4 py-3 pr-10 rounded
            border text-base font-sans
            placeholder:text-[#A3A3A3]
            focus:outline-none focus:ring-2 focus:ring-[#00693E]/10
            transition-colors duration-200
            ${isSelected ? 'border-[#00693E]' : 'border-[#D4D4D4]'}
            focus:border-[#00693E]
            ${isAtLimit ? 'bg-[#F5F5F5] text-[#737373]' : ''}
          `}
        />
        {isSelected && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#00693E]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>
        )}
      </div>

      {isOpen && availableOptions.length > 0 && !isAtLimit && (
        <ul
          ref={listRef}
          id={`${inputId}-listbox`}
          role="listbox"
          aria-label={label}
          className="
            absolute z-10 w-full mt-1
            max-h-60 overflow-auto
            bg-white border border-[#E5E5E5] rounded-md
            shadow-lg
          "
        >
          {availableOptions.map((option, index) => (
            <li
              key={option}
              id={`${inputId}-option-${index}`}
              role="option"
              aria-selected={values.includes(option)}
              onClick={() => handleSelect(option)}
              className={`
                px-4 py-3 cursor-pointer
                flex items-center justify-between
                transition-colors duration-100
                ${
                  index === highlightedIndex
                    ? 'bg-[#F5F5F5]'
                    : 'hover:bg-[#F5F5F5]'
                }
                ${values.includes(option) ? 'text-[#00693E] font-semibold' : 'text-[#262626]'}
              `}
            >
              <span>{option}</span>
              {values.includes(option) && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[#00693E]"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </li>
          ))}
        </ul>
      )}

      {isOpen && filteredOptions.length === 0 && inputValue && !isAtLimit && (
        <div className="absolute z-10 w-full mt-1 px-4 py-3 bg-white border border-[#E5E5E5] rounded-md shadow-lg text-[#525252]">
          {noMatchText}
        </div>
      )}
    </div>
  );
}
