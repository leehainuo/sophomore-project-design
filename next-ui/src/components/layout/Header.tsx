"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const Header = () => {
  const { data: session, status } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast.message("李海诺大王:",
        {description: "已帮你整理完成"}
      )
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      toast.message("李海诺大王:",
        {description: "已帮你整理完成"}
      )
      router.push('/');
    }
  };

  return (
    <header className="sticky top-0 z-30 p-4 bg-card shadow-2xs">
      <div className="px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/">
            {/* 自定义字体渐变 */}
            <h1 className="text-2xl font-extrabold ">Notsy.</h1>
          </Link>
          <div className="flex justify-between items-center">
            {/* 搜索框 */}
            <form onSubmit={handleSearch} className="relative flex-grow mx-12 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="搜索..."
                className="pl-10 pr-4 w-full shadow-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            {/* avatar */}
            <div className="flex items-center space-x-4">
              {status === "loading" ? (
                <div>加载中...</div>
              ) : session?.user ? (
                <>
                  <HoverCard>
                    <HoverCardTrigger>
                      <img
                        src="/avatar.jpg"
                        alt="User Avatar"
                        className="h-9 w-9 rounded-full"
                      />
                    </HoverCardTrigger>
                    <HoverCardContent sideOffset={16} className="flex flex-col -translate-x-10 border border-[#f3f3f3] shadow-2xs">
                      <Link href="/" className="w-full flex flex-col">
                        <Button
                          variant="ghost"
                          className="cursor-pointer px-8 text-left"
                        >
                          前台
                        </Button>
                      </Link>
                      <Link href="/dashboard" className="w-full flex flex-col">
                        <Button
                          variant="ghost"
                          className="cursor-pointer px-8 text-left"
                        >
                          后台
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        onClick={() => signOut()}
                        className="cursor-pointer px-8 text-left"
                      >
                        注销
                      </Button>
                    </HoverCardContent>
                  </HoverCard>
                </>
              ) : (
                <Link href="/login">
                  <Button className="px-8 cursor-pointer">登录</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
