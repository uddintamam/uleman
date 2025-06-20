import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faWhatsapp } from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <section className="footer-section">
        <div className="footer-widget-wrap">
            <div className="footer-column">
                <h2 className="footer-heading-title">
                    Web Invitation by MODEEN
                </h2>
                <div className="footer-heading-description">
                    Backsound by Rijal Ahmad
                </div>
                <div style={{width:'100%',height:'1px',background:'linear-gradient(90deg,#e0e0e0 0%,#b2dfdb 100%)',margin:'1.2rem 0 0.7rem 0',borderRadius:'2px'}}></div>
                
                <div className="footer-heading-description">
                    Contact for business inquiries
                </div>
                <div className="footer-social-icons">
                    <a href="https://instagram.com/tamam.uddin" target="_blank" rel="noreferrer" className="icon instagram" aria-label="Instagram DIINVAIT">
                        <FontAwesomeIcon icon={faInstagram} size="md" className="footer-fa-icon" />
                    </a>
                    <a href="https://wa.me/6287771772197" target="_blank" rel="noreferrer" className="icon whatsapp" aria-label="WhatsApp DIINVAIT">
                        <FontAwesomeIcon icon={faWhatsapp} size="md" className="footer-fa-icon" />
                    </a>
                </div>
            </div>
        </div>
      </section>
  );
};

export default Footer;
