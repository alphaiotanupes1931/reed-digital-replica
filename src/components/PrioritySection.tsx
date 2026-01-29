const priorities = [
  { label: "Your Success", description: "is our #1 priority" },
  { label: "Your Vision", description: "shapes every decision" },
  { label: "The Relationship", description: "partners, not vendors" },
  { label: "The Craft", description: "excellence in every detail" },
];

const PrioritySection = () => {
  return (
    <section className="py-20 bg-foreground text-background">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-8">
              The RDG Priority Hierarchy
            </h2>
            <p className="text-background/70 text-lg mb-12">
              We built our company around a simple truth: when you win, we win.
            </p>

            <div className="space-y-6">
              {priorities.map((priority, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full bg-primary flex-shrink-0"></div>
                  <p className="text-lg">
                    <span className="text-primary font-semibold">{priority.label}</span>{" "}
                    <span className="text-background/70">{priority.description}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content */}
          <div className="relative">
            <div className="bg-background/5 rounded-3xl p-12 text-center border border-background/10">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary text-4xl font-display font-bold">#1</span>
              </div>
              <h3 className="font-display text-2xl font-bold mb-2">You're at the top</h3>
              <p className="text-background/60">
                This isn't marketing speak — our reviews prove it.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrioritySection;
