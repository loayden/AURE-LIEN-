import { ArrowRight, PackageCheck, RotateCcw, ShieldCheck } from "lucide-react";
import Link from "next/link";

const STEPS = [
  {
    title: "Start with your order number",
    text: "Include the order number, item name, and the reason for the return or exchange request.",
    icon: PackageCheck,
  },
  {
    title: "Keep the item unworn",
    text: "Items should be returned in a condition suitable for review, with original packaging where available.",
    icon: ShieldCheck,
  },
  {
    title: "Client service confirms the next step",
    text: "The team will confirm whether exchange, return, or another resolution is available for the order.",
    icon: RotateCcw,
  },
];

export default function ReturnsPage() {
  return (
    <main className="liquid-page pb-28">
      <section className="px-4 pt-20 sm:px-6 sm:pt-28 md:px-10">
        <div className="page-wrap max-w-5xl">
          <p className="eyebrow mb-5">Customer Service</p>
          <h1 className="title-display text-[clamp(3rem,8vw,6rem)] leading-[0.9]">
            Returns & <em className="gold-italic">exchanges</em>
          </h1>
          <p className="hero-body-copy mt-6 max-w-2xl text-white/58">
            A clear service route for order issues, sizing changes, and item review requests.
          </p>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {STEPS.map(({ title, text, icon: Icon }) => (
              <section key={title} className="rounded-[28px] border border-white/10 bg-white/[0.035] p-5">
                <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brass/12 text-brass">
                  <Icon className="h-5 w-5" strokeWidth={1.4} />
                </span>
                <h2 className="font-serif text-2xl font-light text-white">{title}</h2>
                <p className="body-copy mt-4">{text}</p>
              </section>
            ))}
          </div>

          <section className="mt-8 rounded-[30px] border border-white/10 bg-[#14110F] p-6 sm:p-8">
            <p className="eyebrow mb-4">How to request help</p>
            <h2 className="font-serif text-3xl font-light text-white sm:text-4xl">
              Contact BOUT with your order details
            </h2>
            <p className="body-copy mt-4 max-w-2xl">
              Use the order number from your account page or confirmation message. The store team will review the request and confirm the available resolution before any item is returned.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/orders" className="btn-gold justify-center">
                View Orders
                <ArrowRight className="h-4 w-4" strokeWidth={1.4} />
              </Link>
              <Link href="/account" className="btn-ghost justify-center">
                Account
              </Link>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
