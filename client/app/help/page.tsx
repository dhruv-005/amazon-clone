"use client";

import React from "react";

export default function HelpPage() {
  const faqs = [
    { q: "Where's my order?", a: "Track your packages in Your Account > Track Package." },
    { q: "Shipping rates & delivery times", a: "View standard and express delivery options at checkout." },
    { q: "Returns & replacements", a: "Return eligible items within 30 days of receipt." },
    { q: "Payment settings & security", a: "Manage your credit cards, billing addresses, and 2FA." }
  ];

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 20px", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "8px" }}>
        Hello. What can we help you with today?
      </h1>
      <p style={{ color: "#666", marginBottom: "32px" }}>
        Search help topics, FAQs, and customer support.
      </p>

      {/* FAQ Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            style={{
              padding: "20px",
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              backgroundColor: "#fafafa"
            }}
          >
            <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "8px" }}>{faq.q}</h3>
            <p style={{ fontSize: "14px", color: "#555", lineHeight: "1.5" }}>{faq.a}</p>
          </div>
        ))}
      </div>

      {/* Contact Section */}
      <div style={{ marginTop: "40px", padding: "24px", background: "#f0f4f8", borderRadius: "8px", textAlign: "center" }}>
        <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>Need more help?</h2>
        <p style={{ fontSize: "14px", color: "#555", marginBottom: "16px" }}>Our customer support team is available 24/7.</p>
        <button
          style={{
            padding: "10px 24px",
            backgroundColor: "#ff9900",
            border: "none",
            borderRadius: "6px",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Contact Us
        </button>
      </div>
    </div>
  );
}
