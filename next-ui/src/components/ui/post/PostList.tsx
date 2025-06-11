import Image from "next/image";
import Link from "next/link";
import React from "react";

// 伪数据
const posts = [
  {
    postId: "1",
    postTitle: "文章 1",
    createDate: "2025-06-11",
  },
  {
    postId: "2",
    postTitle: "文章 2",
    createDate: "2025-06-11",
  },
  {
    postId: "3",
    postTitle: "文章 3",
    createDate: "2025-06-11",
  },
  {
    postId: "4",
    postTitle: "文章 4",
    createDate: "2025-06-11",
  },
  {
    postId: "5",
    postTitle: "文章 5",
    createDate: "2025-06-11",
  },
  {
    postId: "6",
    postTitle: "文章 6",
    createDate: "2025-06-11",
  },
];

interface Post {
  id: number;
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
  updatedAt: string
}

interface PostListProps {
  data: Post[]
}

export const PostList = ({
  data
}: PostListProps) => {
  return (
    <section className="w-full max-w-[800px] rounded-lg bg-card border border-[#f3f3f3] shadow-2xs py-4">
      <div className="w-full p-4">
        <span className="font-medium">帖子</span>
      </div>
      <div className="w-full border-b" />
      <main className="flex flex-col items-center my-12">
        {data.map((item, index) => {
          return (
            <Link 
             key={index}
             href={`/post/${item.id}`}
             className="flex justify-between w-full h-[110px] border-b p-4 hover:bg-accent transition-all duration-300"
            >
              <div className="flex flex-col justify-between flex-1">
                <h1 className="font-extrabold">{item.title}</h1>
                <p className="text-xs text-muted-foreground py-2">创建时间：{item.createdAt.split('T')[0]}</p>
              </div>
              <div className="relative h-[100%] w-[140px] bg-accent rounded-lg overflow-hidden">
                <Image
                 src="/cover.jpg"
                 alt="cover"
                 fill
                 className="object-cover"
                />
              </div>
            </Link>
          );
        })}
      </main>
    </section>
  );
};
