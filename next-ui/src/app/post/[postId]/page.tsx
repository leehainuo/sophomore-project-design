import { Header } from "@/components/layout/Header";
import CodeBlock from "@/components/ui/ContentBlock";
import { MDXRemote } from 'next-mdx-remote/rsc'

export default async function Page({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;

  const res = await fetch(`${process.env.NEST_API_URL}/post/findone`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      postId: postId,
    }),
  });
  const data = await res.json();

  const markdown = data?.data[0].content;
  // 添加 MDX 组件配置
  const components = {
    pre: ({ children }: { children: React.ReactNode }) => (
      <div className="overflow-auto my-4 rounded-sm">{children}</div>
    ),
    code: CodeBlock,
  };

  return (
    <>
      <Header />
      <section className="py-12 px-24 flex justify-center items-center">
        <main className="flex flex-col min-w-[485px] w-[535px] min-h-[80vh] bg-card border-[1.5px] border-[#f3f3f3] shadow-2xs py-8 px-5">
          <div className="flex justify-between relative">
            <h1 className="font-bold text-xl">{data?.data[0].title}</h1>
            <p className="absolute right-0 -bottom-3 text-[12px] text-muted-foreground">
              {data?.data[0].updatedAt.split("T")[0]}
            </p>
          </div>
          <div className="border my-4" />
          <div className="text-[12px]">
            <MDXRemote
             source={markdown}
             components={components}
            />
          </div>
        </main>
      </section>
    </>
  );
}
