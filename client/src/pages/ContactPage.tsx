import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Phone,
  MessageSquare,
  CheckCircle,
  MapPin,
  Clock,
} from "lucide-react";
import PublicLayout, { JOHN_HEADSHOT, JACOB_HEADSHOT } from "@/components/PublicLayout";

export default function ContactPage() {
  const [contactForm, setContactForm] = useState({
    name: "",
    businessName: "",
    phone: "",
    email: "",
    message: "",
    preferredContact: "phone" as "phone" | "email" | "text",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const contactMutation = trpc.contact.submit.useMutation({
    onSuccess: () => {
      setFormSubmitted(true);
      toast.success("Message sent! We'll be in touch soon.");
    },
    onError: () => {
      toast.error("Something went wrong. Please call us directly.");
    },
  });

  useEffect(() => {
    document.title = "Contact Us | J&J Management Solutions";
    return () => { document.title = "J&J Management Solutions CRM"; };
  }, []);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name.trim() || !contactForm.message.trim()) {
      toast.error("Please fill in your name and message.");
      return;
    }
    contactMutation.mutate({
      name: contactForm.name,
      businessName: contactForm.businessName || undefined,
      phone: contactForm.phone || undefined,
      email: contactForm.email || undefined,
      message: contactForm.message,
      preferredContact: contactForm.preferredContact,
    });
  };

  return (
    <PublicLayout>
      {/* Page Header */}
      <section
        className="pt-12 pb-16 sm:pt-20 sm:pb-20 px-4"
        style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)" }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
            style={{ background: "rgba(59,130,246,0.15)", color: "#93c5fd", border: "1px solid rgba(59,130,246,0.2)" }}
          >
            <MessageSquare className="h-3 w-3" />
            Get In Touch
          </div>
          <h1
            className="text-3xl sm:text-5xl font-extrabold tracking-tight"
            style={{ color: "#f8fafc" }}
          >
            Ready to Get Started?
          </h1>
          <p className="mt-4 text-lg max-w-2xl mx-auto" style={{ color: "#94a3b8" }}>
            Give us a call, shoot us a text, or fill out the form below. We'll get back to you
            within 24 hours — usually much sooner.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20 sm:py-28 px-4" style={{ background: "#ffffff" }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
            {/* Left: Contact info */}
            <div>
              <h2 className="text-2xl font-bold mb-6" style={{ color: "#0f172a" }}>
                Talk to Us Directly
              </h2>
              <p className="text-sm leading-relaxed mb-8" style={{ color: "#64748b" }}>
                We're real people, not a call center. Pick up the phone and give us a call — or
                send us a text. We'll respond quickly.
              </p>

              <div className="space-y-5">
                {/* John */}
                <div
                  className="flex items-center gap-4 p-5 rounded-xl transition-all hover:shadow-md"
                  style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
                >
                  <img
                    src={JOHN_HEADSHOT}
                    alt="John"
                    className="w-14 h-14 rounded-full object-cover"
                    style={{ border: "3px solid #e2e8f0" }}
                  />
                  <div>
                    <p className="font-bold text-base" style={{ color: "#0f172a" }}>
                      John Conner
                    </p>
                    <p className="text-xs" style={{ color: "#64748b" }}>Co-Founder</p>
                    <a
                      href="tel:+14053123681"
                      className="text-sm font-semibold mt-1 inline-flex items-center gap-1"
                      style={{ color: "#1e40af" }}
                    >
                      <Phone className="h-3.5 w-3.5" />
                      (405) 312-3681
                    </a>
                  </div>
                </div>

                {/* Jacob */}
                <div
                  className="flex items-center gap-4 p-5 rounded-xl transition-all hover:shadow-md"
                  style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
                >
                  <img
                    src={JACOB_HEADSHOT}
                    alt="Jacob"
                    className="w-14 h-14 rounded-full object-cover"
                    style={{ border: "3px solid #e2e8f0" }}
                  />
                  <div>
                    <p className="font-bold text-base" style={{ color: "#0f172a" }}>
                      Jacob Foreman
                    </p>
                    <p className="text-xs" style={{ color: "#64748b" }}>Co-Founder</p>
                    <a
                      href="tel:+14056530112"
                      className="text-sm font-semibold mt-1 inline-flex items-center gap-1"
                      style={{ color: "#1e40af" }}
                    >
                      <Phone className="h-3.5 w-3.5" />
                      (405) 653-0112
                    </a>
                  </div>
                </div>
              </div>

              {/* Info cards */}
              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3 p-4 rounded-xl" style={{ background: "#eff6ff", border: "1px solid #bfdbfe" }}>
                  <MapPin className="h-5 w-5 shrink-0 mt-0.5" style={{ color: "#1e40af" }} />
                  <div>
                    <p className="font-semibold text-sm" style={{ color: "#0f172a" }}>
                      Serving the OKC Metro Area
                    </p>
                    <p className="text-xs mt-1" style={{ color: "#64748b" }}>
                      Oklahoma City, Edmond, Norman, Moore, Yukon, Mustang, Midwest City, Del City,
                      Bethany, Warr Acres, and surrounding communities.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                  <Clock className="h-5 w-5 shrink-0 mt-0.5" style={{ color: "#16a34a" }} />
                  <div>
                    <p className="font-semibold text-sm" style={{ color: "#0f172a" }}>
                      Response Time
                    </p>
                    <p className="text-xs mt-1" style={{ color: "#64748b" }}>
                      We typically respond within a few hours. If it's urgent, just call — we pick up.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Contact form */}
            <div>
              {formSubmitted ? (
                <div
                  className="rounded-2xl p-10 text-center"
                  style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}
                >
                  <CheckCircle className="h-14 w-14 mx-auto mb-4" style={{ color: "#16a34a" }} />
                  <h3 className="text-2xl font-bold" style={{ color: "#0f172a" }}>
                    Message Sent!
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: "#64748b" }}>
                    Thanks for reaching out. We'll get back to you within 24 hours. If you need
                    immediate help, give us a call at{" "}
                    <a href="tel:+14053123681" className="font-semibold" style={{ color: "#1e40af" }}>
                      (405) 312-3681
                    </a>
                    .
                  </p>
                  <button
                    onClick={() => {
                      setFormSubmitted(false);
                      setContactForm({
                        name: "",
                        businessName: "",
                        phone: "",
                        email: "",
                        message: "",
                        preferredContact: "phone",
                      });
                    }}
                    className="mt-5 text-sm font-semibold px-4 py-2 rounded-lg"
                    style={{ color: "#1e40af", background: "rgba(30,64,175,0.06)" }}
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleContactSubmit}
                  className="rounded-2xl p-8"
                  style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
                >
                  <h3 className="text-xl font-bold mb-6" style={{ color: "#0f172a" }}>
                    Send Us a Message
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>
                        Your Name *
                      </label>
                      <input
                        type="text"
                        value={contactForm.name}
                        onChange={(e) => setContactForm((f) => ({ ...f, name: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all focus:ring-2 focus:ring-blue-200"
                        style={{
                          background: "#ffffff",
                          border: "1px solid #d1d5db",
                          color: "#0f172a",
                        }}
                        placeholder="John Smith"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>
                        Business Name
                      </label>
                      <input
                        type="text"
                        value={contactForm.businessName}
                        onChange={(e) => setContactForm((f) => ({ ...f, businessName: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all focus:ring-2 focus:ring-blue-200"
                        style={{
                          background: "#ffffff",
                          border: "1px solid #d1d5db",
                          color: "#0f172a",
                        }}
                        placeholder="Smith's Plumbing"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={contactForm.phone}
                          onChange={(e) => setContactForm((f) => ({ ...f, phone: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all focus:ring-2 focus:ring-blue-200"
                          style={{
                            background: "#ffffff",
                            border: "1px solid #d1d5db",
                            color: "#0f172a",
                          }}
                          placeholder="(405) 555-1234"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>
                          Email
                        </label>
                        <input
                          type="email"
                          value={contactForm.email}
                          onChange={(e) => setContactForm((f) => ({ ...f, email: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all focus:ring-2 focus:ring-blue-200"
                          style={{
                            background: "#ffffff",
                            border: "1px solid #d1d5db",
                            color: "#0f172a",
                          }}
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>
                        How should we contact you?
                      </label>
                      <div className="flex gap-3">
                        {(["phone", "email", "text"] as const).map((method) => (
                          <button
                            key={method}
                            type="button"
                            onClick={() => setContactForm((f) => ({ ...f, preferredContact: method }))}
                            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                            style={{
                              background: contactForm.preferredContact === method ? "#1e40af" : "#ffffff",
                              color: contactForm.preferredContact === method ? "#ffffff" : "#475569",
                              border: contactForm.preferredContact === method ? "1px solid #1e40af" : "1px solid #d1d5db",
                            }}
                          >
                            {method.charAt(0).toUpperCase() + method.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>
                        Tell us about your business *
                      </label>
                      <textarea
                        value={contactForm.message}
                        onChange={(e) => setContactForm((f) => ({ ...f, message: e.target.value }))}
                        rows={5}
                        className="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all resize-none focus:ring-2 focus:ring-blue-200"
                        style={{
                          background: "#ffffff",
                          border: "1px solid #d1d5db",
                          color: "#0f172a",
                        }}
                        placeholder="What kind of business do you run? What are you looking for in a website?"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={contactMutation.isPending}
                      className="w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg disabled:opacity-60"
                      style={{ background: "linear-gradient(135deg, #1e40af, #3b82f6)" }}
                    >
                      {contactMutation.isPending ? "Sending..." : "Send Message"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
