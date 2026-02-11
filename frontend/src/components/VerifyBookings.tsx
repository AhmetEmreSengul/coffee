import { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const VerifyBooking = ({ onScan }: { onScan: (data: string) => void }) => {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: 250 },
      false,
    );

    scanner.render(
      (decodedText) => {
        onScan(decodedText);
        scanner.clear();
      },
      (error) => {
        console.log(error);
      },
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, []);

  return <div id="reader" className="w-full max-w-md mx-auto" />;
};

export default VerifyBooking;
