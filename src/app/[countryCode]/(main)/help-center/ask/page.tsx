import { Metadata } from "next"
import AskTemplate from "@modules/help-center/templates/ask"

export const metadata: Metadata = {
  title: "Ask a Question | Vridhira Help Center",
  description:
    "Couldn't find your answer? Submit your question and our support team will reply personally, usually within 1–2 business days.",
}

export default function AskPage() {
  return <AskTemplate />
}
