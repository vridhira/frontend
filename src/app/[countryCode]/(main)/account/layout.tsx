import { retrieveCustomer } from "@lib/data/customer"
import { Toaster } from "@medusajs/ui"
import AccountLayout from "@modules/account/templates/account-layout"

export default async function AccountPageLayout({
  dashboard,
  login,
}: {
  dashboard?: React.ReactNode
  login?: React.ReactNode
}) {
  const customer = await retrieveCustomer().catch(() => null)

  // Render login full-bleed (no AccountLayout wrapper) so the gradient fills the screen
  if (!customer) {
    return (
      <>
        {login}
        <Toaster />
      </>
    )
  }

  return (
    <AccountLayout customer={customer}>
      {dashboard}
      <Toaster />
    </AccountLayout>
  )
}
