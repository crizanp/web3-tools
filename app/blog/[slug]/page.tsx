import { posts } from '../../../lib/data';
import { notFound } from 'next/navigation';

export default function BlogDetail({ params }) {
  const { slug } = params;
  const post = posts.find((p) => p.slug === slug);

  if (!post) return notFound();

  return (
    <main className="p-10">
      <h1 className="text-4xl font-bold mb-5">{post.title}</h1>
      <p className="text-gray-600 mb-5">{post.date}</p>
      <article className="prose lg:prose-xl">
        <p>{post.content}</p>
      </article>
    </main>
  );
}
