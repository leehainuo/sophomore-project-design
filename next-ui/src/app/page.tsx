import { Header } from "@/components/layout/Header";
import { PostList } from "@/components/ui/post/PostList";

export default async function Home() {

  const res = await fetch(`${process.env.NEXT_PUBLIC_NEST_API_URL}/post/findall`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
  const data = await res.json()

  return (
    <section>
      <Header />
      <main className="relative py-12 px-24 flex justify-center items-center">
        <PostList data={data?.data} />
      </main>
    </section>
  );
}
