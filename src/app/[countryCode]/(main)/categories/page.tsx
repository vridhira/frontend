import { Metadata } from "next"
import CategoriesTemplate from "@modules/categories/templates/categories-template"

export const metadata: Metadata = {
  title: "Categories | Vridhira",
  description: "Browse all handcrafted categories from Indian artisans — pottery, textiles, jewellery, woodcraft and more.",
}

type Props = {
  params: Promise<{ countryCode: string }>
}

export default async function CategoriesPage(props: Props) {
  const params = await props.params

  return (
    <CategoriesTemplate countryCode={params.countryCode} />
  )
}
