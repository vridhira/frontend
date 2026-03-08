"use server"

import { sdk } from "@lib/config"
import { getAuthHeaders } from "./cookies"

type Courier = {
  name: string
  rate: number
  estimated_days: number
  cod_available: boolean
}

type ServiceabilityResponse = {
  success: boolean
  serviceable: boolean
  pincode: string
  couriers: Courier[]
  message: string
}

export async function checkPincodeServiceability(
  pincode: string
): Promise<ServiceabilityResponse> {
  const authHeaders = await getAuthHeaders()

  if (!authHeaders || !("authorization" in authHeaders)) {
    return {
      success: false,
      serviceable: false,
      pincode,
      couriers: [],
      message: "AUTH_REQUIRED",
    }
  }

  const data = await sdk.client.fetch<ServiceabilityResponse>(
    `/store/shipping/serviceability?pincode=${pincode}&weight=0.5`,
    {
      method: "GET",
      headers: { ...authHeaders },
    }
  )

  return data
}
