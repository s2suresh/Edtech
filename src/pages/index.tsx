import { CategorySlider } from '../components/CategorySlider';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <section className="max-w-7xl mx-auto py-8">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
          Explore Projects & Services
        </h2>
        <CategorySlider />
      </section>
    </main>
  );
}
