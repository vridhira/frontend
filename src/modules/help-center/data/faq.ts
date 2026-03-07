// ─── Help Center FAQ Data ──────────────────────────────────────────────────────
// Static FAQ content for the Vridhira Help Center.
// In future, this can be replaced by a CMS/API call.

export type FAQStep = {
  heading: string
  body: string
  /** Optional inline link rendered after the body text */
  link?: { label: string; href: string }
  /** Optional inline CTA button rendered after the body text */
  button?: { label: string; href: string }
}

export type FAQArticle = {
  id: string
  title: string
  description: string
  /** Matches the section IDs: buying | shipping | payments | account | trust | community */
  section: string
  /** Ordered steps shown on the detail page */
  steps: FAQStep[]
  /** Optional tips shown below the steps */
  tips?: string[]
  /** Related article IDs shown at the bottom */
  related?: string[]
}

export type FAQTopic = {
  id: string
  title: string
  description: string
}

// ── Topics (cards in the grid) ────────────────────────────────────────────────
// "Selling & Shop" deliberately excluded per product decision.
export const TOPICS: FAQTopic[] = [
  {
    id: "buying",
    title: "Buying & Orders",
    description: "Tracking, returns, cancellations and order issues.",
  },
  {
    id: "shipping",
    title: "Shipping",
    description: "Delivery times, shipping costs, and return policies.",
  },
  {
    id: "payments",
    title: "Payments",
    description: "Refunds, payment methods, and transaction queries.",
  },
  {
    id: "account",
    title: "Account",
    description: "Password resets, profile updates, and privacy controls.",
  },
  {
    id: "community",
    title: "Community",
    description: "Forums, artisan teams, local events and workshops.",
  },
  {
    id: "trust",
    title: "Trust & Safety",
    description: "Data privacy, reporting issues, and platform safety.",
  },
]

// ── Sidebar nav sections ──────────────────────────────────────────────────────
// "Selling" tab deliberately excluded per product decision.
export type SidebarSection = {
  id: string
  label: string
}

export const SIDEBAR_SECTIONS: SidebarSection[] = [
  { id: "all",       label: "Overview"       },
  { id: "buying",    label: "Buying & Orders" },
  { id: "shipping",  label: "Shipping"        },
  { id: "payments",  label: "Payments"        },
  { id: "account",   label: "Account"         },
  { id: "community", label: "Community"       },
  { id: "trust",     label: "Trust & Safety"  },
]

