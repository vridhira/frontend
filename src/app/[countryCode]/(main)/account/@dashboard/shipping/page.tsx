import { Metadata } from "next"
import { notFound } from "next/navigation"
import { retrieveCustomer } from "@lib/data/customer"
import ShippingInfo from "@modules/account/components/shipping-info"

export const metadata: Metadata = {
  title: "Shipping Information",
  description: "Check shipping availability and delivery information.",
}

export default async function ShippingPage() {
  const customer = await retrieveCustomer().catch(() => null)

  if (!customer) {
    notFound()
  }

  return <ShippingInfo />
}
