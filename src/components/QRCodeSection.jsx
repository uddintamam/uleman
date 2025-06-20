import React from "react";
import { QRCodeSVG } from "qrcode.react";
import useSectionAnimation from "./useSectionAnimation";

const QRCodeSection = ({ value }) => {
  const [ref, animClass] = useSectionAnimation();

  const handleDownload = () => {
    const svg = ref.current.querySelector('svg');
    if (!svg) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);
    const svgBlob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'qrcode-tamu.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section ref={ref} className={`qrcode-section ${animClass}`}>
      <div className="qrcode-container">
        <h2 className="qrcode-title">QR Code Tamu</h2>
        <p className="qrcode-desc">Tunjukkan QR ini saat hadir ke resepsi.</p>
        <div className="qrcode-box">
          <QRCodeSVG value={value} size={300} bgColor="#fff" fgColor="#166534" level="H" includeMargin={true} />
        </div>
        <button className="qrcode-download-btn" onClick={handleDownload} type="button">Download QR Code</button>
      </div>
    </section>
  );
};

export default QRCodeSection;
