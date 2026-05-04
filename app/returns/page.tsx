import { ArrowRight, PackageCheck, RefreshCcw, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Returns & Exchanges | BOUT",
  description: "Return and exchange guidance for BOUT orders in Egypt.",
};

const POLICY_ITEMS = [
  {
    title: "Return window",
    copy: "Request a return or exchange within 14 days of delivery. Pieces must be unworn, unwashed, and returned with tags and original packaging.",
    icon: RefreshCcw,
  },
  {
    title: "Egypt delivery support",
    copy: "Our support flow is built around local delivery handoffs. Keep your order number ready so the team can verify the shipment quickly.",
    icon: Truck,
  },
  {
    title: "Condition check",
    copy: "Returned items are inspected before refund or exchange approval. Footwear must be returned with the box intact.",
    icon: ShieldCheck,
  },
  {
    title: "Exchange path",
    copy: "If the preferred size or color is available, exchanges are prioritized before refund handling.",
    icon: PackageCheck,
  },
];

export default function ReturnsPage() {
  return (
    <main className="liquid-page px-4 pb-16 pt-16 sm:px-6 sm:pb-24 sm:pt-24 md:px-10">
      <div className="page-wrap max-w-6xl">
        <section className="mb-8 sm:mb-12">
          <p className="eyebrow mb-4">Client Service</p>
          <h1 className="title-display" style={{ fontSize: "clamp(2.8rem, 7vw, 5.8rem)" }}>
            Returns <em className="gold-italic">& Exchanges</em>
          </h1>
          <div className="page-header-divider mt-6" />
          <p className="body-copy mt-6 max-w-2xl">
            Clear handling for fit issues, exchanges, and return requests after delivery.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {POLICY_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="glass-panel p-6 sm:p-7">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#A87935]/25 bg-[#A87935]/10 text-[#A87935]">
                  <Icon className="h-5 w-5" strokeWidth={1.35} />
                </div>
                <h2 className="font-serif text-3xl font-light text-[#FFF8EC]">{item.title}</h2>
                <p className="body-copy mt-4">{item.copy}</p>
              </article>
            );
          })}
        </section>

        <section className="mt-6 rounded-3xl border border-[#A87935]/22 bg-[#A87935]/[0.07] p-6 sm:mt-8 sm:p-8">
          <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="eyebrow mb-3 text-[#A87935]">Need support?</p>
              <h2 className="font-serif text-3xl font-light text-[#FFF8EC]">Start with your order number.</h2>
              <p className="body-copy mt-3">
                Open your order history, copy the order number, and contact the BOUT team through the active support channel.
              </p>
            </div>
            <Link href="/orders" className="btn-gold justify-center">
              View Orders
              <ArrowRight className="h-4 w-4" strokeWidth={1.3} />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
