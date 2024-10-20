import Link from 'next/link';
import { posts } from '../lib/data';

export default function HomePage() {
  return (
    <main className="p-10">
      <h1 className="text-4xl font-bold mb-5">Latest Blog Posts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {posts.map((post) => (
          <div key={post.id} className="bg-gray-100 p-5 rounded shadow-md">
            <h2 className="text-2xl font-semibold">{post.title}</h2>
            <p className="text-gray-600">{post.content.slice(0, 100)}...</p>
            <Link href={`/blog/${post.slug}`} className="text-blue-500 hover:underline">
  Learn More
</Link>

          </div>
        ))}
      </div>
    </main>
  );
}
