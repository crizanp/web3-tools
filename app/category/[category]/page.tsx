import { posts } from '../../../lib/data';
import Link from 'next/link';

export default function CategoryPage({ params }) {
  const { category } = params;
  const filteredPosts = posts.filter((post) => post.category === category);

  return (
    <main className="p-10">
      <h1 className="text-4xl font-bold mb-5">Posts in {category}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredPosts.map((post) => (
          <div key={post.id} className="bg-gray-100 p-5 rounded shadow-md">
            <h2 className="text-2xl font-semibold">{post.title}</h2>
            <Link href={`/blog/${post.slug}`}>
              <a className="text-blue-500 hover:underline">Read More</a>
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
