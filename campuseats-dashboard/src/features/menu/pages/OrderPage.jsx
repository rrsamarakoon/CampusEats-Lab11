import { useState } from "react";

const inputClass =
  "mt-1 w-full rounded-xl border border-stone-300 px-4 py-2.5 font-normal outline-none focus:border-emerald-800 focus:ring-2 focus:ring-emerald-800/20";

export default function OrderPage() {
  const [form, setForm] = useState({ name: "", email: "", qty: 1 });
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);

  function validate(v) {
    const e = {};
    if (v.name.trim().length < 2) e.name = "Name too short";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.email)) e.email = "Enter a valid email";
    if (Number(v.qty) < 1) e.qty = "Qty must be ≥ 1";
    return e;
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length === 0) setDone(true);
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-900">
        <p className="font-semibold">Thanks, {form.name}! Order received.</p>
      </div>
    );
  }

  return (
    <form
      className="mx-auto max-w-md space-y-4 rounded-2xl border border-stone-200 bg-white p-6"
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl font-bold text-stone-900">Place your order</h2>

      <label className="block text-sm font-medium text-stone-700">
        Name
        <input
          className={inputClass}
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Your name"
        />
      </label>
      {errors.name && <span className="block text-sm text-red-600">{errors.name}</span>}

      <label className="block text-sm font-medium text-stone-700">
        Email
        <input
          className={inputClass}
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
        />
      </label>
      {errors.email && <span className="block text-sm text-red-600">{errors.email}</span>}

      <label className="block text-sm font-medium text-stone-700">
        Quantity
        <input
          className={inputClass}
          name="qty"
          type="number"
          value={form.qty}
          onChange={handleChange}
        />
      </label>
      {errors.qty && <span className="block text-sm text-red-600">{errors.qty}</span>}

      <button
        type="submit"
        className="w-full rounded-xl bg-emerald-900 px-4 py-2.5 font-semibold text-white transition hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-900"
      >Place order</button>
    </form>
  );
}