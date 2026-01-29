import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TypedHeader from "@/components/TypedHeader";

const GovernmentPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-24">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <span className="section-label font-mono">Government</span>
              <TypedHeader text="Federal Contracting" className="mt-4 mb-6" />
              <p className="text-muted-foreground">
                Certified small business ready to support federal, state, and local agencies.
              </p>
            </div>

            {/* Content */}
            <div className="space-y-12">
              <div className="border-b border-border pb-8">
                <h3 className="text-lg font-medium mb-4">Company Profile</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">DUNS:</span>
                    <span className="ml-2 font-mono">123456789</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">CAGE Code:</span>
                    <span className="ml-2 font-mono">XXXXX</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">UEI:</span>
                    <span className="ml-2 font-mono">XXXXXXXXXXXX</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <span className="ml-2">Small Business</span>
                  </div>
                </div>
              </div>

              <div className="border-b border-border pb-8">
                <h3 className="text-lg font-medium mb-4">NAICS Codes</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-mono">541511</span>
                    <span className="text-muted-foreground">Custom Computer Programming Services (Primary)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono">541512</span>
                    <span className="text-muted-foreground">Computer Systems Design Services</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono">541519</span>
                    <span className="text-muted-foreground">Other Computer Related Services</span>
                  </div>
                </div>
              </div>

              <div className="border-b border-border pb-8">
                <h3 className="text-lg font-medium mb-4">Core Competencies</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Custom Web Application Development</li>
                  <li>• Cloud Infrastructure (AWS, Azure)</li>
                  <li>• UI/UX Design & Accessibility Compliance</li>
                  <li>• Mobile Application Development</li>
                  <li>• Systems Integration & Modernization</li>
                </ul>
              </div>

              <div className="text-center">
                <a 
                  href="/capability-statement" 
                  className="inline-block border border-foreground px-8 py-3 text-sm font-medium hover:bg-foreground hover:text-background transition-colors"
                >
                  View Capability Statement
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GovernmentPage;
