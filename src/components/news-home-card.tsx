"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FormattedDate } from "@/components/formatted-date";
import { ArrowRight } from "lucide-react";

export interface NewsHomeItem {
 _id: string;
 category: string;
 date: string;
 title: string;
 excerpt: string;
}

interface NewsHomeCardProps {
 news: NewsHomeItem;
}

export function NewsHomeCard({ news }: NewsHomeCardProps) {
 return (
 <Card className="border border-gray-200 shadow-none rounded-lg hover:shadow-sm transition-all group bg-white overflow-hidden h-full flex flex-col">
  <CardHeader className="py-4 px-6 pb-3 flex-1 md:p-6 md:pb-3">
  <div className="flex justify-between items-center mb-3">
 <Badge className="bg-primary/5 text-primary border-0 rounded-full px-4 py-1.5 font-black text-[10px] uppercase tracking-wider">
 {news.category}
 </Badge>
 <FormattedDate
 value={news.date}
 className="text-xs font-bold text-muted-foreground"
 />
 </div>
  <CardTitle className="text-base md:text-lg font-black group-hover:text-primary transition-colors leading-tight mb-2">
 {news.title}
 </CardTitle>
  <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2 font-medium">
 {news.excerpt}
 </p>
 </CardHeader>
  <div className="px-5 pb-5 mt-auto md:px-6 md:pb-5">
  <Link
  href={`/news/${news._id}`}
  className="inline-flex items-center text-primary text-sm font-black group/read hover:text-accent"
  >
  قراءة المزيد
  <ArrowRight className="mr-2 h-4 w-4 rotate-180 group-hover/read:-translate-x-1 transition-transform" />
  </Link>
  </div>
 </Card>
 );
}
