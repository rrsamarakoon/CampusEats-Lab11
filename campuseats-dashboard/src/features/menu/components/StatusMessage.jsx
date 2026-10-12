const styles = {
  info: "border-stone-200 bg-white text-stone-500",
  error: "border-red-200 bg-red-50 text-red-700",
};

export default function StatusMessage({ type = "info", children }) {
  return (
    <p className={`rounded-xl border px-4 py-6 text-center ${styles[type]}`}>
      {children}
    </p>
  );
}
