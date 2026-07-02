"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Search, Store, Tag, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ITEM_TYPE_LABELS: Record<string, string> = {
  car: "سيارة",
  equipment: "معدة",
  bike: "دراجة نارية",
  showroom: "تواصل مباشر",
};

export type ReportClickEntry = {
  itemName: string;
  itemType: string;
  createdAt: string;
};

export type ReportClickGroup = {
  showroomName: string;
  clicks: ReportClickEntry[];
};

type SuggestionKind = "showroom" | "item" | "type";

type Suggestion = {
  id: string;
  kind: SuggestionKind;
  label: string;
  meta?: string;
  searchValue: string;
  showroomName?: string;
};

const MOBILE_PREVIEW = 5;
const DESKTOP_PREVIEW = 10;
const MAX_SUGGESTIONS = 8;

function buildSuggestions(groups: ReportClickGroup[], query: string): Suggestion[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: Suggestion[] = [];
  const seen = new Set<string>();

  const push = (suggestion: Suggestion) => {
    if (seen.has(suggestion.id)) return;
    seen.add(suggestion.id);
    results.push(suggestion);
  };

  for (const group of groups) {
    if (group.showroomName.toLowerCase().includes(q)) {
      push({
        id: `showroom:${group.showroomName}`,
        kind: "showroom",
        label: group.showroomName,
        meta: `${group.clicks.length} اتصال`,
        searchValue: group.showroomName,
        showroomName: group.showroomName,
      });
    }

    for (const click of group.clicks) {
      const typeLabel = ITEM_TYPE_LABELS[click.itemType] || click.itemType;
      if (click.itemName.toLowerCase().includes(q)) {
        push({
          id: `item:${group.showroomName}:${click.itemName}`,
          kind: "item",
          label: click.itemName,
          meta: group.showroomName,
          searchValue: click.itemName,
          showroomName: group.showroomName,
        });
      }
      if (typeLabel && typeLabel.toLowerCase().includes(q)) {
        push({
          id: `type:${click.itemType}`,
          kind: "type",
          label: typeLabel,
          searchValue: typeLabel,
        });
      }
    }
  }

  return results.slice(0, MAX_SUGGESTIONS);
}

