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
    <Card className="border-0 shadow-xl rounded-[2.5rem] hover:shadow-2xl transition-all group bg-white overflow-hidden h-full flex flex-col">
      <CardHeader className="p-10 pb-4 flex-1">
        <div className="flex justify-between items-center mb-6">
          <Badge className="bg-blue-50 text-blue-700 border-0 rounded-full px-4 py-1.5 font-black text-[10px] uppercase tracking-wider">
            {news.category}
          </Badge>
          <FormattedDate
            value={news.date}
            className="text-xs font-bold text-muted-foreground"
          />
        </div>
        <CardTitle className="text-2xl md:text-3xl font-black group-hover:text-blue-600 transition-colors leading-tight mb-4">
          {news.title}
        </CardTitle>
        <p className="text-muted-foreground text-base leading-relaxed line-clamp-3 font-medium">
          {news.excerpt}
        </p>
      </CardHeader>
      <div className="px-10 pb-10 mt-auto">
        <Link
          href={`/news/${news._id}`}
          className="inline-flex items-center text-blue-600 text-lg font-black group/read"
        >
          قراءة المزيد
          <ArrowRight className="mr-3 h-5 w-5 rotate-180 group-hover/read:-translate-x-2 transition-transform" />
        </Link>
      </div>
    </Card>
  );
}
