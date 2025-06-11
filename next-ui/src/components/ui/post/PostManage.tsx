"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";

export const PostManage = () => {
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState<number | null>(null);

  const {
    data: posts,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_NEST_API_URL}/post/findall`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error("获取文章失败");
      }
      return res.json();
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: async (postId: number) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_NEST_API_URL}/post/delete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ postId }),
        }
      );

      if (!res.ok) {
        throw new Error("删除文章失败");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("文章删除成功");
      setIsDeleteDialogOpen(false);
      setPostIdToDelete(null);
    },
    onError: (err) => {
      toast.error(`删除失败: ${err.message}`);
      setIsDeleteDialogOpen(false);
      setPostIdToDelete(null);
    },
  });

  const handleDeleteClick = (postId: number) => {
    setPostIdToDelete(postId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (postIdToDelete !== null) {
      deletePostMutation.mutate(postIdToDelete);
    }
  };

  if (isLoading) {
    return (
      <section className="flex w-full bg-card border border-[#f3f3f3] rounded-lg mt-12 p-8">
        加载中...
      </section>
    );
  }

  if (isError) {
    return (
      <section className="flex w-full bg-card border border-[#f3f3f3] rounded-lg mt-12 p-8">
        错误: {error?.message}
      </section>
    );
  }
  console.log(posts);

  return (
    <section className="flex flex-col h-[250px] w-full bg-card border border-[#f3f3f3] rounded-lg mt-12 p-8 overflow-y-scroll">
      {posts?.data && posts?.data.length > 0 ? (
        posts?.data.map((item: any) => (
          <div
            key={item.id}
            className="border-b border-gray-200 pt-4 pb-2 flex justify-between items-center"
          >
            <div>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-sm text-muted-foreground">
                作者ID: {item.authorId}
              </p>
            </div>
            <div className="flex space-x-6">
              <Link href={`/post/${item.id}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="px-7 cursor-pointer"
                >
                  查看
                </Button>
              </Link>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteClick(item.id)}
                disabled={deletePostMutation.isPending}
                className="px-7 cursor-pointer"
              >
                删除
              </Button>
            </div>
          </div>
        ))
      ) : (
        <p>暂无文章</p>
      )}

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="shadow-none border-[#f3f3f3]">
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              您确定要删除这篇文章吗？此操作无法撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={deletePostMutation.isPending}
              className="cursor-pointer"
            >
              取消
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deletePostMutation.isPending}
              className="cursor-pointer"
            >
              {deletePostMutation.isPending ? "删除中..." : "确认删除"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};
