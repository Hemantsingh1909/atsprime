"use client";

import { useState } from "react";
import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/footer/Footer";
import { Mail, Clock, Send, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setName("");
      setEmail("");
      setMessage("");
    }, 1000);
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-zinc-950 text-white pt-32 pb-20 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl bg-gradient-to-r from-violet to-highlight-pink bg-clip-text text-transparent">
                Get in Touch
              </h1>
              <p className="mt-4 text-zinc-400">
                Have questions about our AI resume optimization features or pricing? Our team is ready to help you optimize your career path.
              </p>

              <div className="mt-12 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet/10">
                    <Mail className="h-5 w-5 text-violet" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-400">Support Email</p>
                    <p className="text-white">support@atsprime.co</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet/10">
                    <Clock className="h-5 w-5 text-violet" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-400">Average Response Time</p>
                    <p className="text-white">Under 24 hours</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-hairline bg-zinc-900/40 p-8 backdrop-blur-sm">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckCircle2 className="h-12 w-12 text-emerald-400" />
                  <h3 className="mt-4 text-lg font-semibold text-white">Message Sent!</h3>
                  <p className="mt-2 text-sm text-zinc-400">
                    Thank you for reaching out. We will get back to you shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 rounded-md bg-zinc-800 px-4 py-2 text-xs font-bold text-white hover:bg-zinc-700 transition-colors"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400">Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-2 w-full rounded-md border border-hairline bg-canvas px-4 py-2.5 text-sm text-white focus:border-zinc-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-400">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-2 w-full rounded-md border border-hairline bg-canvas px-4 py-2.5 text-sm text-white focus:border-zinc-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-400">Message</label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="mt-2 w-full rounded-md border border-hairline bg-canvas px-4 py-2.5 text-sm text-white focus:border-zinc-500 focus:outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-primary hover:opacity-90 py-2.5 font-medium text-on-primary shadow-md transition-all duration-200"
                  >
                    {loading ? "Sending..." : (
                      <>
                        Send Message
                        <Send size={16} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
