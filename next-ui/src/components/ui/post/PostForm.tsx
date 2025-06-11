"use client"
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MdEditor } from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const formSchema = z.object({
  title: z.string().min(1, "标题不能为空"),
  content: z.string().min(1, "内容不能为空"),
});

type FormValues = z.infer<typeof formSchema>;

interface PostFormProps {
  onSuccess?: () => void;
}

export const PostForm = ({ onSuccess }: PostFormProps) => {
  const { data: session } = useSession();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      if (!session?.user?.id) {
        console.error("用户未登录");
        return;
      }
      const res = await fetch(`${process.env.NEXT_PUBLIC_NEST_API_URL}/post/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: values.title,
          content: values.content,
          authorId: session.user.id,
        }),
      });

      if (!res.ok) {
        toast.error("提交失败");
        throw new Error("提交失败");
      } else {
        toast.success("提交成功");
        onSuccess?.();
      }

      const data = await res.json();
      console.log("提交成功:", data);

      // 清空表单
      form.reset();
    } catch (error) {
      console.error("提交失败:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="mb-2">标题</FormLabel>
              <FormControl>
                <Input placeholder="请输入文章标题" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="mb-2">帖子内容</FormLabel>
              <FormControl>
                <MdEditor
                  modelValue={field.value}
                  onChange={field.onChange}
                  preview={false}
                  language="zh-CN"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          发布文章
        </Button>
      </form>
    </Form>
  );
};
