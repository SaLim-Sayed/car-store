"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, Store, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type ShowroomOption = { _id: string; name: string };

const LIST_MAX_HEIGHT = 260;

type ShowroomAutocompleteProps = {
  showrooms: ShowroomOption[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
  listId?: string;
  emptyOptionId?: string;
  emptyOptionLabel?: string;
  searchPlaceholder?: string;
};

function highlightMatch(text: string, query: string): ReactNode {
  const q = query.trim();
  if (!q) return text;
  const lower = text.toLowerCase();
  const index = lower.indexOf(q.toLowerCase());
  if (index < 0) return text;
  return (
    <>
      {text.slice(0, index)}
      <mark className="rounded bg-amber-100/90 px-0.5 font-black text-slate-900">
        {text.slice(index, index + q.length)}
      </mark>
      {text.slice(index + q.length)}
    </>
  );
}

export function ShowroomAutocomplete({
  showrooms,
  value,
  onChange,
  className,
  listId,
  emptyOptionId = "all",
  emptyOptionLabel = "جميع المعارض",
  searchPlaceholder = "ابحث واختر معرض...",
}: ShowroomAutocompleteProps) {
  const autoListId = useId();
  const resolvedListId = listId || autoListId;
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const skipCloseRef = useRef(false);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  /** When true, show the full list (e.g. reopening after a selection). */
  const [browseAll, setBrowseAll] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [menuStyle, setMenuStyle] = useState<CSSProperties>({});
  const [mounted, setMounted] = useState(false);

  const normalizedValue = value ?? emptyOptionId;
  const isEmpty =
    normalizedValue === emptyOptionId || normalizedValue === "";

  const selectedName = useMemo(() => {
    if (isEmpty) return "";
    return (
      showrooms.find((s) => String(s._id) === String(normalizedValue))?.name ||
      ""
    );
  }, [isEmpty, showrooms, normalizedValue]);

  const options = useMemo(() => {
    const all: { id: string; name: string }[] = [
      { id: emptyOptionId, name: emptyOptionLabel },
      ...showrooms.map((s) => ({
        id: String(s._id),
        name: s.name,
      })),
    ];
    // Reopening with a selection: show every showroom so user can pick another
    if (browseAll) return all;
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter((item) => item.name.toLowerCase().includes(q));
  }, [showrooms, query, emptyOptionId, emptyOptionLabel, browseAll]);

  const selectedOptionIndex = useMemo(() => {
    const idx = options.findIndex(
      (o) =>
        o.id === String(normalizedValue) ||
        (isEmpty && o.id === emptyOptionId),
    );
    return idx >= 0 ? idx : 0;
  }, [options, normalizedValue, isEmpty, emptyOptionId]);

  const updateMenuPosition = useCallback(() => {
    const el = rootRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const gap = 8;
    const spaceBelow = window.innerHeight - rect.bottom - gap;
    const spaceAbove = rect.top - gap;
    const openUp = spaceBelow < LIST_MAX_HEIGHT + 56 && spaceAbove > spaceBelow;

    setMenuStyle({
      position: "fixed",
      left: rect.left,
      width: rect.width,
      zIndex: 80,
      ...(openUp
        ? { bottom: window.innerHeight - rect.top + gap }
        : { top: rect.bottom + gap }),
    });
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      setQuery(selectedName);
      setBrowseAll(false);
    }
  }, [selectedName, open]);

  useEffect(() => {
    if (!open) return;
    setActiveIndex(browseAll ? selectedOptionIndex : 0);
  }, [query, options.length, browseAll, open, selectedOptionIndex]);

  useLayoutEffect(() => {
    if (!open) return;
    updateMenuPosition();
    const onScrollOrResize = () => updateMenuPosition();
    window.addEventListener("resize", onScrollOrResize);
    window.addEventListener("scroll", onScrollOrResize, true);
    return () => {
      window.removeEventListener("resize", onScrollOrResize);
      window.removeEventListener("scroll", onScrollOrResize, true);
    };
  }, [open, options.length, updateMenuPosition]);

  useEffect(() => {
    if (!open) return;
    const item = listRef.current?.children[activeIndex] as
      | HTMLElement
      | undefined;
    item?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  const openList = (opts?: { browseAll?: boolean }) => {
    const shouldBrowseAll = opts?.browseAll ?? true;
    setBrowseAll(shouldBrowseAll);
    setOpen(true);
    setQuery(selectedName);
    setActiveIndex(selectedOptionIndex);
    requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  };

  const selectOption = (id: string) => {
    skipCloseRef.current = true;
    onChange(id);
    const name =
      id === emptyOptionId
        ? ""
        : showrooms.find((s) => String(s._id) === id)?.name || "";
    setQuery(name);
    setBrowseAll(false);
    setOpen(false);
    window.setTimeout(() => {
      skipCloseRef.current = false;
    }, 0);
  };

  const closeWithoutChanging = useCallback(() => {
    if (skipCloseRef.current) return;
    setQuery(selectedName);
    setOpen(false);
  }, [selectedName]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (
        rootRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }
      closeWithoutChanging();
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [open, closeWithoutChanging]);

  const clearSelection = () => {
    skipCloseRef.current = true;
    onChange(emptyOptionId);
    setQuery("");
    setBrowseAll(true);
    setOpen(true);
    requestAnimationFrame(() => {
      skipCloseRef.current = false;
      inputRef.current?.focus();
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!open) {
        openList({ browseAll: true });
        return;
      }
      if (options.length === 0) return;
      setActiveIndex((prev) => (prev + 1) % options.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!open || options.length === 0) return;
      setActiveIndex((prev) => (prev - 1 + options.length) % options.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (open && options[activeIndex]) {
        selectOption(options[activeIndex].id);
      } else {
        openList({ browseAll: true });
      }
    } else if (event.key === "Escape") {
      event.preventDefault();
      closeWithoutChanging();
    }
  };

  const menu =
    open && mounted
      ? createPortal(
          <div
            ref={menuRef}
            style={menuStyle}
            className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_18px_50px_-20px_rgb(15_23_42/0.35)] ring-1 ring-slate-900/5"
          >
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 bg-linear-to-l from-rose-50/80 to-slate-50 px-3.5 py-2.5">
              <div className="flex items-center gap-2">
                <span className="flex size-6 items-center justify-center rounded-md bg-white text-rose-500 shadow-sm ring-1 ring-slate-100">
                  <Store className="size-3.5" />
                </span>
                <p className="text-[11px] font-black text-slate-600">
                  {query.trim()
                    ? `${options.length} نتيجة`
                    : `${showrooms.length} معرض متاح`}
                </p>
              </div>
              <p className="text-[10px] font-bold text-slate-400">اسحب للتمرير</p>
            </div>

            <ul
              id={resolvedListId}
              ref={listRef}
              role="listbox"
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              style={{
                maxHeight: LIST_MAX_HEIGHT,
                overflowY: "auto",
                WebkitOverflowScrolling: "touch",
                overscrollBehavior: "contain",
              }}
              className="divide-y divide-slate-300 p-0 [scrollbar-gutter:stable] [scrollbar-width:thin]"
            >
              {options.length > 0 ? (
                options.map((option, index) => {
                  const isEmptyOption = option.id === emptyOptionId;
                  const isSelected =
                    String(normalizedValue) === option.id ||
                    (isEmpty && isEmptyOption);
                  const isActive = index === activeIndex;
                  return (
                    <li
                      key={option.id || "empty"}
                      role="option"
                      aria-selected={isSelected}
                    >
                      <button
                        type="button"
                        onMouseEnter={() => setActiveIndex(index)}
                        onPointerDown={(e) => {
                          // Keep focus stable and select immediately (works on mobile + desktop)
                          e.preventDefault();
                          selectOption(option.id);
                        }}
                        className={cn(
                          "flex w-full items-start gap-2.5 px-3 py-3 text-right text-sm leading-snug transition-colors",
                          isActive && !isSelected && "bg-slate-50",
                          isSelected &&
                            "bg-rose-50 font-black text-rose-700",
                        )}
                      >
                        <span
                          className={cn(
                            "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl",
                            isEmptyOption
                              ? "bg-slate-100 text-slate-400"
                              : isSelected
                                ? "bg-rose-100 text-rose-600"
                                : "bg-slate-100 text-slate-500",
                          )}
                        >
                          {isEmptyOption ? (
                            <X className="size-3.5" />
                          ) : (
                            <Store className="size-3.5" />
                          )}
                        </span>
                        <span className="min-w-0 flex-1 whitespace-normal break-words pt-0.5 text-slate-800">
                          {highlightMatch(
                            option.name,
                            browseAll ? "" : query,
                          )}
                        </span>
                        {isSelected ? (
                          <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-rose-500 text-white">
                            <Check className="size-3" strokeWidth={3} />
                          </span>
                        ) : null}
                      </button>
                    </li>
                  );
                })
              ) : (
                <li className="px-3 py-10 text-center">
                  <div className="mx-auto mb-2 flex size-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                    <Store className="size-5" />
                  </div>
                  <p className="text-sm font-black text-slate-700">لا توجد نتائج</p>
                  <p className="mt-1 text-xs font-medium text-slate-400">
                    جرّب جزءاً من اسم المعرض
                  </p>
                </li>
              )}
            </ul>
          </div>,
          document.body,
        )
      : null;

  return (
    <div ref={rootRef} className="relative w-full min-w-0">
      <div
        className={cn(
          "flex h-12 w-full min-w-0 items-center gap-2 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 pr-2 pl-3 transition-all",
          !isEmpty && "border-rose-200 bg-rose-50/40",
          open && "border-rose-500 bg-white ring-1 ring-rose-500",
        )}
      >
        <Store
          className={cn(
            "size-4 shrink-0",
            open || !isEmpty ? "text-rose-500" : "text-slate-500",
          )}
        />

        <div className="relative min-w-0 flex-1 overflow-hidden">
          {/* Always render label slot so SSR/client DOM structure stays identical */}
          <span
            aria-hidden={open || isEmpty || !selectedName}
            className={cn(
              "block w-full truncate text-sm font-bold text-slate-900",
              (open || isEmpty || !selectedName) && "invisible absolute",
            )}
            title={selectedName || undefined}
          >
            {selectedName || "\u00a0"}
          </span>
          <Input
            ref={inputRef}
            value={open ? query : isEmpty ? "" : selectedName}
            onChange={(e) => {
              setBrowseAll(false);
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => {
              openList({ browseAll: true });
            }}
            onClick={() => {
              if (!open) openList({ browseAll: true });
            }}
            onBlur={() => {
              window.setTimeout(() => {
                if (skipCloseRef.current) return;
                if (
                  !rootRef.current?.contains(document.activeElement) &&
                  !menuRef.current?.contains(document.activeElement)
                ) {
                  closeWithoutChanging();
                }
              }, 150);
            }}
            onKeyDown={handleKeyDown}
            placeholder={searchPlaceholder}
            autoComplete="off"
            role="combobox"
            aria-expanded={open}
            aria-autocomplete="list"
            aria-controls={resolvedListId}
            title={selectedName || undefined}
            className={cn(
              "h-auto min-h-0 w-full min-w-0 border-0 bg-transparent p-0 text-sm font-bold shadow-none",
              "placeholder:font-bold placeholder:text-slate-400",
              "focus-visible:border-0 focus-visible:ring-0",
              // When closed with a selection, show the truncated label instead
              !open &&
                !isEmpty &&
                selectedName &&
                "absolute inset-0 cursor-pointer opacity-0",
              className,
            )}
          />
        </div>

        <div className="flex shrink-0 items-center gap-0.5">
          <button
            type="button"
            onPointerDown={(e) => e.preventDefault()}
            onClick={clearSelection}
            disabled={isEmpty && !(open && query)}
            className={cn(
              "rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white hover:text-rose-600",
              isEmpty && !(open && query) && "invisible pointer-events-none",
            )}
            aria-label="مسح الاختيار"
            tabIndex={isEmpty && !(open && query) ? -1 : 0}
          >
            <X className="size-4" />
          </button>
          <button
            type="button"
            tabIndex={-1}
            onPointerDown={(e) => e.preventDefault()}
            onClick={() => {
              if (open) {
                closeWithoutChanging();
              } else {
                openList({ browseAll: true });
              }
            }}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white hover:text-slate-700"
            aria-label="عرض المعارض"
          >
            <ChevronDown
              className={cn(
                "size-4 transition-transform duration-200",
                open && "rotate-180 text-rose-500",
              )}
            />
          </button>
        </div>
      </div>

      {menu}
    </div>
  );
}
