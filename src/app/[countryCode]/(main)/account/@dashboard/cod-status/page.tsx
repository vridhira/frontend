import { Metadata } from "next"
import { notFound } from "next/navigation"
import { retrieveCustomer } from "@lib/data/customer"
import { getCodStatus } from "@lib/data/account-features"
import CodStatusSection from "@modules/account/components/cod-status"

export const metadata: Metadata = {
  title: "Payment Status",
  description: "View your COD payment status and eligibility.",
}

export default async function CodStatusPage() {
  const customer = await retrieveCustomer().catch(() => null)

  if (!customer) {
    notFound()
  }

  const codStatus = await getCodStatus()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Status</h1>
        <p className="text-sm text-gray-600">View your cash on delivery payment status and eligibility</p>
      </div>

      <div className="max-w-2xl">
        {/* Status Overview */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">COD Eligibility</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Status</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  codStatus.is_blocked
                    ? "bg-red-100 text-red-700"
                    : codStatus.eligible
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {codStatus.is_blocked ? "Blocked" : codStatus.eligible ? "Eligible" : "Limited"}
              </span>
            </div>

            {codStatus.strike_count > 0 && (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Fraud Strikes</span>
                <span className="text-sm font-semibold">{codStatus.strike_count} / 2</span>
              </div>
            )}

            {codStatus.online_orders_needed && (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Online Orders Needed to Unlock</span>
                <span className="text-sm font-semibold">{codStatus.online_orders_needed}</span>
              </div>
            )}
          </div>
        </div>

        {/* Alert Section */}
        <CodStatusSection codStatus={codStatus} />

        {/* Information Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h3 className="font-semibold text-blue-900 mb-3">How COD Fraud Prevention Works</h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p>
              <strong>Strike System:</strong> When you cancel a picked-up parcel, you receive a fraud strike.
            </p>
            <p>
              <strong>Escalation:</strong> At 2 strikes, your COD access is blocked temporarily.
            </p>
            <p>
              <strong>Unlock:</strong> Complete 3 online payment orders to regain COD access.
            </p>
            <p className="text-xs pt-2 text-blue-700">
              This system helps us maintain a healthy marketplace and protect sellers from fraud.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
