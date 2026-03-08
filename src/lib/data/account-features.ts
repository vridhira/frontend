"use server"

import { sdk } from "@lib/config"
import { getAuthHeaders, getCacheOptions } from "./cookies"

// ============ TYPES ============

export interface OrderTracking {
  order_id: string
  awb: string
  status: string
  status_details: string
  current_location: string
  origin_location: string
  destination_location: string
  shipment_date: string
  expected_delivery: string
  events: Array<{
    timestamp: string
    status: string
    location: string
    description: string
  }>
}

export interface PendingReview {
  product_id: string
  product_title: string
  product_handle: string
  product_image_url?: string
  variant_id: string
  order_id: string
  order_number: string
  purchased_at: string
}

export interface ReviewEligibility {
  eligible: boolean
  reason?: string
  has_review?: boolean
}

export interface EmailVerificationStatus {
  email: string
  verified: boolean
  verified_at?: string
  last_verification_sent_at?: string
}

export interface CodStatus {
  eligible: boolean
  strike_count: number
  is_blocked: boolean
  online_orders_needed?: number
  notifications: Array<{
    id: string
    type: string
    message: string
    created_at: string
  }>
}

export interface CancellationRisk {
  has_risk: boolean
  risk_level: "none" | "warning" | "high"
  message: string
  would_add_strike: boolean
}

export interface FaqQuery {
  id: string
  subject: string
  question: string
  answer?: string
  status: "pending" | "answered" | "closed"
  created_at: string
  answered_at?: string
}

export interface ShippingServiceability {
  pincode: string
  serviceable: boolean
  couriers: Array<{
    name: string
    estimated_days: number
    price: number
  }>
  message?: string
}

// ============ ORDER TRACKING ============

export const getOrderTracking = async (orderId: string): Promise<OrderTracking | null> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.client
    .fetch<{ tracking: OrderTracking }>(`/store/orders/${orderId}/tracking`, {
      method: "GET",
      headers,
    })
    .then(({ tracking }) => tracking)
    .catch(() => null)
}

// ============ REVIEWS ============

export const getPendingReviews = async (): Promise<PendingReview[]> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("reviews")),
  }

  return sdk.client
    .fetch<{ reviews: PendingReview[] }>(`/store/custom/pending-reviews`, {
      method: "GET",
      headers,
      next,
      cache: "force-cache",
    })
    .then(({ reviews }) => reviews || [])
    .catch(() => [])
}

export const checkReviewEligibility = async (productId: string): Promise<ReviewEligibility> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.client
    .fetch<ReviewEligibility>(`/store/custom/review-eligibility?product_id=${productId}`, {
      method: "GET",
      headers,
    })
    .then((data) => data)
    .catch(() => ({ eligible: false, reason: "Unable to check eligibility" }))
}

// ============ EMAIL VERIFICATION ============

export const getEmailVerificationStatus = async (): Promise<EmailVerificationStatus | null> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.client
    .fetch<{ status: EmailVerificationStatus }>(`/store/auth/email-status`, {
      method: "GET",
      headers,
    })
    .then(({ status }) => status)
    .catch(() => null)
}

export const sendVerificationEmail = async (): Promise<boolean> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.client
    .fetch<{ success: boolean }>(`/store/auth/send-verification`, {
      method: "POST",
      headers,
    })
    .then(({ success }) => success)
    .catch(() => false)
}

export const verifyEmail = async (token: string): Promise<boolean> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.client
    .fetch<{ verified: boolean }>(`/store/auth/verify-email?token=${token}`, {
      method: "GET",
      headers,
    })
    .then(({ verified }) => verified)
    .catch(() => false)
}

// ============ COD STATUS ============

export const getCodStatus = async (): Promise<CodStatus> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.client
    .fetch<CodStatus>(`/store/cod/eligibility`, {
      method: "GET",
      headers,
    })
    .then((data) => data)
    .catch(() => ({
      eligible: true,
      strike_count: 0,
      is_blocked: false,
      notifications: [],
    }))
}

export const getCodNotifications = async () => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.client
    .fetch<{ notifications: any[] }>(`/store/cod/notifications`, {
      method: "GET",
      headers,
    })
    .then(({ notifications }) => notifications || [])
    .catch(() => [])
}

export const getCancellationRisk = async (orderId: string): Promise<CancellationRisk> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.client
    .fetch<CancellationRisk>(`/store/cod/cancellation-risk/${orderId}`, {
      method: "GET",
      headers,
    })
    .then((data) => data)
    .catch(() => ({
      has_risk: false,
      risk_level: "none",
      message: "",
      would_add_strike: false,
    }))
}

