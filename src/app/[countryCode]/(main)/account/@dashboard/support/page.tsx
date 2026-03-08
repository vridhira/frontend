import { Metadata } from "next"
import { notFound } from "next/navigation"
import { retrieveCustomer } from "@lib/data/customer"
import Support from "@modules/account/components/support"

export const metadata: Metadata = {
  title: "Support",
  description: "Get help with your orders and account.",
}

export default async function SupportPage() {
  const customer = await retrieveCustomer().catch(() => null)

  if (!customer) {
    notFound()
  }

  return <Support customer={customer} />
}
