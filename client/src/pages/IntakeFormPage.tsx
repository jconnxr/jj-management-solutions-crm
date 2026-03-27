import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Link } from "wouter";
import { CheckCircle, ArrowRight, Building2, User, Phone, Mail, Globe, MapPin, AlertCircle } from "lucide-react";

const PRESENCE_OPTIONS = [
  { value: "no_website", label: "I don't have a website" },
  { value: "outdated_website", label: "My website is outdated" },
  { value: "no_google", label: "I'm not on Google" },
  { value: "few_reviews", label: "I have few or no reviews" },
  { value: "no_social", label: "No social media presence" },
  { value: "other", label: "Other" },
] as const;

const URGENCY_OPTIONS = [
  { value: "asap", label: "ASAP — I need help now" },
  { value: "this_month", label: "This month" },
  { value: "next_few_months", label: "In the next few months" },
  { value: "just_exploring", label: "Just exploring options" },
] as const;

const BUDGET_OPTIONS = [
  "Under $500",
  "$500 – $1,000",
  "$1,000 – $2,500",
  "$2,500 – $5,000",
  "$5,000+",
  "Not sure yet",
];

const INDUSTRY_OPTIONS = [
  "Plumbing",
  "HVAC",
  "Electrical",
  "Roofing",
  "Landscaping",
  "Auto Detailing",
  "Concrete / Masonry",
  "Painting",
  "Cleaning Services",
  "Construction",
  "Restaurant / Food",
  "Retail",
  "Salon / Barber",
  "Fitness / Gym",
  "Real Estate",
  "Other",
];

export default function IntakeFormPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    ownerName: "",
    businessName: "",
    industry: "",
    phone: "",
    email: "",
    website: "",
    city: "",
    state: "OK",
    biggestChallenge: "",
    currentOnlinePresence: "" as string,
    monthlyBudget: "",
    urgency: "" as string,
    howHeard: "",
  });

  const submitMutation = trpc.intakeSubmissions.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong. Please try again.");
    },
  });

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!form.ownerName || !form.businessName || !form.biggestChallenge) {
      toast.error("Please fill in all required fields.");
      return;
    }
    submitMutation.mutate({
      ...form,
      email: form.email || undefined,
      currentOnlinePresence: (form.currentOnlinePresence || undefined) as any,
      urgency: (form.urgency || undefined) as any,
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-lg w-full text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-emerald-600" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
              Thank You!
            </h1>
            <p className="text-slate-600 mb-6 leading-relaxed">
              We've received your information and our team will review it shortly.
              One of our co-founders — John or Jacob — will personally reach out
              to discuss how we can help your business grow online.
            </p>
            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-blue-800 font-medium">
                Expect a call or text within 24 hours
              </p>
              <p className="text-xs text-blue-600 mt-1">
                We'll review your submission and come prepared with ideas tailored to your business.
              </p>
            </div>
            <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
              Visit our website <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-4 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">J&J</span>
            </div>
            <span className="font-semibold text-slate-900 text-sm">J&J Management Solutions</span>
          </Link>
          <span className="text-xs text-slate-500">Step {step} of 3</span>
        </div>
        {/* Progress bar */}
        <div className="max-w-2xl mx-auto px-4 pb-0">
          <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">
        {/* Step 1: About You */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 mb-1">
              Tell Us About Your Business
            </h1>
            <p className="text-slate-500 mb-6 text-sm">
              We'll use this to understand your business and prepare a personalized recommendation.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={form.ownerName}
                    onChange={e => updateField("ownerName", e.target.value)}
                    placeholder="John Smith"
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900 bg-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Business Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={form.businessName}
                    onChange={e => updateField("businessName", e.target.value)}
                    placeholder="Smith's Plumbing"
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900 bg-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Industry
                </label>
                <select
                  value={form.industry}
                  onChange={e => updateField("industry", e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900 bg-white text-sm"
                >
                  <option value="">Select your industry...</option>
                  {INDUSTRY_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Phone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={e => updateField("phone", e.target.value)}
                      placeholder="(405) 555-0123"
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900 bg-white text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => updateField("email", e.target.value)}
                      placeholder="john@business.com"
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900 bg-white text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    City
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={form.city}
                      onChange={e => updateField("city", e.target.value)}
                      placeholder="Oklahoma City"
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900 bg-white text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Current Website
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={form.website}
                      onChange={e => updateField("website", e.target.value)}
                      placeholder="www.mybusiness.com (or leave blank)"
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900 bg-white text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => {
                  if (!form.ownerName || !form.businessName) {
                    toast.error("Please enter your name and business name.");
                    return;
                  }
                  setStep(2);
                }}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 text-sm"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Your Challenges */}
        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 mb-1">
              What's Holding Your Business Back?
            </h1>
            <p className="text-slate-500 mb-6 text-sm">
              Be honest — we've heard it all. The more detail you share, the better we can help.
            </p>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Current Online Presence
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {PRESENCE_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => updateField("currentOnlinePresence", opt.value)}
                      className={`px-4 py-2.5 rounded-lg border text-left text-sm transition-all ${
                        form.currentOnlinePresence === opt.value
                          ? "border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500"
                          : "border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  What's your biggest challenge right now? <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={form.biggestChallenge}
                  onChange={e => updateField("biggestChallenge", e.target.value)}
                  rows={4}
                  placeholder="Example: I get most of my business from word of mouth but I know I'm losing customers because I don't show up on Google. I've tried making a website before but it never looked professional..."
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900 bg-white resize-none text-sm"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm"
              >
                Back
              </button>
              <button
                onClick={() => {
                  if (!form.biggestChallenge) {
                    toast.error("Please describe your biggest challenge.");
                    return;
                  }
                  setStep(3);
                }}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 text-sm"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Budget & Urgency */}
        {step === 3 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 mb-1">
              Almost Done!
            </h1>
            <p className="text-slate-500 mb-6 text-sm">
              Just a couple more questions so we can come prepared with the right options for you.
            </p>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Monthly Budget Range
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {BUDGET_OPTIONS.map(opt => (
                    <button
                      key={opt}
                      onClick={() => updateField("monthlyBudget", opt)}
                      className={`px-4 py-2.5 rounded-lg border text-sm transition-all ${
                        form.monthlyBudget === opt
                          ? "border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500"
                          : "border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  How soon do you need help?
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {URGENCY_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => updateField("urgency", opt.value)}
                      className={`px-4 py-2.5 rounded-lg border text-left text-sm transition-all ${
                        form.urgency === opt.value
                          ? "border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500"
                          : "border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  How did you hear about us?
                </label>
                <input
                  type="text"
                  value={form.howHeard}
                  onChange={e => updateField("howHeard", e.target.value)}
                  placeholder="Business card, referral, Google, etc."
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900 bg-white text-sm"
                />
              </div>
            </div>

            <div className="mt-8">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium">No commitment required</p>
                  <p className="mt-0.5 text-amber-700">
                    This just helps us understand your situation. We'll reach out with a free, no-pressure consultation.
                  </p>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitMutation.isPending}
                  className="px-8 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {submitMutation.isPending ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Trust signals */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-400">
            Proudly serving Oklahoma businesses · Your information is kept private and secure
          </p>
        </div>
      </div>
    </div>
  );
}