function CallLogSearch({
  groups,
  query,
  onQueryChange,
  onSelect,
}: {
  groups: ReportClickGroup[];
  query: string;
  onQueryChange: (value: string) => void;
  onSelect: (suggestion: Suggestion) => void;
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const suggestions = useMemo(() => buildSuggestions(groups, query), [groups, query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query, suggestions.length]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const item = listRef.current?.children[activeIndex] as HTMLElement | undefined;
    item?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const showDropdown = open && query.trim().length > 0;

  const selectSuggestion = (suggestion: Suggestion) => {
    onSelect(suggestion);
    setOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || suggestions.length === 0) {
      if (event.key === "Escape") {
        onQueryChange("");
        setOpen(false);
      }
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      const selected = suggestions[activeIndex];
      if (selected) selectSuggestion(selected);
    } else if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className="relative print:hidden">
      <Search className="absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
      <Input
        value={query}
        onChange={(e) => {
          onQueryChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="ابحث عن معرض أو إعلان..."
        role="combobox"
        aria-expanded={showDropdown}
        aria-autocomplete="list"
        aria-controls="call-log-suggestions"
        className="h-9 rounded-lg border-slate-200 pr-9 pl-8 text-sm"
      />
      {query && (
        <button
          type="button"
          onClick={() => {
            onQueryChange("");
            setOpen(false);
          }}
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-slate-400 hover:text-slate-600"
          aria-label="مسح البحث"
        >
          <X className="size-3.5" />
        </button>
      )}

      {showDropdown && (
        <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-md">
          {suggestions.length > 0 ? (
            <ul id="call-log-suggestions" ref={listRef} className="max-h-56 overflow-y-auto py-1">
              {suggestions.map((suggestion, index) => (
                <li key={suggestion.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={index === activeIndex}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => selectSuggestion(suggestion)}
                    className={cn(
                      "flex w-full items-center gap-2.5 px-3 py-2 text-right text-sm transition-colors",
                      index === activeIndex ? "bg-slate-100" : "hover:bg-slate-50",
                    )}
                  >
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-500">
                      {suggestion.kind === "showroom" ? (
                        <Store className="size-3.5" />
                      ) : (
                        <Tag className="size-3.5" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium text-slate-800">
                        {suggestion.label}
                      </span>
                      {suggestion.meta ? (
                        <span className="block truncate text-[11px] text-slate-400">
                          {suggestion.meta}
                        </span>
                      ) : null}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-3 py-4 text-center text-sm text-slate-500">لا توجد اقتراحات</p>
          )}
        </div>
      )}
    </div>
  );
}

export function ReportCallGroups({ groups }: { groups: ReportClickGroup[] }) {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groups;

    return groups
      .map((group) => ({
        ...group,
        clicks: group.clicks.filter(
          (click) =>
            click.itemName.toLowerCase().includes(q) ||
            group.showroomName.toLowerCase().includes(q) ||
            (ITEM_TYPE_LABELS[click.itemType] || click.itemType).toLowerCase().includes(q),
        ),
      }))
      .filter((group) => group.clicks.length > 0);
  }, [groups, query]);

  const handleSelectSuggestion = (suggestion: Suggestion) => {
    setQuery(suggestion.searchValue);
    if (suggestion.showroomName) {
      setExpanded((prev) => ({ ...prev, [suggestion.showroomName!]: true }));
    }
  };

  const toggleGroup = (name: string) => {
    setExpanded((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  if (groups.length === 0) return null;

  return (
    <div className="space-y-3">
      <CallLogSearch
        groups={groups}
        query={query}
        onQueryChange={setQuery}
        onSelect={handleSelectSuggestion}
      />

      {filteredGroups.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-500">لا توجد نتائج</p>
      ) : (
        filteredGroups.map((group) => {
          const isOpen = expanded[group.showroomName] ?? Boolean(query.trim());
          const visibleClicks = isOpen
            ? group.clicks
            : group.clicks.slice(0, MOBILE_PREVIEW);
          const desktopClicks = isOpen
            ? group.clicks
            : group.clicks.slice(0, DESKTOP_PREVIEW);
          const hasMore = group.clicks.length > MOBILE_PREVIEW;

          return (
            <div
              key={group.showroomName}
              className="overflow-hidden rounded-lg border border-slate-200 bg-white print:border-black"
            >
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 bg-slate-50/50 px-3 py-2.5 sm:px-4">
                <span className="min-w-0 truncate text-sm font-medium text-slate-800">
                  {group.showroomName}
                </span>
                <span className="shrink-0 text-xs text-slate-400 tabular-nums">
                  {group.clicks.length}
                </span>
              </div>

              {/* Mobile */}
              <div className="divide-y divide-slate-100 md:hidden">
                {visibleClicks.map((click, index) => (
                  <ClickRow key={`${click.createdAt}-${index}`} click={click} />
                ))}
                {hasMore && !query.trim() && (
                  <ToggleButton
                    isOpen={isOpen}
                    total={group.clicks.length}
                    onClick={() => toggleGroup(group.showroomName)}
                  />
                )}
              </div>

              {/* Desktop */}
              <div className="hidden md:block">
                <table className="w-full text-right text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-xs text-slate-400">
                      <th className="px-4 py-2.5 font-medium">الإعلان</th>
                      <th className="px-4 py-2.5 font-medium">النوع</th>
                      <th className="px-4 py-2.5 font-medium">التاريخ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {desktopClicks.map((click, index) => (
                      <tr key={`${click.createdAt}-${index}`} className="hover:bg-slate-50/50">
                        <td className="max-w-xs px-4 py-2.5 text-slate-800">{click.itemName}</td>
                        <td className="px-4 py-2.5 text-xs text-slate-500">
                          {ITEM_TYPE_LABELS[click.itemType] || click.itemType || "—"}
                        </td>
                        <td
                          className="whitespace-nowrap px-4 py-2.5 text-xs text-slate-400 tabular-nums"
                          dir="ltr"
                        >
                          {new Date(click.createdAt).toLocaleString("ar-EG")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {group.clicks.length > DESKTOP_PREVIEW && !query.trim() && (
                  <ToggleButton
                    isOpen={isOpen}
                    total={group.clicks.length}
                    onClick={() => toggleGroup(group.showroomName)}
                  />
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

function ToggleButton({
  isOpen,
  total,
  onClick,
}: {
  isOpen: boolean;
  total: number;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      className="h-9 w-full rounded-none text-xs text-slate-500"
      onClick={onClick}
    >
      <ChevronDown className={cn("ml-1 size-3.5 transition-transform", isOpen && "rotate-180")} />
      {isOpen ? "أقل" : `الكل (${total})`}
    </Button>
  );
}

function ClickRow({ click }: { click: ReportClickEntry }) {
  return (
    <div className="flex items-start justify-between gap-3 px-3 py-2.5">
      <div className="min-w-0 flex-1">
        <p className="text-sm text-slate-800">{click.itemName}</p>
        <p className="mt-0.5 text-[11px] text-slate-400">
          {ITEM_TYPE_LABELS[click.itemType] || click.itemType || "—"}
        </p>
      </div>
      <span className="shrink-0 text-[11px] text-slate-400 tabular-nums" dir="ltr">
        {new Date(click.createdAt).toLocaleString("ar-EG", {
          dateStyle: "short",
          timeStyle: "short",
        })}
      </span>
    </div>
  );
}
