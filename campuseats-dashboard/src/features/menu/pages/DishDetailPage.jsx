import { useParams, Link } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import StatusMessage from "../components/StatusMessage";
import { MENU_URL } from "../../../lib/api";

export default function DishDetailPage() {
  const { id } = useParams();
  // GET /api/menu/{id}  (backend)
  const { data: dish, isLoading, error } = useFetch(`${MENU_URL}/${id}`, null);

  const back = (
    <Link
      to="/"
      className="inline-block text-sm font-medium text-emerald-900 hover:underline"
    >
      ← Back to menu
    </Link>
  );

  if (isLoading) return <StatusMessage>Loading dish…</StatusMessage>;

  if (error || !dish)
    return (
      <div className="space-y-4">
        <StatusMessage type="error">
          {error === "HTTP 404"
            ? `Dish #${id} does not exist.`
            : `Could not load dish #${id} (${error}).`}
        </StatusMessage>
        {back}
      </div>
    );

  return (
    <div className="space-y-6">
      {back}
      <article className="rounded-2xl border border-stone-200 bg-white p-8">
        <p className="text-sm text-stone-500">{dish.category}</p>
        <h2 className="mt-1 text-3xl font-bold tracking-tight text-stone-900">
          {dish.name}
        </h2>
        <p className="mt-4 text-2xl font-semibold text-amber-800">
          Rs. {dish.price.toFixed(2)}
        </p>
        <p
          className={`mt-6 inline-block rounded-full px-3 py-1 text-sm font-medium ${
            dish.available
              ? "bg-emerald-100 text-emerald-900"
              : "bg-stone-200 text-stone-600"
          }`}
        >
          {dish.available ? "Available today" : "Sold out"}
        </p>
      </article>
    </div>
  );
}
