const Footer = () => (
  <footer className="border-t border-border py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div className="flex items-center justify-center gap-2.5 mb-3">
        <img src="/raksha-logo.svg" alt="Raksha Alert" className="h-7 w-7 object-contain" />
        <span className="font-bold text-lg" style={{ fontFamily: "var(--font-display)" }}>
          Raksha Alert
        </span>
      </div>
      <p className="text-primary text-sm font-medium mb-2">Your Safety, One Tap Away</p>
      <p className="text-sm text-muted-foreground mb-1">Emergency Safety Alert System</p>
      <p className="text-xs text-muted-foreground">© 2026 Raksha Alert Team. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
