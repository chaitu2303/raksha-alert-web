import { useState } from "react";
import { Star, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const FeedbackFormSection = () => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim() || rating === 0) {
      toast({ title: "Please fill all fields and select a rating", variant: "destructive" });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({ title: "Please enter a valid email", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { error } = await (supabase as any).from("feedback").insert({
        name: name.trim(),
        email: email.trim(),
        rating,
        message: message.trim(),
      });
      if (error) throw error;
      toast({ title: "Thank you for your feedback!", description: "Your response has been recorded." });
    } catch (err: any) {
      toast({ title: "Error submitting feedback", description: err.message, variant: "destructive" });
      setSubmitting(false);
      return;
    }
    setName("");
    setEmail("");
    setRating(0);
    setMessage("");
    setSubmitting(false);
  };

  return (
    <section id="feedback" className="py-24">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-4">Send Feedback</h2>
        <p className="text-muted-foreground text-center mb-12">
          We'd love to hear your thoughts on Raksha Alert
        </p>
        <form
          onSubmit={handleSubmit}
          className="gradient-card rounded-2xl p-8 border border-border space-y-6 shadow-card"
        >
          <div className="space-y-2">
            <Label htmlFor="fb-name">Name</Label>
            <Input
              id="fb-name"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fb-email">Email</Label>
            <Input
              id="fb-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={255}
            />
          </div>
          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setRating(s)}
                  onMouseEnter={() => setHoverRating(s)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-7 w-7 transition-colors ${
                      s <= (hoverRating || rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-muted-foreground/30"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fb-msg">Message</Label>
            <Textarea
              id="fb-msg"
              placeholder="Share your experience..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={1000}
              rows={4}
            />
          </div>
          <Button type="submit" disabled={submitting} className="w-full gradient-emergency">
            <Send className="h-4 w-4 mr-2" />
            {submitting ? "Sending..." : "Submit Feedback"}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default FeedbackFormSection;
