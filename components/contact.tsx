"use client"

import type React from "react"

import { useState } from "react"

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Form submitted:", formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <section id="contact" className="py-24 px-6 border-t border-border">
      <div className="max-w-2xl mx-auto">
        <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-12 text-center">Get in Touch</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm text-muted-foreground mb-2 uppercase tracking-wide">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-card border border-border px-4 py-3 text-foreground focus:outline-none focus:border-foreground transition-colors"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm text-muted-foreground mb-2 uppercase tracking-wide">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-card border border-border px-4 py-3 text-foreground focus:outline-none focus:border-foreground transition-colors"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm text-muted-foreground mb-2 uppercase tracking-wide">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={6}
              className="w-full bg-card border border-border px-4 py-3 text-foreground focus:outline-none focus:border-foreground transition-colors resize-none"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-foreground text-background py-3 hover:bg-foreground/90 transition-colors uppercase tracking-wide text-sm"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  )
}
