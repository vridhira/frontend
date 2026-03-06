/**
 * ============================================================
 * VRIDHIRA — E-Commerce for Indian Artisans
 * ============================================================
 * @author      Himanshu
 * @github      https://github.com/Newbie-Himanshu
 * @repo        https://github.com/Newbie-Himanshu/vridhira-frontend
 * @copyright   2026 Himanshu — Vridhira. All rights reserved.
 * @license     MIT
 * ------------------------------------------------------------
 * @lastModifiedBy  Himanshu
 * @modifiedWith    GitHub Copilot
 * @modifiedOn      2026-03-06
 * @changeNote      Added Vridhira Google font imports (Plus Jakarta Sans, Playfair Display, Tiro Devanagari Hindi)
 * ============================================================
 */

import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import { Plus_Jakarta_Sans, Playfair_Display, Tiro_Devanagari_Hindi } from "next/font/google"
import "styles/globals.css"

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
})

const tiroDevanagariHindi = Tiro_Devanagari_Hindi({
  subsets: ["devanagari"],
  variable: "--font-hindi",
  weight: "400",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: "Vridhira — E-Commerce for Indian Artisans",
  description: "An open e-commerce platform built for India's artisans and handcraft sellers.",
  authors: [{ name: "Himanshu", url: "https://github.com/Newbie-Himanshu" }],
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-mode="light"
      className={`${plusJakartaSans.variable} ${playfairDisplay.variable} ${tiroDevanagariHindi.variable}`}
    >
      <body>
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
