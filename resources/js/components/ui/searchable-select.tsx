import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface SearchableSelectProps {
    options: { id: number; name: string }[];
    placeholder: string;
    value: number;
    onChange: (value: number) => void;
    required?: boolean;
}

export function SearchableSelect({ options, placeholder, value, onChange, required }: SearchableSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredOptions, setFilteredOptions] = useState(options);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const selectedOption = options.find((opt) => opt.id === value);

    useEffect(() => {
        setFilteredOptions(options.filter((option) => option.name.toLowerCase().includes(searchTerm.toLowerCase())));
    }, [searchTerm, options]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchTerm('');
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (option: { id: number; name: string }) => {
        onChange(option.id);
        setIsOpen(false);
        setSearchTerm('');
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <div
                className="border-input hover:bg-accent focus:ring-ring flex h-9 w-full cursor-pointer items-center justify-between rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus:ring-1 focus:outline-none"
                onClick={() => {
                    setIsOpen(!isOpen);
                    if (!isOpen) {
                        setTimeout(() => inputRef.current?.focus(), 100);
                    }
                }}
            >
                <span className={selectedOption ? 'text-foreground' : 'text-muted-foreground'}>
                    {selectedOption ? selectedOption.name : placeholder}
                </span>
                <ChevronDown className="h-4 w-4 opacity-50" />
            </div>

            {isOpen && (
                <div className="bg-popover absolute z-50 mt-1 w-full rounded-md border shadow-lg">
                    <div className="p-2">
                        <input
                            ref={inputRef}
                            type="text"
                            className="border-input focus:ring-ring w-full rounded-sm border px-2 py-1 text-sm focus:ring-1 focus:outline-none"
                            placeholder="Cari..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="max-h-60 overflow-auto">
                        {filteredOptions.length === 0 ? (
                            <div className="text-muted-foreground px-3 py-2 text-sm">Tidak ada data ditemukan</div>
                        ) : (
                            filteredOptions.map((option) => (
                                <div
                                    key={option.id}
                                    className="hover:bg-accent hover:text-accent-foreground flex cursor-pointer items-center px-3 py-2 text-sm"
                                    onClick={() => handleSelect(option)}
                                >
                                    <span className="flex-1">{option.name}</span>
                                    {value === option.id && <Check className="h-4 w-4" />}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}