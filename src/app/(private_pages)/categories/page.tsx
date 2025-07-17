import { CategoryTable } from "@/app/components/category/categoryTable"
import { getCategories } from "@/app/components/category/action"

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="space-y-6">
      <CategoryTable initialCategories={categories} />
    </div>
  )
}