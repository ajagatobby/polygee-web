"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Check,
  Brain,
  TrendingUp,
  BarChart3,
  Zap,
  Shield,
  Headphones,
  ArrowRight,
  Sparkles,
  Crown,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { easing, duration } from "@/lib/animations";

const MONTHLY_PRICE = 99;
const YEARLY_DISCOUNT = 0.3;
const YEARLY_MONTHLY = Math.round(MONTHLY_PRICE * (1 - YEARLY_DISCOUNT) * 100) / 100; // $69.30
const YEARLY_TOTAL = Math.round(YEARLY_MONTHLY * 12 * 100) / 100; // $831.60

const features = [
  {
    icon: Brain,
    title: "AI Match Predictions",
    description:
      "Real-time predictions powered by machine learning models trained on 10+ years of match data",
  },
  {
    icon: TrendingUp,
    title: "Polymarket Trading",
    description:
      "Automated trade execution on prediction markets with intelligent position sizing",
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description:
      "Track accuracy, P&L, win rate, and ROI with detailed historical breakdowns",
  },
  {
    icon: Zap,
    title: "Live Market Signals",
    description:
      "Instant alerts when odds shift, new markets open, or high-confidence picks emerge",
  },
  {
    icon: Shield,
    title: "Risk Management",
    description:
      "Budget controls, stop-loss settings, and position limits to protect your capital",
  },
  {
    icon: Headphones,
    title: "Priority Support",
    description:
      "Direct access to our team with fast response times and personalized guidance",
  },
];

const planFeatures = [
  "Unlimited AI predictions across all leagues",
  "Polymarket integration & auto-trading",
  "Real-time odds monitoring & alerts",
  "Full performance dashboard & analytics",
  "Risk management & budget controls",
  "Priority email & chat support",
  "Early access to new features",
  "Custom league & team watchlists",
];

const faqs = [
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel anytime from your account settings. No questions asked, no hidden fees.",
  },
  {
    q: "Do I need a Polymarket account?",
    a: "Yes. Polygee connects to your Polymarket account to execute trades. You'll need API credentials from Polymarket.",
  },
  {
    q: "What leagues are covered?",
    a: "We cover 15+ leagues including Premier League, La Liga, Bundesliga, Serie A, Ligue 1, Champions League, MLS, and more.",
  },
  {
    q: "How accurate are the predictions?",
    a: "Our models achieve 68-74% accuracy across major leagues, with higher confidence picks reaching 80%+.",
  },
];

