import {Category} from "@/app/types";

export function CategoryBadge({category}: { category: Category }) {
  return (
    <span className="bg-blue-100 text-blue-800 border border-blue-400 text-sm font-medium me-2 px-2.5 py-0.5 rounded-sm">
      {category}
    </span>
  )
}