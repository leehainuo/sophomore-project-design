"use client"
import React from 'react'
import Clock from '@/components/ui/Clock';
import Link from 'next/link';
import { PostForm } from '@/components/ui/post/PostForm';
import { useSession } from 'next-auth/react';
import { PostManage } from '@/components/ui/post/PostManage';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from "sonner";

export default function DashboardPage() {
  const {data: session} = useSession()
  const queryClient = useQueryClient();

  const role = session?.user.role

  const handlePostFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['posts'] });
    toast.success("文章操作成功！");
  };

  return (
    <section
     className="py-12 px-24 flex flex-col justify-center items-center"
    >
      <div
       className="flex justify-center md:justify-between items-center w-full h-[80px] border border-[#f3f3f3] bg-card rounded-lg shadow-2xs p-4"
      >
        <Clock />
        <div className="hidden md:block border border-l-[#f3f3f3] w-[1px] h-full" />
        <div className="hidden lg:flex gap-x-4 p-4 font-bold">
          <h1>作者：leehainuo</h1>
          <h1>个人网站：<Link href="https://lihainuo.com/" className="font-m">lihainuo.com</Link></h1>
        </div>
        <div className="hidden lg:block border border-l-[#f3f3f3] w-[1px] h-full" />
        <div className="hidden md:block font-bold text-muted-foreground p-4">
          Next + Nest 简单，不失体验.
        </div>
      </div>
      {role === "管理员" && <PostManage />}
      <main className="flex w-full bg-card border border-[#f3f3f3] rounded-lg my-24 p-8">
        <PostForm onSuccess={handlePostFormSuccess} />
      </main>
    </section>
  )
}
