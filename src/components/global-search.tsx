'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
 Car,
 Loader2,
 Newspaper,
 Search,
 Store,
 Tractor,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { resolveImageSrc } from '@/lib/image-src';

export type SearchResultItem = {
 id: string;
 type: 'car' | 'showroom' | 'equipment' | 'news';
 typeLabel: string;
 title: string;
 subtitle?: string;
 href: string;
 image?: string;
};

const typeIcons = {
 car: Car,
 showroom: Store,
 equipment: Tractor,
 news: Newspaper,
};

type GlobalSearchProps = {
 variant?: 'hero' | 'navbar';
 className?: string;
 placeholder?: string;
 onNavigate?: () => void;
};

export function GlobalSearch({
 variant = 'hero',
 className,
 placeholder = 'ابحث عن سيارة، معرض، أو معدة...',
 onNavigate,
}: GlobalSearchProps) {
 const router = useRouter();
 const containerRef = useRef<HTMLDivElement>(null);
 const dropdownRef = useRef<HTMLDivElement>(null);
 const inputRef = useRef<HTMLInputElement>(null);
 const [query, setQuery] = useState('');
 const [results, setResults] = useState<SearchResultItem[]>([]);
 const [totalCount, setTotalCount] = useState(0);
 const [loading, setLoading] = useState(false);
 const [open, setOpen] = useState(false);
 const [activeIndex, setActiveIndex] = useState(-1);
 const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });
 const [mounted, setMounted] = useState(false);

 useEffect(() => setMounted(true), []);

 const updateDropdownPosition = useCallback(() => {
 if (!inputRef.current) return;
 const rect = inputRef.current.getBoundingClientRect();
 setDropdownPos({
 top: rect.bottom + 8,
 left: rect.left,
 width: rect.width,
 });
 }, []);

 const fetchResults = useCallback(async (q: string) => {
 if (q.trim().length < 2) {
 setResults([]);
 setTotalCount(0);
 setOpen(false);
 return;
 }

 setLoading(true);
 try {
 const res = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}`);
 const json = await res.json();
 if (json.success) {
 const items = json.data ?? [];
 setResults(items);
 setTotalCount(json.total ?? items.length);
 setOpen(true);
 setActiveIndex(-1);
 }
 } catch {
 setResults([]);
 setTotalCount(0);
 } finally {
 setLoading(false);
 }
 }, []);

 useEffect(() => {
 const timer = setTimeout(() => {
 fetchResults(query);
 }, 300);
 return () => clearTimeout(timer);
 }, [query, fetchResults]);

 useEffect(() => {
 if (!open) return;
 updateDropdownPosition();
 window.addEventListener('resize', updateDropdownPosition);
 window.addEventListener('scroll', updateDropdownPosition, true);
 return () => {
 window.removeEventListener('resize', updateDropdownPosition);
 window.removeEventListener('scroll', updateDropdownPosition, true);
 };
 }, [open, updateDropdownPosition, results.length]);

 useEffect(() => {
 const handleClickOutside = (e: MouseEvent) => {
 const target = e.target as Node;
 if (containerRef.current?.contains(target)) return;
 if (dropdownRef.current?.contains(target)) return;
 setOpen(false);
 };
 document.addEventListener('mousedown', handleClickOutside);
 return () => document.removeEventListener('mousedown', handleClickOutside);
 }, []);

 const goTo = (item: SearchResultItem) => {
 setOpen(false);
 setQuery('');
 onNavigate?.();
 router.push(item.href);
 };

 const handleKeyDown = (e: React.KeyboardEvent) => {
 if (!open || results.length === 0) {
 if (e.key === 'Enter' && query.trim().length >= 2) {
 router.push(`/cars?search=${encodeURIComponent(query.trim())}`);
 setOpen(false);
 onNavigate?.();
 }
 return;
 }

 if (e.key === 'ArrowDown') {
 e.preventDefault();
 setActiveIndex((i) => (i < results.length - 1 ? i + 1 : 0));
 } else if (e.key === 'ArrowUp') {
 e.preventDefault();
 setActiveIndex((i) => (i > 0 ? i - 1 : results.length - 1));
 } else if (e.key === 'Enter' && activeIndex >= 0) {
 e.preventDefault();
 goTo(results[activeIndex]);
 } else if (e.key === 'Escape') {
 setOpen(false);
 }
 };

 const isHero = variant === 'hero';
 const isNavbar = variant === 'navbar';

 return (
 <div ref={containerRef} className={cn('relative w-full', className)}>
 <div
 className={cn(
 'relative flex items-center transition-all',
 isHero &&
 'bg-white rounded-md p-1.5 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.4)] group-focus-within:scale-[1.02] duration-500',
 isNavbar &&
 'h-10 md:h-11 rounded-xl border border-gray-200 bg-white/90 backdrop-blur-sm shadow-none focus-within:ring-2 focus-within:ring-primary/20'
 )}
 >
 <Search
 className={cn(
 'shrink-0 text-muted-foreground',
 isHero ? 'h-5 w-5 md:h-6 md:w-6 text-gray-400 ml-2 md:ml-3' : 'h-4 w-4 ms-3'
 )}
 />
 <Input
 ref={inputRef}
 type="search"
 value={query}
 onChange={(e) => setQuery(e.target.value)}
 onFocus={() => {
 updateDropdownPosition();
 if (query.trim().length >= 2) setOpen(true);
 }}
 onKeyDown={handleKeyDown}
 placeholder={placeholder}
 className={cn(
 'border-0 bg-transparent focus-visible:ring-0 text-right font-bold w-full',
 isHero && 'text-gray-900 placeholder:text-gray-400 text-sm md:text-xl h-11 md:h-14',
 isNavbar && 'h-9 md:h-10 text-sm placeholder:text-muted-foreground'
 )}
 autoComplete="off"
 aria-expanded={open}
 aria-autocomplete="list"
 role="combobox"
 />
 {loading && (
 <Loader2
 className={cn(
 'shrink-0 animate-spin text-primary',
 isHero ? 'h-5 w-5 ml-2' : 'h-4 w-4 ml-2'
 )}
 />
 )}
 </div>

 {open && (() => {
 const dropdownEl = (
 <div
 ref={dropdownRef}
 className={cn(
 'fixed z-[9999] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-none',
 'max-h-[min(85vh,640px)] overflow-y-auto'
 )}
 style={{
 top: dropdownPos.top,
 left: dropdownPos.left,
 width: Math.max(dropdownPos.width, isHero ? 280 : 320),
 }}
 role="listbox"
 >
 {results.length === 0 && !loading && query.trim().length >= 2 && (
 <p className="p-6 text-center text-muted-foreground font-medium">
 لا توجد نتائج لـ &quot;{query}&quot;
 </p>
 )}

 {results.length > 0 && (
 <>
 <p className="border-b border-gray-100 px-4 py-2.5 text-center text-xs font-bold text-muted-foreground">
 {totalCount} نتيجة
 </p>
 <ul className="py-2">
 {results.map((item, index) => {
 const Icon = typeIcons[item.type];
 const isActive = index === activeIndex;
 const imageSrc = resolveImageSrc(item.image);
 return (
 <li key={`${item.type}-${item.id}`} role="option" aria-selected={isActive}>
 <button
 type="button"
 onClick={() => goTo(item)}
 onMouseEnter={() => setActiveIndex(index)}
 className={cn(
 'flex w-full items-center gap-3 px-4 py-3 text-right transition-colors',
 isActive ? 'bg-primary/10' : 'hover:bg-gray-50'
 )}
 >
 <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-gray-100">
 {imageSrc ? (
 <Image
 src={imageSrc}
 alt=""
 fill
 className="object-cover"
 sizes="48px"
 unoptimized={imageSrc.startsWith('http')}
 />
 ) : (
 <div className="flex h-full w-full items-center justify-center text-primary">
 <Icon className="h-5 w-5" />
 </div>
 )}
 </div>
 <div className="min-w-0 flex-1">
 <p className="truncate font-black text-foreground">{item.title}</p>
 {item.subtitle && (
 <p className="truncate text-sm text-muted-foreground font-medium">
 {item.subtitle}
 </p>
 )}
 </div>
 <span className="shrink-0 rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-black text-primary">
 {item.typeLabel}
 </span>
 </button>
 </li>
 );
 })}
 </ul>
 </>
 )}

 {query.trim().length >= 2 && results.length > 0 && (
 <div className="border-t border-gray-100 p-2 space-y-1">
 <Link
 href={`/cars?search=${encodeURIComponent(query.trim())}`}
 onClick={() => {
 setOpen(false);
 onNavigate?.();
 }}
 className="flex items-center justify-center gap-2 rounded-xl py-2 text-sm font-black text-primary hover:bg-primary/5"
 >
 <Car className="h-4 w-4" />
 تصفح السيارات
 </Link>
 <Link
 href={`/showrooms?search=${encodeURIComponent(query.trim())}`}
 onClick={() => {
 setOpen(false);
 onNavigate?.();
 }}
 className="flex items-center justify-center gap-2 rounded-xl py-2 text-sm font-black text-primary hover:bg-primary/5"
 >
 <Store className="h-4 w-4" />
 تصفح المعارض
 </Link>
 <Link
 href={`/equipment?search=${encodeURIComponent(query.trim())}`}
 onClick={() => {
 setOpen(false);
 onNavigate?.();
 }}
 className="flex items-center justify-center gap-2 rounded-xl py-2 text-sm font-black text-primary hover:bg-primary/5"
 >
 <Tractor className="h-4 w-4" />
 تصفح المعدات
 </Link>
 </div>
 )}
 </div>
 );
 if (mounted) {
 return createPortal(dropdownEl, document.body);
 }
 return null;
 })()}
 </div>
 );
}
