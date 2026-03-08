import { Metadata } from "next"
import { notFound } from "next/navigation"
import { retrieveCustomer } from "@lib/data/customer"
import { listOrders } from "@lib/data/orders"
import { getOrderTracking } from "@lib/data/account-features"
import OrderTrackingCard from "@modules/account/components/order-tracking"

export const metadata: Metadata = {
  title: "Track Orders",
  description: "Track your order shipments in real-time.",
}

export default async function TrackOrdersPage() {
  const customer = await retrieveCustomer().catch(() => null)

  if (!customer) {
    notFound()
  }

  const orders = (await listOrders().catch(() => null)) || []

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Track Your Orders</h1>
        <p className="text-sm text-gray-600">
          Monitor your shipments in real-time with live tracking updates
        </p>
      </div>

      {orders && orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map(async (order) => {
            const tracking = await getOrderTracking(order.id)
            return (
              <OrderTrackingCard
                key={order.id}
                tracking={tracking}
                orderId={order.id}
                orderNumber={order.display_id?.toString() || order.id}
              />
            )
          })}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-600">No orders to track</p>
        </div>
      )}
    </div>
  )
}
