import { posts } from '../../lib/data';
import Link from 'next/link';

// Helper function to get unique categories and their subcategories
const getCategoriesWithSubcategories = () => {
  const categoriesMap = new Map<string, Set<string>>();

  posts.forEach((post) => {
    if (!categoriesMap.has(post.category)) {
      categoriesMap.set(post.category, new Set<string>());
    }
    categoriesMap.get(post.category)?.add(post.subcategory);
  });

  return Array.from(categoriesMap.entries()).map(([category, subcategories]) => ({
    category,
    subcategories: Array.from(subcategories),
  }));
};


export default function CategoriesPage() {
  const categories = getCategoriesWithSubcategories();

  return (
    <main className="p-10 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-10">Explore by Categories</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {categories.map(({ category, subcategories }, index) => (
          <div key={index} className="bg-white p-8 shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">{category}</h2>
            <ul className="space-y-2">
            {subcategories.map((subcategory, subIndex) => (
  <li key={subIndex}>
    <Link href={`/subcategory/${subcategory.toString().toLowerCase()}`} className="text-blue-500 hover:underline">
      {subcategory}
    </Link>
  </li>
))}

            </ul>
          </div>
        ))}
      </div>
    </main>
  );
}
