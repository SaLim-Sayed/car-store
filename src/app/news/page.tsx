"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, User, ArrowLeft, ChevronLeft, Tag, Search } from "lucide-react";
import Link from "next/link";
import { useNews } from "@/hooks/useContent";

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const { data: newsData, isLoading } = useNews(100, "all");
  const newsItems = newsData?.data || [];

  const categories = [
    "الكل",
    "أخبار السوق",
    "جديد السيارات",
    "نصائح تهمك",
    "مراجعات",
  ];

  const filteredNews =
    selectedCategory === "الكل"
      ? newsItems
      : newsItems.filter((item: any) => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#F9F6F1]">
      <Navbar />

      <main className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-6xl md:text-7xl font-[1000] tracking-tighter">
              أخبار السيارات
            </h1>
            <p className="text-muted-foreground text-xl md:text-2xl font-medium max-w-2xl mx-auto">
              تابع أحدث التطورات، المراجعات، وأخبار السوق في مكان واحد
            </p>
            <div className="h-1.5 w-24 bg-primary rounded-full mx-auto" />
          </div>

          <div className="flex justify-center gap-3 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "ghost"}
                className={`rounded-full px-8 h-12 text-lg font-black transition-all ${selectedCategory === category ? "shadow-lg shadow-primary/20" : "bg-white/50 hover:bg-white"}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[...Array(4)].map((_, index) => (
                <Card
                  key={index}
                  className="border-0 shadow-lg rounded-[2.5rem] bg-white overflow-hidden"
                >
                  <Skeleton className="h-64 w-full" />
                  <CardContent className="p-8 space-y-4">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredNews.map((item: any) => (
                <Card
                  key={item._id}
                  className="border-0 shadow-xl rounded-[2.5rem] bg-white overflow-hidden group hover:shadow-2xl transition-all duration-500 flex flex-col"
                >
                  {item.image && (
                    <div className="h-64 overflow-hidden relative">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-6 right-6">
                        <Badge className="bg-white/90 backdrop-blur-md text-primary border-0 rounded-full px-4 py-1.5 font-black shadow-sm">
                          {item.category}
                        </Badge>
                      </div>
                    </div>
                  )}
                  <CardContent className="p-8 flex-1 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground font-bold">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" />
                          {item.date}
                        </div>
                      </div>
                      <CardTitle className="text-3xl font-black leading-tight group-hover:text-primary transition-colors">
                        {item.title}
                      </CardTitle>
                      <p className="text-muted-foreground text-lg line-clamp-3 font-medium leading-relaxed">
                        {item.excerpt}
                      </p>
                    </div>

                    <Button
                      variant="ghost"
                      asChild
                      className="group/btn h-14 rounded-2xl text-lg font-black hover:bg-primary hover:text-white transition-all w-fit px-8 -mx-2"
                    >
                      <Link
                        href={`/news/${item._id}`}
                        className="flex items-center"
                      >
                        اقرأ المزيد
                        <ChevronLeft className="mr-2 h-5 w-5 group-hover/btn:-translate-x-2 transition-transform" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!isLoading && filteredNews.length === 0 && (
            <Card className="border-0 shadow-2xl rounded-[2.5rem] p-24 text-center bg-white">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-12 w-12 text-muted-foreground opacity-20" />
              </div>
              <h3 className="text-3xl font-black mb-4">لا توجد أخبار</h3>
              <p className="text-muted-foreground text-xl font-medium">
                لم نجد أي مقالات في هذا التصنيف حالياً
              </p>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
