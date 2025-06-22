import React from "react";
import { QRCodeSVG } from "qrcode.react";
import useSectionAnimation from "./useSectionAnimation";

const QRCodeSection = ({ value }) => {
  
    const [refTitle, animTitle] = useSectionAnimation({
      delay: 0,
      direction: 'up',
    });
    const [refSubTitle, animSubTitle] = useSectionAnimation({
      delay: 800,
      direction: 'up',
    });
    
    const [refQrCode, animQrCode] = useSectionAnimation({
      delay: 1500,
      direction: 'blur',
    });

    
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
    <section className={`qrcode-section`}>
      <div className="qrcode-container">
        <h2 ref={refTitle}  className={`qrcode-title ${animTitle}`}
          style={{ transitionDuration: '1000ms' }}
        >QR Code Tamu</h2>
        <p ref={refSubTitle} className={`qrcode-desc ${animSubTitle}`}
          style={{ transitionDuration: '1000ms' }}>Tunjukkan QR ini saat hadir ke resepsi.</p>
        <div ref={refQrCode} className={`qrcode-box ${animQrCode}`}
          style={{ transitionDuration: '1000ms' }}>
          <QRCodeSVG value={value} size={300} bgColor="#fff" fgColor="#166534" level="H" includeMargin={true} />
        </div>
        <button className="qrcode-download-btn" onClick={handleDownload} type="button">Download QR Code</button>
      </div>
    </section>
  );
};

export default QRCodeSection;
