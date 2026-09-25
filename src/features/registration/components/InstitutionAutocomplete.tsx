import React, { useState, useRef, useEffect } from 'react';
import { searchInstitutions } from '../data/institutions';
import { Building2, Check, ChevronDown } from 'lucide-react';
import { useUiStore } from '../../../stores/useUiStore';

interface InstitutionAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const InstitutionAutocomplete: React.FC<InstitutionAutocompleteProps> = ({
  value,
  onChange,
  error,
}) => {
  const { t } = useUiStore();
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSuggestions(searchInstitutions(value));
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <label className="block text-sm font-medium text-foreground mb-1.5">
        {t.institutionName} <span className="text-destructive">*</span>
      </label>
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
          <Building2 className="h-4 w-4" />
        </div>

        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={t.searchInstitution}
          className={`w-full pl-10 pr-10 py-2.5 bg-background border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
            error ? 'border-destructive' : 'border-input'
          }`}
        />

        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-muted-foreground">
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {error && <p className="text-xs text-destructive mt-1 font-medium">{error}</p>}

      {/* Autocomplete Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <ul className="absolute z-30 w-full mt-1.5 bg-card border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto py-1 text-sm">
          {suggestions.map((inst, index) => (
            <li
              key={index}
              onClick={() => {
                onChange(inst);
                setIsOpen(false);
              }}
              className="px-4 py-2.5 hover:bg-accent cursor-pointer flex items-center justify-between text-foreground transition-colors"
            >
              <span>{inst}</span>
              {value === inst && <Check className="h-4 w-4 text-primary" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
