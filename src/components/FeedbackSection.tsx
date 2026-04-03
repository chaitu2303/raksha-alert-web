import { Star } from "lucide-react";

const reviews = [
  {
    name: "User Review",
    stars: 5,
    text: "Raksha Alert is a powerful safety app with a fast emergency alert system.",
  },
  {
    name: "User Review",
    stars: 5,
    text: "The UI is clean and the concept is very useful for emergency situations.",
  },
  {
    name: "User Review",
    stars: 4,
    text: "A smart safety solution that can help people send alerts quickly.",
  },
];

const StarRating = ({ count }: { count: number }) => (
  <div className="flex gap-1 mb-4 justify-center">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${i < count ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/30"}`}
      />
    ))}
  </div>
);

const FeedbackSection = () => (
  <section id="reviews" className="py-24 relative">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(0_72%_51%/0.06),transparent_60%)]" />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <h2 className="text-4xl font-bold text-center mb-4">User Reviews</h2>
      <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-16">
        What our testers and reviewers have to say
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((r, i) => (
          <div
            key={i}
            className="gradient-card rounded-2xl p-6 border border-border text-center hover:border-primary/30 hover:shadow-glow transition-all duration-300 hover:-translate-y-1"
          >
            <StarRating count={r.stars} />
            <p className="text-sm text-muted-foreground leading-relaxed italic">
              "{r.text}"
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FeedbackSection;
