
'use client'
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { X, Check } from 'lucide-react';

export interface MultiSelectOption {
  id: number | string;
  name: string;
  value: string;
}

interface MultiSelectProps {
    options: MultiSelectOption[];
    selected: string[];
    onChange: (selected: string[]) => void;
    className?: string;
    placeholder?: string;
}

const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
        <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <path d="M20 6 9 17l-5-5"/>
    </svg>
);


export const MultiSelect: React.FC<MultiSelectProps> = ({ 
    options: allOptions, 
    selected, 
    onChange, 
    className,
    placeholder = "Select options..." 
}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [highlightedIndex, setHighlightedIndex] = useState<number>(0);

    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    
    const selectedOptions = allOptions.filter(opt => selected.includes(opt.value));
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredOptions = allOptions.filter(option =>
        !selected.includes(option.value) &&
        option.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleOption = (optionValue: string) => {
        onChange(
            selected.includes(optionValue)
                ? selected.filter(v => v !== optionValue)
                : [...selected, optionValue]
        );
        setSearchTerm('');
        inputRef.current?.focus();
    };

    const removeOption = (optionValue: string) => {
        onChange(selected.filter(v => v !== optionValue));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && searchTerm === '' && selected.length > 0) {
            removeOption(selected[selected.length - 1]);
        }

        if (!isOpen) {
            if (e.key === 'ArrowDown' || e.key === 'Enter') {
                setIsOpen(true);
                setHighlightedIndex(0);
            }
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex(prev => (prev + 1) % filteredOptions.length);
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex(prev => (prev - 1 + filteredOptions.length) % filteredOptions.length);
                break;
            case 'Enter':
                e.preventDefault();
                if (filteredOptions[highlightedIndex]) {
                    toggleOption(filteredOptions[highlightedIndex].value);
                }
                break;
            case 'Escape':
                setIsOpen(false);
                break;
        }
    };
    
    useEffect(() => {
        if (isOpen) {
            setHighlightedIndex(0);
        }
    }, [isOpen, searchTerm]);

    return (
        <div className={cn("w-full", className)} ref={wrapperRef}>
             <style>{`
                @keyframes popover-in {
                    from { opacity: 0; transform: scale(0.95) translateY(-10px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                .animate-popover-in {
                    transform-origin: top;
                    animation: popover-in 0.1s ease-out forwards;
                }
            `}</style>
            <div className="relative">
                <div
                    className="flex flex-wrap items-center gap-2 p-1.5 min-h-[40px] text-sm border border-input bg-background rounded-md shadow-sm cursor-text transition-colors focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
                    onClick={() => {
                        setIsOpen(true);
                        inputRef.current?.focus();
                    }}
                >
                    {selectedOptions.map(option => (
                        <div key={option.id} className="flex items-center gap-1.5 bg-secondary text-secondary-foreground font-medium px-2 py-1 rounded-md">
                            {option.name}
                            <button
                                type="button"
                                className="text-muted-foreground hover:text-foreground rounded-full hover:bg-muted p-0.5 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
                                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                    e.stopPropagation();
                                    removeOption(option.value);
                                }}
                            >
                                <XIcon />
                            </button>
                        </div>
                    ))}
                    <input
                        ref={inputRef}
                        type="text"
                        value={searchTerm}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                        onFocus={() => setIsOpen(true)}
                        onKeyDown={handleKeyDown}
                        placeholder={selected.length === 0 ? placeholder : ""}
                        className="flex-grow bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-sm p-1"
                    />
                </div>

                {isOpen && (
                    <div className="absolute z-10 w-full mt-2 border border-border bg-popover text-popover-foreground rounded-md shadow-lg max-h-60 overflow-y-auto animate-popover-in">
                        <ul className="p-1">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((option, index) => (
                                    <li
                                        key={option.id}
                                        className={cn(`flex items-center justify-between p-2 cursor-pointer rounded-md transition-colors duration-150`,
                                        highlightedIndex === index ? 'bg-accent text-accent-foreground' : 'hover:bg-accent hover:text-accent-foreground'
                                        )}
                                        onClick={() => toggleOption(option.value)}
                                        onMouseEnter={() => setHighlightedIndex(index)}
                                    >
                                        {option.name}
                                    </li>
                                ))
                            ) : (
                                <li className="p-2 text-center text-muted-foreground">No options found.</li>
                            )}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};
