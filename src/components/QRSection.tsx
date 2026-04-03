import { Smartphone, Play } from "lucide-react";
import qrAppDemo from "@/assets/qr-app-demo.png";
import qrDemoVideo from "@/assets/qr-demo-video.png";

const QRSection = () => (
  <section id="qr" className="py-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="gradient-card rounded-3xl p-8 sm:p-12 border border-border text-center max-w-3xl mx-auto">
        <h2 className="text-4xl font-bold mb-4">Scan to View App Demo</h2>
        <p className="text-muted-foreground mb-10 max-w-lg mx-auto">Use your phone's camera to scan the QR codes below and access the demo or walkthrough video.</p>
        <div className="flex flex-wrap justify-center gap-8">
          {[
            { label: "App Demo", icon: Smartphone, src: qrAppDemo },
            { label: "Demo Video", icon: Play, src: qrDemoVideo },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-3">
              <div className="w-40 h-40 bg-white rounded-2xl border border-border flex items-center justify-center overflow-hidden p-2">
                <img src={item.src} alt={`${item.label} QR Code`} className="w-full h-full object-contain" />
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <item.icon className="h-4 w-4" />
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default QRSection;