// ── Articles ──────────────────────────────────────────────────────────────────
export const ARTICLES: FAQArticle[] = [
  // ── Buying & Orders ──────────────────────────────────────────────────────────
  {
    id: "track-order",
    title: "How do I track my order?",
    description: "Find out the current status and location of your handmade order.",
    section: "buying",
    steps: [
      {
        heading: "Go to Your Orders",
        body: "Log in to your Vridhira account and click on your profile icon at the top right. Select 'My Orders' from the dropdown menu.",
        button: { label: "View My Orders", href: "/account/orders" },
      },
      {
        heading: "Find the order",
        body: "Locate the order you want to track. Orders are listed with the most recent at the top. Click on the order to open its details page.",
      },
      {
        heading: "View tracking information",
        body: "On the order details page, you'll see a 'Track Shipment' button if the order has been dispatched. Click it to open the live tracking page provided by our shipping partner (Shiprocket/Delhivery).",
        link: { label: "Track my shipment →", href: "/account/orders" },
      },
      {
        heading: "Check estimated delivery",
        body: "The tracking page shows estimated delivery date, current location of the package, and a timeline of transit events.",
      },
    ],
    tips: [
      "Tracking updates can take up to 24 hours to appear after dispatch.",
      "You'll also receive an SMS and email with the tracking link once your order ships.",
      "If the tracking link shows no movement for more than 5 days, contact our support team.",
    ],
    related: ["order-not-delivered", "cancel-order"],
  },
  {
    id: "cancel-order",
    title: "How do I cancel an order?",
    description: "Learn about the cancellation window and how to request a cancellation.",
    section: "buying",
    steps: [
      {
        heading: "Act within 12 hours",
        body: "Orders can be cancelled within 12 hours of placement, provided they haven't been dispatched yet. After dispatch, cancellation isn't possible — you'll need to initiate a return.",
      },
      {
        heading: "Open My Orders",
        body: "Go to your account and open 'My Orders'. Click on the order you want to cancel.",
        button: { label: "Go to My Orders", href: "/account/orders" },
      },
      {
        heading: "Request cancellation",
        body: "Click the 'Cancel Order' button on the order details page and select a reason. Your cancellation request will be reviewed within 2 hours.",
      },
      {
        heading: "Refund processing",
        body: "If your payment was already processed, the refund will be credited back to the original payment method within 5–7 business days.",
      },
    ],
    tips: [
      "COD orders can be cancelled any time before delivery.",
      "If you placed an order by mistake, cancel immediately — artisans begin preparing handmade items quickly.",
    ],
    related: ["return-order", "refund-timeline"],
  },
  {
    id: "return-order",
    title: "How do I return a product?",
    description: "Step-by-step guide to initiating a return for an eligible item.",
    section: "buying",
    steps: [
      {
        heading: "Check return eligibility",
        body: "Returns are accepted within 7 days of delivery for items that are damaged, defective, or significantly different from the listing. Handmade items with minor variations (natural to the craft) are not eligible for returns.",
      },
      {
        heading: "Open the order",
        body: "Go to 'My Orders', click on the relevant order and select 'Return Item'.",
        button: { label: "Go to My Orders", href: "/account/orders" },
      },
      {
        heading: "Select reason",
        body: "Choose the most accurate reason — damaged in transit, wrong item received, or quality doesn't match description. Upload clear photos of the item.",
      },
      {
        heading: "Schedule pickup",
        body: "Once your return request is approved (usually within 24 hours), a pickup will be scheduled at your delivery address within 2–3 business days.",
      },
      {
        heading: "Refund after inspection",
        body: "Once the item is received and inspected by the artisan or warehouse team, your refund will be processed within 5–7 business days.",
      },
    ],
    tips: [
      "Keep the original packaging while raising a return — it makes the process smoother.",
      "Take an unboxing video if you suspect the item may be damaged — this serves as strong evidence.",
    ],
    related: ["cancel-order", "refund-timeline"],
  },
  {
    id: "order-not-delivered",
    title: "My order hasn't arrived — what should I do?",
    description: "Steps to take if your estimated delivery date has passed.",
    section: "buying",
    steps: [
      {
        heading: "Check the tracking link",
        body: "First check your tracking link (from your order page or the SMS/email we sent). The package might be at a nearby facility or pending a delivery attempt.",
      },
      {
        heading: "Wait 2 extra days",
        body: "During festive seasons or in remote pin codes, deliveries can be delayed by 1–2 days beyond the estimate. Allow a small buffer before raising a complaint.",
      },
      {
        heading: "Contact delivery partner",
        body: "If the tracking shows 'Out for Delivery' or 'Delivery Failed', you can call the delivery partner directly using the number on your tracking page.",
      },
      {
        heading: "Raise a complaint",
        body: "If the package hasn't moved in 7+ days or shows as delivered but wasn't received, go to 'My Orders' → select the order → click 'I didn't receive this'. Our team will investigate within 48 hours.",
        button: { label: "Raise a complaint", href: "/account/orders" },
      },
    ],
    tips: [
      "Delivery partners attempt delivery up to 3 times. Make sure someone is available to receive the package.",
      "Ensure your delivery address and phone number are correct in your account settings.",
    ],
    related: ["track-order", "return-order"],
  },

  // ── Shipping ─────────────────────────────────────────────────────────────────
  {
    id: "delivery-time",
    title: "How long does delivery take?",
    description: "Standard and express shipping timelines for orders across India.",
    section: "shipping",
    steps: [
      {
        heading: "Standard delivery",
        body: "Most orders within metro cities (Delhi, Mumbai, Bengaluru, Hyderabad, Chennai, Pune) are delivered in 3–5 business days.",
      },
      {
        heading: "Tier 2 & Tier 3 cities",
        body: "Orders to smaller cities and towns typically take 5–7 business days.",
      },
      {
        heading: "Remote / J&K / Northeast",
        body: "Deliveries to remote pin codes, Jammu & Kashmir, and Northeastern states can take up to 10–12 business days.",
      },
      {
        heading: "Processing time",
        body: "Handmade items may require 1–2 additional business days for the artisan to pack and hand over to the courier.",
      },
    ],
    tips: [
      "Delivery times may be longer during peak seasons like Diwali, Holi, and New Year.",
      "You can check the estimated delivery date on the product page before placing the order.",
    ],
    related: ["shipping-cost", "track-order"],
  },
  {
    id: "shipping-cost",
    title: "What are the shipping charges?",
    description: "Understand how shipping fees are calculated and when you get free shipping.",
    section: "shipping",
    steps: [
      {
        heading: "Free shipping threshold",
        body: "Orders above ₹499 qualify for free standard shipping anywhere in India.",
      },
      {
        heading: "Orders below ₹499",
        body: "A flat shipping fee of ₹49 is applied to orders below ₹499.",
      },
      {
        heading: "Heavy or oversized items",
        body: "Certain heavy items (e.g. large pottery, furniture) may have an additional handling charge displayed on the product page.",
      },
      {
        heading: "Express shipping",
        body: "Express delivery (1–2 days in select cities) is available at checkout for an additional ₹99.",
      },
    ],
    tips: [
      "Add a small item to your cart to reach the free shipping threshold — it often saves more than the item costs.",
      "Check for seasonal free-shipping promotions on the homepage.",
    ],
    related: ["delivery-time", "change-address"],
  },
  {
    id: "change-address",
    title: "Can I change my shipping address after placing an order?",
    description: "Address update options available before your order is dispatched.",
    section: "shipping",
    steps: [
      {
        heading: "Before dispatch — contact support immediately",
        body: "Address changes are only possible before the order is dispatched. Go to 'My Orders', open the order, and click 'Request Address Change'. Fill in the new address.",
      },
      {
        heading: "After dispatch — not possible",
        body: "Once a package is marked 'Dispatched' or 'Shipped', the address cannot be changed as the package is already with the courier.",
      },
      {
        heading: "If delivery fails",
        body: "If the courier can't deliver (wrong address, nobody available), they'll attempt delivery up to 3 times and then return it to the origin. You can re-order to the correct address.",
      },
    ],
    tips: [
      "Double-check your address at checkout — especially the pin code and flat/house number.",
      "Save multiple addresses in your account profile to switch quickly during checkout.",
    ],
    related: ["delivery-time", "order-not-delivered"],
  },

  // ── Payments ─────────────────────────────────────────────────────────────────
  {
    id: "payment-methods",
    title: "What payment methods are accepted?",
    description: "UPI, cards, net banking, and wallets accepted on Vridhira.",
    section: "payments",
    steps: [
      {
        heading: "UPI",
        body: "Pay via any UPI app — Google Pay, PhonePe, Paytm, BHIM. Use your UPI ID or scan the QR code at checkout.",
      },
      {
        heading: "Credit & Debit Cards",
        body: "Visa, Mastercard, RuPay, and Amex cards are accepted. 3D Secure authentication is required for added safety.",
      },
      {
        heading: "Net Banking",
        body: "Direct bank transfers supported for all major Indian banks including SBI, HDFC, ICICI, Axis, Kotak, and more.",
      },
      {
        heading: "Cash on Delivery (COD)",
        body: "COD is available for orders up to ₹5,000 at eligible pin codes. Check availability at checkout. An extra ₹30 COD handling fee applies.",
      },
    ],
    tips: [
      "UPI is the fastest and most reliable payment method on Vridhira.",
      "Card payments are processed securely via Razorpay — your card details are never stored on our servers.",
    ],
    related: ["payment-failed", "refund-timeline"],
  },
  {
    id: "refund-timeline",
    title: "When will I receive my refund?",
    description: "Typical refund timelines by payment method — UPI, card, and bank transfer.",
    section: "payments",
    steps: [
      {
        heading: "UPI refunds",
        body: "Refunds to UPI-linked bank accounts are typically processed within 2–3 business days after approval.",
      },
      {
        heading: "Credit / Debit card refunds",
        body: "Card refunds take 5–7 business days to reflect on your statement, depending on your bank.",
      },
      {
        heading: "Net banking refunds",
        body: "Bank transfer refunds are processed within 3–5 business days.",
      },
      {
        heading: "COD refunds",
        body: "For COD orders, refunds are sent to your registered bank account (NEFT). Please provide your account details via the refund form in 'My Orders'. This takes 5–7 business days.",
        link: { label: "Open My Orders →", href: "/account/orders" },
      },
    ],
    tips: [
      "Refund timelines start from the day the return is approved — not the day you raised the request.",
      "If 10 business days have passed and you still haven't received your refund, contact support with your order ID.",
    ],
    related: ["return-order", "payment-failed"],
  },
  {
    id: "payment-failed",
    title: "My payment failed but amount was deducted",
    description: "What to do if money was debited but your order wasn't confirmed.",
    section: "payments",
    steps: [
      {
        heading: "Don't panic — auto-reversal is common",
        body: "In most cases, if your order wasn't confirmed but money was deducted, the amount will be auto-reversed to your account within 2–3 business days by your bank.",
      },
      {
        heading: "Check your order status",
        body: "Go to 'My Orders'. If the order shows as 'Payment Failed' or doesn't appear at all, the payment didn't go through on our end.",
      },
      {
        heading: "Wait 48 hours",
        body: "Banks process auto-reversals within 48 hours. Check your bank statement or UPI app for a credit.",
      },
      {
        heading: "Still not resolved? Contact us",
        body: "If the amount hasn't been returned after 3 business days, contact our support team with your transaction reference number (UTR/RRN for UPI, or bank statement screenshot).",
        button: { label: "Contact Support", href: "/account" },
      },
    ],
    tips: [
      "Never retry a payment immediately after a failure without checking your bank balance first — you may get double-charged.",
      "Keep your payment app notifications on to track deductions in real time.",
    ],
    related: ["payment-methods", "refund-timeline"],
  },

  // ── Account ──────────────────────────────────────────────────────────────────
  {
    id: "reset-password",
    title: "How do I reset my password?",
    description: "Simple steps to recover access to your Vridhira account.",
    section: "account",
    steps: [
      {
        heading: "Go to the login page",
        body: `Click the account icon in the top navigation and select 'Log In'. On the login page, click the 'Forgot Password?' link below the password field.`,
        link: { label: "Go to login →", href: "/account" },
      },
      {
        heading: "Enter your email",
        body: "Enter the email address associated with your Vridhira account and click 'Send Reset Link'.",
      },
      {
        heading: "Check your inbox",
        body: "You'll receive a password reset email within a few minutes. Check your spam folder if you don't see it.",
      },
      {
        heading: "Set a new password",
        body: "Click the link in the email and enter your new password. Use a strong password — at least 8 characters with a mix of letters, numbers, and symbols.",
      },
    ],
    tips: [
      "The reset link is valid for 30 minutes. Request a new one if it expires.",
      "If you signed up with Google, you don't have a Vridhira password — log in with 'Continue with Google' instead.",
    ],
    related: ["update-profile", "delete-account"],
  },
  {
    id: "update-profile",
    title: "How do I update my profile?",
    description: "Edit your name, email, phone number and delivery addresses.",
    section: "account",
    steps: [
      {
        heading: "Open Account Settings",
        body: "Click on your profile icon (top right), then select 'Account' or visit /account.",
        button: { label: "Open Account Settings", href: "/account" },
      },
      {
        heading: "Edit personal details",
        body: "Click 'Edit Profile' to update your name, display name, and profile picture.",
      },
      {
        heading: "Update phone number",
        body: "In the 'Contact' section, enter your new phone number. You'll receive an OTP to verify the change.",
      },
      {
        heading: "Manage addresses",
        body: "Click 'Addresses' to add, edit, or delete saved delivery addresses. You can mark one as default.",
      },
    ],
    tips: [
      "Changing your email address requires a verification link sent to the new email.",
      "Keep your phone number up to date — it's used for OTP verification and delivery SMS.",
    ],
    related: ["reset-password"],
  },
  {
    id: "delete-account",
    title: "How do I delete my account?",
    description: "Permanent account deletion and what happens to your past orders.",
    section: "account",
    steps: [
      {
        heading: "Make sure all orders are completed",
        body: "Account deletion isn't possible if you have active or pending orders. Wait for all orders to be delivered or cancelled first.",
      },
      {
        heading: "Go to Account Settings",
        body: "Visit /account and scroll to the bottom of the 'Profile' section. Click 'Delete My Account'.",
        link: { label: "Open Account Settings →", href: "/account" },
      },
      {
        heading: "Confirm deletion",
        body: "You'll be asked to enter your password and confirm your decision. This action is irreversible.",
      },
      {
        heading: "What gets deleted",
        body: "Your profile, saved addresses, and wishlist are permanently deleted. Order history is retained for 3 years as required by Indian accounting regulations.",
      },
    ],
    tips: [
      "Download your order history before deleting — go to Account → Orders → Export.",
      "If you just want a break, you can deactivate (hide) your account instead of deleting it.",
    ],
    related: ["reset-password", "update-profile"],
  },

  // ── Trust & Safety ────────────────────────────────────────────────────────────
  {
    id: "data-privacy",
    title: "How is my personal data protected?",
    description: "An overview of our data privacy practices and how we safeguard your information.",
    section: "trust",
    steps: [
      {
        heading: "Data we collect",
        body: "We collect only what's necessary — name, email, phone, delivery address, and payment method (no card numbers are stored). Browsing data may be collected for personalization.",
      },
      {
        heading: "How we store it",
        body: "All data is encrypted in transit (TLS 1.3) and at rest (AES-256). Our servers are hosted in India, compliant with the Digital Personal Data Protection Act 2023.",
      },
      {
        heading: "Who we share it with",
        body: "Your data is shared only with trusted service partners (courier companies for delivery, Razorpay for payments) who are bound by data processing agreements.",
      },
      {
        heading: "Your rights",
        body: "Under DPDP Act 2023, you have the right to access, correct, and delete your personal data. Use the 'Data Requests' section in Account Settings to exercise these rights.",
        link: { label: "Read our Privacy Policy →", href: "/privacy-policy" },
      },
    ],
    tips: [
      "We will NEVER sell your personal data to third parties.",
      "Review our full Privacy Policy at /privacy-policy for complete details.",
    ],
    related: ["delete-account", "report-issue"],
  },
  {
    id: "report-issue",
    title: "How do I report a seller or product issue?",
    description: "Steps to report counterfeit or misleading products on the platform.",
    section: "trust",
    steps: [
      {
        heading: "Report from the product page",
        body: `On any product listing, scroll to the bottom and click 'Report this listing'. Choose the issue type — misleading description, counterfeit, inappropriate content, or other.`,
      },
      {
        heading: "Report from your order",
        body: "If you received a product that doesn't match its listing, go to 'My Orders' → select the order → click 'Report a Problem'.",
      },
      {
        heading: "Our review process",
        body: "Our trust & safety team reviews reports within 48 hours. Serious violations (counterfeits, fraud) are escalated immediately.",
      },
      {
        heading: "Outcome",
        body: "If the report is substantiated, the listing or seller account may be suspended. You'll receive an email update on the outcome.",
      },
    ],
    tips: [
      "Attach photos or screenshots to strengthen your report.",
      "False reporting to harm competitors is a violation of our Terms of Service.",
    ],
    related: ["data-privacy", "return-order"],
  },

  // ── Community ─────────────────────────────────────────────────────────────────
  {
    id: "artisan-community",
    title: "How do I join the artisan community?",
    description: "Connect with fellow artisans, join events, and share your craft.",
    section: "community",
    steps: [
      {
        heading: "Create a Vridhira account",
        body: "Community participation requires a Vridhira account. If you don't have one, sign up at /account/register.",
      },
      {
        heading: "Visit the Community section",
        body: "Navigate to the Community link in the footer or visit /community. You'll see discussions, artisan spotlights, and upcoming events.",
      },
      {
        heading: "Introduce yourself",
        body: `Post an introduction in the 'Welcome!' thread — tell us about your craft, region, and what inspired you.`,
      },
      {
        heading: "Join local artisan groups",
        body: "We have regional groups for artisans from different states — Rajasthan, West Bengal, Odisha, Gujarat, and more. Join the one closest to you.",
      },
    ],
    tips: [
      "Verified artisans (sellers on Vridhira) get a special badge in the community.",
      "Community events like virtual workshops and craft fairs are announced on the community homepage.",
    ],
    related: ["forum-guidelines"],
  },
  {
    id: "forum-guidelines",
    title: "What are the community forum guidelines?",
    description: "Rules and best practices for respectful, constructive community interaction.",
    section: "community",
    steps: [
      {
        heading: "Be respectful",
        body: "Treat all community members with kindness and respect — regardless of craft, region, language, or experience level. Personal attacks, harassment, and hate speech are not tolerated.",
      },
      {
        heading: "Stay on topic",
        body: "Keep discussions relevant to arts, crafts, buying, and the artisan community. Off-topic promotions and unrelated links will be removed.",
      },
      {
        heading: "No spam or self-promotion",
        body: "Do not post repeated promotional content about your shop or products. Artisans can share new products in the designated 'New Arrivals' thread only.",
      },
      {
        heading: "Report violations",
        body: "Use the 'Report Post' button next to any post that violates guidelines. Our moderation team reviews reports within 24 hours.",
      },
    ],
    tips: [
      "First-time violations result in a warning. Repeated violations lead to suspension from community features.",
      "Constructive criticism of products or practices is welcome — personal attacks are not.",
    ],
    related: ["artisan-community", "report-issue"],
  },
]

