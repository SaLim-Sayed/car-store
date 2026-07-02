"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search, Store, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type ShowroomOption = { _id: string; name: string };

type ShowroomAutocompleteProps = {
  showrooms: ShowroomOption[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
  listId?: string;
};

export function ShowroomAutocomplete({
  showrooms,
  value,
  onChange,
  className,
  listId = "showroom-options",
}: ShowroomAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectedName =
    value === "all"
      ? "جميع المعارض"
      : showrooms.find((s) => s._id === value)?.name || "جميع المعارض";

  const options = useMemo(() => {
    const all: { id: string; name: string }[] = [
      { id: "all", name: "جميع المعارض" },
      ...showrooms.map((s) => ({ id: s._id, name: s.name })),
    ];
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter((item) => item.name.toLowerCase().includes(q));
  }, [showrooms, query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query, options.length]);

  useEffect(() => {
    if (open) {
      setQuery("");
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    const item = listRef.current?.children[activeIndex] as HTMLElement | undefined;
    item?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const selectOption = (id: string) => {
    onChange(id);
    setOpen(false);
    setQuery("");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (options.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((prev) => (prev + 1) % options.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((prev) => (prev - 1 + options.length) % options.length);
    } else if (event.key === "Enter" && options[activeIndex]) {
      event.preventDefault();
      selectOption(options[activeIndex].id);
    } else if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex h-9 w-full min-w-0 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm transition-colors hover:bg-slate-50",
            value !== "all" && "border-primary/30 bg-primary/2",
            className,
          )}
        >
          <Store className="size-3.5 shrink-0 text-slate-400" />
          <span className="min-w-0 flex-1 truncate text-right font-medium text-slate-800">
            {selectedName}
          </span>
          {value !== "all" ? (
            <span
              role="button"
              tabIndex={-1}
              onClick={(e) => {
                e.stopPropagation();
                onChange("all");
              }}
              className="rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              aria-label="إلغاء اختيار المعرض"
            >
              <X className="size-3.5" />
            </span>
          ) : (
            <ChevronDown className="size-4 shrink-0 text-slate-400" />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-(--radix-popover-trigger-width) rounded-lg p-0"
        align="start"
        sideOffset={4}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="border-b border-slate-100 p-2">
          <div className="relative">
            <Search className="absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="ابحث عن معرض..."
              className="h-8 rounded-md border-slate-200 pr-8 text-xs"
              role="combobox"
              aria-expanded={open}
              aria-autocomplete="list"
              aria-controls={listId}
            />
          </div>
        </div>
        <ul id={listId} ref={listRef} className="max-h-52 overflow-y-auto py-1" role="listbox">
          {options.length > 0 ? (
            options.map((option, index) => {
              const isSelected = value === option.id;
              return (
                <li key={option.id} role="option" aria-selected={isSelected}>
                  <button
                    type="button"
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => selectOption(option.id)}
                    className={cn(
                      "flex w-full items-center gap-2 px-3 py-2 text-right text-sm transition-colors",
                      index === activeIndex ? "bg-slate-100" : "hover:bg-slate-50",
                      isSelected && "text-primary",
                    )}
                  >
                    <span className="min-w-0 flex-1 truncate">{option.name}</span>
                    {isSelected ? <Check className="size-3.5 shrink-0 text-primary" /> : null}
                  </button>
                </li>
              );
            })
          ) : (
            <li className="px-3 py-6 text-center text-xs text-slate-500">لا توجد نتائج</li>
          )}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
