import { Link } from "react-router-dom";

export default function DishCard({ dish }) {
  return (
    <Link
      to={`/dish/${dish.id}`}
      className="group block rounded-2xl border border-stone-200 bg-white p-5 transition hover:border-emerald-800 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-stone-900 group-hover:text-emerald-900">
          {dish.name}
        </h3>
        <span className="shrink-0 rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-900">
          Rs. {dish.price.toFixed(2)}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-stone-500">{dish.category}</span>
        {!dish.available && (
          <span className="rounded-full bg-stone-200 px-2.5 py-0.5 font-medium text-stone-600">
            Sold out
          </span>
        )}
      </div>
    </Link>
  );
}
