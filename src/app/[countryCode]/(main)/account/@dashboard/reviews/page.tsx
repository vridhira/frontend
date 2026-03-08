import { Metadata } from "next"
import Reviews from "@modules/account/components/reviews"
import { getPendingReviews } from "@lib/data/account-features"
import { notFound } from "next/navigation"
import { retrieveCustomer } from "@lib/data/customer"

export const metadata: Metadata = {
  title: "Reviews",
  description: "Review your purchased products.",
}

export default async function ReviewsPage() {
  const customer = await retrieveCustomer().catch(() => null)

  if (!customer) {
    notFound()
  }

  const pendingReviews = await getPendingReviews()

  return <Reviews pendingReviews={pendingReviews} />
}
