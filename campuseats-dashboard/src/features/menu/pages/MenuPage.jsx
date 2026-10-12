import { useState } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { useFetch } from "../hooks/useFetch";
import MenuList from "../components/MenuList";
import StatusMessage from "../components/StatusMessage";
import { MENU_URL } from "../../../lib/api";

export default function MenuPage() {
  // GET /api/menu  (backend)
  const { data: dishes, isLoading, error } = useFetch(MENU_URL);
  const [query, setQuery] = useState("");
  const debounced = useDebounce(query, 400);

  if (isLoading) return <StatusMessage>Loading menu…</StatusMessage>;
  if (error)
    return (
      <StatusMessage type="error">
        Could not load the menu ({error}). Is the API running on {MENU_URL}?
      </StatusMessage>
    );

  const filtered = dishes.filter((d) =>
    d.name.toLowerCase().includes(debounced.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search dishes…"
        aria-label="Search dishes"
        className="w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 outline-none focus:border-emerald-800 focus:ring-2 focus:ring-emerald-800/20 sm:max-w-sm"
      />
      <MenuList dishes={filtered} />
    </div>
  );
}