// ============ INVOICES ============

export const getOrderInvoice = async (orderId: string): Promise<Blob | null> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.client
    .fetch<Blob>(`/store/orders/${orderId}/invoice`, {
      method: "GET",
      headers,
    })
    .then((blob) => blob)
    .catch(() => null)
}

// ============ SUPPORT & FAQ ============

export const submitFaqQuery = async (
  subject: string,
  question: string,
  customerEmail: string,
  customerName: string
): Promise<FaqQuery | null> => {
  return sdk.client
    .fetch<{ query: FaqQuery }>(`/store/faq-queries`, {
      method: "POST",
      body: {
        subject,
        question,
        customer_email: customerEmail,
        customer_name: customerName,
      },
    })
    .then(({ query }) => query)
    .catch(() => null)
}

// ============ SHIPPING SERVICEABILITY ============

export const checkShippingServiceability = async (
  pincode: string
): Promise<ShippingServiceability> => {
  return sdk.client
    .fetch<ShippingServiceability>(`/store/shipping/serviceability?pincode=${pincode}`, {
      method: "GET",
    })
    .then((data) => data)
    .catch(() => ({
      pincode,
      serviceable: false,
      couriers: [],
      message: "Unable to check serviceability",
    }))
}

// ============ OVERVIEW WIDGET DATA ============

export interface OrderStats {
  total_orders: number
  total_spent: number
  member_since: string
  average_order_value: number
}

export interface RecentlyViewedProduct {
  id: string
  title: string
  handle: string
  image_url?: string
  price: number
  currency_code: string
}

export interface ActivityEvent {
  id: string
  type: "order" | "review" | "wishlist" | "address" | "email"
  title: string
  description: string
  timestamp: string
  icon: string
}

export interface SupportTicket {
  id: string
  subject: string
  status: "open" | "pending" | "resolved" | "closed"
  created_at: string
  updated_at: string
}

export interface UserTier {
  name: string
  icon: string
  current_level: number
  perks: string[]
  next_level?: {
    name: string
    orders_needed: number
  }
}

export interface ReferralInfo {
  referral_link: string
  total_referrals: number
  total_rewards: number
  pending_rewards: number
}

export interface NotificationItem {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  timestamp: string
  read: boolean
}

// ============ ORDER STATISTICS ============

export const getOrderStatistics = async (): Promise<OrderStats> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.client
    .fetch<OrderStats>(`/store/customer/order-stats`, {
      method: "GET",
      headers,
    })
    .then((data) => data)
    .catch(() => ({
      total_orders: 0,
      total_spent: 0,
      member_since: new Date().toISOString(),
      average_order_value: 0,
    }))
}

// ============ RECENTLY VIEWED PRODUCTS ============

export const getRecentlyViewedProducts = async (): Promise<RecentlyViewedProduct[]> => {
  return Promise.resolve([])
    .catch(() => [])
}

// ============ ACTIVITY TIMELINE ============

export const getActivityTimeline = async (): Promise<ActivityEvent[]> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.client
    .fetch<{ events: ActivityEvent[] }>(`/store/customer/activity`, {
      method: "GET",
      headers,
    })
    .then(({ events }) => events || [])
    .catch(() => [])
}

// ============ SUPPORT TICKETS ============

export const getSupportTickets = async (): Promise<SupportTicket[]> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.client
    .fetch<{ tickets: SupportTicket[] }>(`/store/customer/support-tickets`, {
      method: "GET",
      headers,
    })
    .then(({ tickets }) => tickets || [])
    .catch(() => [])
}

// ============ USER TIER/VIP STATUS ============

export const getUserTieStatus = async (): Promise<UserTier | null> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.client
    .fetch<UserTier>(`/store/customer/tier`, {
      method: "GET",
      headers,
    })
    .then((data) => data)
    .catch(() => null)
}

// ============ REFERRAL PROGRAM ============

export const getReferralInfo = async (): Promise<ReferralInfo | null> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.client
    .fetch<ReferralInfo>(`/store/customer/referral`, {
      method: "GET",
      headers,
    })
    .then((data) => data)
    .catch(() => null)
}

// ============ NOTIFICATIONS ============

export const getNotifications = async (limit = 3): Promise<NotificationItem[]> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.client
    .fetch<{ notifications: NotificationItem[] }>(`/store/customer/notifications?limit=${limit}`, {
      method: "GET",
      headers,
    })
    .then(({ notifications }) => notifications || [])
    .catch(() => [])
}