export default function PricingPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        {/* Hero */}
        <section className="pt-16 pb-12 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: duration.slow, ease: easing.easeOut }}
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1552f0]/8 mb-5">
                <Sparkles className="w-3.5 h-3.5 text-[#1552f0]" />
                <span className="text-[12px] font-semibold text-[#1552f0]">
                  Simple, transparent pricing
                </span>
              </div>
              <h1 className="text-[40px] font-bold text-[#1a1a2e] tracking-[-0.03em] leading-[1.15]">
                One plan. Everything included.
              </h1>
              <p className="text-[16px] text-[#808080] mt-4 max-w-[480px] mx-auto leading-relaxed">
                No tiers, no feature gates. Get full access to AI predictions,
                automated trading, and analytics.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Two pricing cards */}
        <section className="px-6 pb-16">
          <div className="max-w-[820px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
            {/* Monthly card */}
            <motion.div
              className="relative bg-white border border-[#e8e8e8] rounded-[20px] overflow-hidden"
              initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                duration: duration.slow,
                ease: easing.easeOut,
                delay: 0.1,
              }}
            >
              <div className="p-7">
                {/* Plan name */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-[17px] font-bold text-[#1a1a2e]">
                      Monthly
                    </h2>
                    <p className="text-[13px] text-[#808080] mt-0.5">
                      Pay as you go
                    </p>
                  </div>
                  <div className="flex items-center justify-center w-[38px] h-[38px] rounded-[10px] bg-[#f5f5f5]">
                    <Zap className="w-[18px] h-[18px] text-[#808080]" />
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-[44px] font-bold text-[#1a1a2e] tracking-[-0.03em] leading-none">
                    ${MONTHLY_PRICE}
                  </span>
                  <span className="text-[15px] text-[#999] font-medium">
                    /month
                  </span>
                </div>
                <p className="text-[13px] text-[#808080]">
                  Billed monthly
                </p>

                {/* CTA */}
                <Link
                  href="/sign-up"
                  className="flex items-center justify-center gap-2 w-full h-[46px] mt-6 text-[14px] font-bold text-[#1a1a2e] bg-[#f5f5f5] rounded-[12px] hover:bg-[#ebebeb] transition-colors cursor-pointer group"
                >
                  Get started
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Link>

                <p className="text-center text-[12px] text-[#bbb] mt-3">
                  Cancel anytime
                </p>

                {/* Divider */}
                <div className="h-px bg-[#f0f0f0] my-6" />

                {/* Features list */}
                <p className="text-[12px] font-semibold text-[#999] uppercase tracking-[0.05em] mb-4">
                  Everything included
                </p>
                <ul className="space-y-3">
                  {planFeatures.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <div className="flex items-center justify-center w-[18px] h-[18px] rounded-full bg-[#f5f5f5] shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-[#808080]" />
                      </div>
                      <span className="text-[13px] text-[#666] leading-snug">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Yearly card — recommended */}
            <motion.div
              className="relative bg-white border-2 border-[#1552f0] rounded-[20px] overflow-hidden shadow-[0_4px_24px_rgba(21,82,240,0.10)]"
              initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                duration: duration.slow,
                ease: easing.easeOut,
                delay: 0.18,
              }}
            >
              {/* Recommended badge */}
              <div className="flex items-center justify-center gap-1.5 bg-[#1552f0] py-2">
                <Crown className="w-3.5 h-3.5 text-white" />
                <span className="text-[11px] font-bold text-white uppercase tracking-[0.06em]">
                  Most Popular
                </span>
              </div>

              <div className="p-7">
                {/* Plan name */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-[17px] font-bold text-[#1a1a2e]">
                      Yearly
                    </h2>
                    <p className="text-[13px] text-[#808080] mt-0.5">
                      Best value
                    </p>
                  </div>
                  <div className="flex items-center justify-center w-[38px] h-[38px] rounded-[10px] bg-[#1552f0]/8">
                    <Zap className="w-[18px] h-[18px] text-[#1552f0]" />
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-[44px] font-bold text-[#1a1a2e] tracking-[-0.03em] leading-none">
                    ${YEARLY_MONTHLY % 1 === 0 ? YEARLY_MONTHLY : YEARLY_MONTHLY.toFixed(2)}
                  </span>
                  <span className="text-[15px] text-[#999] font-medium">
                    /month
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-[13px] text-[#808080]">
                    ${YEARLY_TOTAL.toFixed(2)} billed annually
                  </p>
                  <span className="text-[11px] font-bold text-[#00c853] bg-[#00c853]/10 px-2 py-0.5 rounded-full">
                    Save 30%
                  </span>
                </div>

                {/* CTA */}
                <Link
                  href="/sign-up"
                  className="flex items-center justify-center gap-2 w-full h-[46px] mt-6 text-[14px] font-bold text-white bg-[#1552f0] rounded-[12px] hover:bg-[#1247d6] transition-colors cursor-pointer group"
                >
                  Get started
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Link>

                <p className="text-center text-[12px] text-[#bbb] mt-3">
                  Cancel anytime
                </p>

                {/* Divider */}
                <div className="h-px bg-[#f0f0f0] my-6" />

                {/* Features list */}
                <p className="text-[12px] font-semibold text-[#999] uppercase tracking-[0.05em] mb-4">
                  Everything included
                </p>
                <ul className="space-y-3">
                  {planFeatures.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <div className="flex items-center justify-center w-[18px] h-[18px] rounded-full bg-[#1552f0]/10 shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-[#1552f0]" />
                      </div>
                      <span className="text-[13px] text-[#444] leading-snug">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features grid */}
        <section className="px-6 py-16 bg-[#fafafa] border-t border-[#f0f0f0]">
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: duration.slow, ease: easing.easeOut }}
            >
              <h2 className="text-[28px] font-bold text-[#1a1a2e] tracking-[-0.02em]">
                Everything you need to trade smarter
              </h2>
              <p className="text-[15px] text-[#808080] mt-2">
                Built for serious prediction market traders
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    className="p-5 bg-white border border-[#f0f0f0] rounded-[14px]"
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{
                      duration: duration.medium,
                      ease: easing.easeOut,
                      delay: i * 0.06,
                    }}
                  >
                    <div className="flex items-center justify-center w-[36px] h-[36px] rounded-[10px] bg-[#1552f0]/8 mb-3.5">
                      <Icon className="w-[18px] h-[18px] text-[#1552f0]" />
                    </div>
                    <h3 className="text-[14px] font-bold text-[#1a1a2e] mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-[13px] text-[#808080] leading-relaxed">
                      {feature.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-6 py-16">
          <div className="max-w-2xl mx-auto">
            <motion.div
              className="text-center mb-10"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: duration.slow, ease: easing.easeOut }}
            >
              <h2 className="text-[28px] font-bold text-[#1a1a2e] tracking-[-0.02em]">
                Frequently asked questions
              </h2>
            </motion.div>

            <div className="space-y-2">
              {faqs.map((faq, i) => {
                const isOpen = expandedFaq === i;
                return (
                  <motion.div
                    key={i}
                    className="border border-[#f0f0f0] rounded-[12px] overflow-hidden bg-white"
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-20px" }}
                    transition={{
                      duration: duration.medium,
                      ease: easing.easeOut,
                      delay: i * 0.04,
                    }}
                  >
                    <button
                      onClick={() =>
                        setExpandedFaq(isOpen ? null : i)
                      }
                      className="flex items-center justify-between w-full px-5 py-4 text-left cursor-pointer"
                    >
                      <span className="text-[14px] font-semibold text-[#1a1a2e] pr-4">
                        {faq.q}
                      </span>
                      <motion.div
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{
                          duration: duration.fast,
                          ease: easing.easeOut,
                        }}
                        className="shrink-0 w-[22px] h-[22px] rounded-full bg-[#f5f5f5] flex items-center justify-center"
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                        >
                          <path
                            d="M6 2.5v7M2.5 6h7"
                            stroke="#808080"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{
                            height: 0,
                            opacity: 0,
                          }}
                          animate={{
                            height: "auto",
                            opacity: 1,
                          }}
                          exit={{
                            height: 0,
                            opacity: 0,
                          }}
                          transition={{
                            height: {
                              duration: duration.normal,
                              ease: easing.easeOut,
                            },
                            opacity: {
                              duration: duration.fast,
                              ease: easing.easeOut,
                            },
                          }}
                          className="overflow-hidden"
                        >
                          <p className="px-5 pb-4 text-[13px] text-[#666] leading-relaxed">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="px-6 py-16 bg-[#1552f0]">
          <motion.div
            className="max-w-2xl mx-auto text-center"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: duration.slow, ease: easing.easeOut }}
          >
            <h2 className="text-[28px] font-bold text-white tracking-[-0.02em]">
              Ready to trade smarter?
            </h2>
            <p className="text-[15px] text-white/60 mt-2 max-w-[400px] mx-auto">
              Join thousands of traders using AI-powered predictions on
              Polymarket.
            </p>
            <div className="flex items-center justify-center gap-3 mt-8">
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 h-[44px] px-6 text-[14px] font-bold text-[#1552f0] bg-white rounded-[10px] hover:bg-white/90 transition-colors cursor-pointer group"
              >
                Get started
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