// ── Most Viewed (pinned article IDs) ─────────────────────────────────────────
const MOST_VIEWED_IDS = ["track-order", "refund-timeline", "payment-failed"]

export function getMostViewed(): FAQArticle[] {
  return MOST_VIEWED_IDS
    .map((id) => ARTICLES.find((a) => a.id === id))
    .filter((a): a is FAQArticle => Boolean(a))
}

// ── Search ────────────────────────────────────────────────────────────────────
/** Case-insensitive search across title, description, and section name. */
export function searchArticles(query: string): FAQArticle[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  return ARTICLES.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q) ||
      a.section.toLowerCase().includes(q)
  )
}

/** Returns all articles for a given section (empty string / "all" → empty, shown as overview). */
export function getBySection(section: string): FAQArticle[] {
  if (!section || section === "all") return []
  return ARTICLES.filter((a) => a.section === section)
}

/** Returns a single article by ID, or undefined if not found. */
export function getArticleById(id: string): FAQArticle | undefined {
  return ARTICLES.find((a) => a.id === id)
}

/** Returns the related articles for a given article. */
export function getRelated(article: FAQArticle): FAQArticle[] {
  if (!article.related?.length) return []
  return article.related
    .map((id) => ARTICLES.find((a) => a.id === id))
    .filter((a): a is FAQArticle => Boolean(a))
}

/** Returns the section label for a given section ID. */
export function getSectionLabel(sectionId: string): string {
  return SIDEBAR_SECTIONS.find((s) => s.id === sectionId)?.label ?? sectionId
}
