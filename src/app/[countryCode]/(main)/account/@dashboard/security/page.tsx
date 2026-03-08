import { Metadata } from "next"
import { notFound } from "next/navigation"
import { retrieveCustomer } from "@lib/data/customer"
import EmailVerification from "@modules/account/components/email-verification"

export const metadata: Metadata = {
  title: "Security",
  description: "Manage your account security and email verification.",
}

export default async function SecurityPage() {
  const customer = await retrieveCustomer().catch(() => null)

  if (!customer) {
    notFound()
  }

  const emailVerificationStatus = {
    email: customer.email || "",
    verified: customer.metadata?.email_verified === true,
    verified_at: customer.metadata?.email_verified_at as string | undefined,
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Account Security</h1>
        <p className="text-sm text-gray-600">Manage your account security settings and preferences</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Email Verification Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Email Verification</h2>
          <EmailVerification status={emailVerificationStatus} />
        </div>

        {/* Security Info */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Security Tips</h2>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex gap-3">
              <span className="text-lg">🔐</span>
              <span>Use a strong, unique password for your account</span>
            </li>
            <li className="flex gap-3">
              <span className="text-lg">📧</span>
              <span>Verify your email to receive important account notifications</span>
            </li>
            <li className="flex gap-3">
              <span className="text-lg">🔔</span>
              <span>Keep your contact information up to date</span>
            </li>
            <li className="flex gap-3">
              <span className="text-lg">👁️</span>
              <span>Regularly review your account activity and orders</span>
            </li>
            <li className="flex gap-3">
              <span className="text-lg">⚠️</span>
              <span>Never share your password or verification codes with anyone</span>
            </li>
          </ul>
        </div>

        {/* Account Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium text-gray-900">{customer.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Account Status:</span>
              <span className="font-medium text-green-600">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
