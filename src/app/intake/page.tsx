"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function IntakePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const auditType = searchParams.get("type") || "Game Audit";
  
  const [formData, setFormData] = useState({
    name: "",
    platform: "",
    workLink: "",
    clarityFocus: "",
    whyNow: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const clarityOptions = [
    "What game I'm actually playing",
    "Why my content isn't compounding",
    "Where I'm leaking authority",
    "How to structure for leverage",
    "What my failure mode is",
  ];

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.platform) {
      newErrors.platform = "Please select your primary platform";
    }

    if (!formData.workLink.trim()) {
      newErrors.workLink = "Link to your work is required";
    } else if (!isValidUrl(formData.workLink)) {
      newErrors.workLink = "Please enter a valid URL";
    }

    if (!formData.clarityFocus) {
      newErrors.clarityFocus = "Please select what you want clarity on";
    }

    if (!formData.whyNow.trim()) {
      newErrors.whyNow = "This helps us understand your urgency";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string) => {
    try {
      const url = new URL(string);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch (_) {
      // Try adding https:// if no protocol
      try {
        const url = new URL(`https://${string}`);
        return true;
      } catch (_) {
        return false;
      }
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Save to Supabase
      const response = await fetch('/api/intake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          auditType,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save intake data');
      }

      // Store form data for later use
      sessionStorage.setItem("intakeData", JSON.stringify(formData));
      sessionStorage.setItem("auditType", auditType);
      
      // Redirect to Stripe payment link
      window.location.href = "https://buy.stripe.com/fZu8wP3SV3VO5BI3BqeZ20R";
    } catch (error) {
      console.error('Error submitting intake:', error);
      alert('Failed to save your information. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-6 py-12 sm:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4 sm:text-5xl">
            Request a {auditType}
          </h1>
          <p className="text-lg text-muted-foreground">
            This audit is diagnostic, not coaching.
            <br />
            You will receive clear judgment and structural feedback.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border bg-background text-foreground ${
                errors.name ? "border-destructive" : "border-border"
              } focus:outline-none focus:ring-2 focus:ring-primary`}
              placeholder="Your name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Primary Platform */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Primary platform
            </label>
            <div className="space-y-2">
              {["podcast", "newsletter", "video", "mixed"].map((platform) => (
                <label
                  key={platform}
                  className={`flex items-center p-4 rounded-lg border cursor-pointer transition-colors ${
                    formData.platform === platform
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="platform"
                    value={platform}
                    checked={formData.platform === platform}
                    onChange={(e) => handleChange("platform", e.target.value)}
                    className="mr-3 h-4 w-4 text-primary"
                  />
                  <span className="text-foreground capitalize">{platform}</span>
                </label>
              ))}
            </div>
            {errors.platform && (
              <p className="mt-1 text-sm text-destructive">{errors.platform}</p>
            )}
          </div>

          {/* Link to Work */}
          <div>
            <label htmlFor="workLink" className="block text-sm font-medium text-foreground mb-2">
              Link to your work
            </label>
            <input
              type="text"
              id="workLink"
              value={formData.workLink}
              onChange={(e) => handleChange("workLink", e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border bg-background text-foreground ${
                errors.workLink ? "border-destructive" : "border-border"
              } focus:outline-none focus:ring-2 focus:ring-primary`}
              placeholder="https://yourpodcast.com or your newsletter link"
            />
            {errors.workLink && (
              <p className="mt-1 text-sm text-destructive">{errors.workLink}</p>
            )}
          </div>

          {/* Clarity Focus - Forced Choice */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              What do you most want clarity on right now?
            </label>
            <div className="space-y-2">
              {clarityOptions.map((option) => (
                <label
                  key={option}
                  className={`flex items-center p-4 rounded-lg border cursor-pointer transition-colors ${
                    formData.clarityFocus === option
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="clarityFocus"
                    value={option}
                    checked={formData.clarityFocus === option}
                    onChange={(e) => handleChange("clarityFocus", e.target.value)}
                    className="mr-3 h-4 w-4 text-primary"
                  />
                  <span className="text-foreground">{option}</span>
                </label>
              ))}
            </div>
            {errors.clarityFocus && (
              <p className="mt-1 text-sm text-destructive">{errors.clarityFocus}</p>
            )}
          </div>

          {/* Why Now - Honesty Check */}
          <div>
            <label htmlFor="whyNow" className="block text-sm font-medium text-foreground mb-2">
              Why do you want this audit now?
            </label>
            <textarea
              id="whyNow"
              value={formData.whyNow}
              onChange={(e) => handleChange("whyNow", e.target.value)}
              rows={4}
              className={`w-full px-4 py-3 rounded-lg border bg-background text-foreground ${
                errors.whyNow ? "border-destructive" : "border-border"
              } focus:outline-none focus:ring-2 focus:ring-primary resize-none`}
              placeholder="What's driving this decision? What's at stake?"
            />
            {errors.whyNow && (
              <p className="mt-1 text-sm text-destructive">{errors.whyNow}</p>
            )}
          </div>

          {/* CTA */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : 'Continue to Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
