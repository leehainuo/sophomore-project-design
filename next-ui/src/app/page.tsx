import { Header } from "@/components/layout/Header";
import { EmptyState } from "@/components/ui/empty-state";
import { PostList } from "@/components/ui/post/PostList";

export default async function Home({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  const searchQuery = searchParams.search || "";
  
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_NEST_API_URL}/post/findall${
      searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ""
    }`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  
  const data = await res.json();

  return (
    <section>
      <Header />
      <main className="relative py-12 px-24 flex justify-center items-center">
        {data?.data?.length > 0 ? (
          <PostList data={data.data} />
        ) : (
          <EmptyState
            title="没有找到相关内容"
            description={searchQuery ? `没有找到与"${searchQuery}"相关的内容` : "暂无数据"}
          />
        )}
      </main>
    </section>
  );
}
