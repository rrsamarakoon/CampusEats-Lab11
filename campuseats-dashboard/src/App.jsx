import { Routes, Route, NavLink } from "react-router-dom";
import MenuPage from "./features/menu/pages/MenuPage";
import DishDetailPage from "./features/menu/pages/DishDetailPage";
import OrderPage from "./features/menu/pages/OrderPage";

const linkClass = ({ isActive }) =>
  `rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
    isActive
      ? "bg-emerald-900 text-white"
      : "text-stone-600 hover:bg-stone-200"
  }`;

export default function App() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <h1 className="text-2xl font-bold tracking-tight text-emerald-900">
            Campus Eats
          </h1>
          <nav className="flex gap-2">
            <NavLink to="/" end className={linkClass}>
              Menu
            </NavLink>
            <NavLink to="/order" className={linkClass}>
              Place order
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <Routes>
          <Route path="/" element={<MenuPage />} />
          <Route path="/dish/:id" element={<DishDetailPage />} />
          <Route path="/order" element={<OrderPage />} />
          <Route
            path="*"
            element={<p className="text-stone-500">404 – Page not found</p>}
          />
        </Routes>
      </main>
    </div>
  );
}
