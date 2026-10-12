import DishCard from "./DishCard";
import StatusMessage from "./StatusMessage";

export default function MenuList({ dishes }) {
  if (!dishes.length)
    return <StatusMessage>No dishes match your search.</StatusMessage>;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {dishes.map((dish) => (
        <DishCard key={dish.id} dish={dish} />
      ))}
    </div>
  );
}
