// src/pages/About.tsx
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Database, Gauge, Layers, Radio, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

const principles = [
  {
    icon: Radio,
    title: 'Straight from the chain',
    description:
      'We index directly from archive nodes — no third-party data vendors in the middle. What you see is what the chain recorded.',
  },
  {
    icon: Gauge,
    title: 'Speed is a feature',
    description:
      'Columnar payloads, server-side aggregation, and aggressive caching keep every chart interactive, even across years of history.',
  },
  {
    icon: ShieldCheck,
    title: 'Verifiable by design',
    description:
      'Every data point links back to blocks and transactions you can verify yourself. No black boxes, no unexplained numbers.',
  },
  {
    icon: Layers,
    title: 'One platform, whole stack',
    description:
      'Dashboards, alerts, portfolio tracking, and a developer API share the same real-time pipeline — build once, use everywhere.',
  },
];

const stack = [
  { label: 'Indexing', value: 'Erigon archive nodes + custom decoders' },
  { label: 'Storage', value: 'ClickHouse for timeseries, PostgreSQL for app data' },
  { label: 'Serving', value: 'Go API with Redis caching and WebSocket streams' },
  { label: 'Interface', value: 'React with real-time charting' },
];

const About = () => {
  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-40 h-[32rem] opacity-50"
        style={{
          background:
            'radial-gradient(36rem 18rem at 50% 0%, var(--color-primary-20), transparent 70%)',
        }}
      />

      {/* Hero */}
      <section className="relative max-w-3xl mx-auto px-6 pt-20 md:pt-28 pb-16 text-center">
        <motion.span
          {...fadeUp}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-text-secondary"
        >
          <Sparkles className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
          About CryptoWebb
        </motion.span>

        <motion.h1
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="mt-6 text-3xl md:text-5xl font-bold tracking-tight leading-[1.15]"
        >
          Making on-chain data{' '}
          <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            actually usable
          </span>
        </motion.h1>

        <motion.p
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mt-6 text-base md:text-lg text-text-secondary leading-relaxed"
        >
          Blockchains publish everything and explain nothing. CryptoWebb exists to close that gap —
          turning raw blocks, swaps, and transfers into dashboards, alerts, and APIs that traders,
          funds, and builders can act on in real time.
        </motion.p>
      </section>

      {/* Principles */}
      <section className="relative max-w-6xl mx-auto px-6 pb-16">
        <div className="grid sm:grid-cols-2 gap-5">
          {principles.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.35, delay: (index % 2) * 0.06 }}
              className="rounded-xl border border-border bg-surface p-6 transition-colors hover:border-primary/30"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <item.icon className="w-5 h-5 text-primary" aria-hidden="true" />
              </div>
              <h2 className="mt-4 text-base font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm text-text-secondary leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stack */}
      <section className="relative border-y border-border bg-surface/50">
        <div className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-[1fr_1.5fr] gap-10 items-start">
          <div>
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Database className="w-5 h-5 text-primary" aria-hidden="true" />
            </div>
            <h2 className="mt-4 text-2xl font-bold tracking-tight">How it&apos;s built</h2>
            <p className="mt-3 text-text-secondary leading-relaxed">
              The same pipeline powers everything — from the public dashboards to the developer API.
            </p>
          </div>
          <dl className="divide-y divide-border rounded-xl border border-border bg-surface overflow-hidden">
            {stack.map((row) => (
              <div key={row.label} className="grid sm:grid-cols-[8rem_1fr] gap-1 px-5 py-4">
                <dt className="text-sm font-medium text-text-secondary">{row.label}</dt>
                <dd className="text-sm">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* CTA */}
      <section className="relative max-w-3xl mx-auto px-6 py-20 text-center">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">See it for yourself</h2>
        <p className="mt-3 text-text-secondary">
          Explore live dashboards on the free trial, or talk to us about what you&apos;re building.
        </p>
        <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/trial">
            <Button variant="primary" size="lg">
              Start free trial
              <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="ghost" size="lg">
              Contact us
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
