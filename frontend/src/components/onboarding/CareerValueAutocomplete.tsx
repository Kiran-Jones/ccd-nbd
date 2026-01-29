import { useState, useRef, useEffect, useCallback } from 'react';
import { CAREER_VALUES } from '../../config/careerValues';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function CareerValueAutocomplete({ value, onChange }: Props) {
  const [inputValue, setInputValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filteredOptions = CAREER_VALUES.filter((option) =>
    option.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsOpen(true);
    setHighlightedIndex(-1);

    // Clear selection if input doesn't match a valid option
    if (!CAREER_VALUES.includes(newValue as typeof CAREER_VALUES[number])) {
      onChange('');
    }
  };

  const handleSelect = useCallback(
    (option: string) => {
      setInputValue(option);
      onChange(option);
      setIsOpen(false);
      setHighlightedIndex(-1);
      inputRef.current?.blur();
    },
    [onChange]
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
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          handleSelect(filteredOptions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  // Scroll highlighted option into view
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

  // Close dropdown on outside click
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

  const isSelected = CAREER_VALUES.includes(value as typeof CAREER_VALUES[number]);

  return (
    <div ref={containerRef} className="relative">
      <label
        htmlFor="career-value-input"
        className="block text-sm font-semibold text-[#404040] mb-2"
      >
        Select your top career value
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          id="career-value-input"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Start typing to search..."
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls="career-value-listbox"
          aria-autocomplete="list"
          aria-activedescendant={
            highlightedIndex >= 0
              ? `career-value-option-${highlightedIndex}`
              : undefined
          }
          className={`
            w-full px-4 py-3 pr-10 rounded
            border text-base font-sans
            placeholder:text-[#A3A3A3]
            focus:outline-none focus:ring-2 focus:ring-[#00693E]/10
            transition-colors duration-200
            ${isSelected ? 'border-[#00693E]' : 'border-[#D4D4D4]'}
            focus:border-[#00693E]
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

      {isOpen && filteredOptions.length > 0 && (
        <ul
          ref={listRef}
          id="career-value-listbox"
          role="listbox"
          aria-label="Career values"
          className="
            absolute z-10 w-full mt-1
            max-h-60 overflow-auto
            bg-white border border-[#E5E5E5] rounded-md
            shadow-lg
          "
        >
          {filteredOptions.map((option, index) => (
            <li
              key={option}
              id={`career-value-option-${index}`}
              role="option"
              aria-selected={option === value}
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
                ${option === value ? 'text-[#00693E] font-semibold' : 'text-[#262626]'}
              `}
            >
              <span>{option}</span>
              {option === value && (
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

      {isOpen && filteredOptions.length === 0 && inputValue && (
        <div className="absolute z-10 w-full mt-1 px-4 py-3 bg-white border border-[#E5E5E5] rounded-md shadow-lg text-[#525252]">
          No matching career values found
        </div>
      )}
    </div>
  );
}
