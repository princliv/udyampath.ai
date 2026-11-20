import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { firestore, storage } from "../firebase/firebase";
import { linkedInCertificateUrl } from "../features/learn/certificates";
import "../features/learn/learn.css";

export default function CertificateVerify() {
  const { id } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [missing, setMissing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");

  useEffect(() => {
    getDoc(doc(firestore, "certificates", id)).then((snap) => {
      if (!snap.exists()) {
        setMissing(true);
        return;
      }
      const data = { id: snap.id, ...snap.data() };
      setCertificate(data);
      if (data.pdfPath) {
        getDownloadURL(ref(storage, data.pdfPath)).then(setDownloadUrl).catch(() => setDownloadUrl(""));
      }
    }).catch(() => setMissing(true));
  }, [id]);

  if (missing) {
    return (
      <div className="learn-page">
        <div className="learn-wrap learn-panel">
          <h1>Certificate not found</h1>
          <p>No certificate is recorded for {id}.</p>
        </div>
      </div>
    );
  }
  if (!certificate) return <div className="learn-page"><div className="learn-wrap"><p>Checking this certificate…</p></div></div>;

  const issued = new Date(certificate.issuedAt).toLocaleDateString();
  return (
    <div className="learn-page">
      <div className="learn-wrap">
        <article className="cert-sheet">
          <p className="studio-kicker">UdyamPath</p>
          <h1>Certificate of completion</h1>
          <p className="cert-name">{certificate.recipientName}</p>
          <p>{certificate.title}</p>
          <p className="learn-muted">Issued {issued} · {certificate.id}</p>
          <div className="learn-actions">
            {downloadUrl ? <a className="studio-btn studio-btn--dark" href={downloadUrl}>Download PDF</a> : <p>The PDF is stored with this certificate. Download appears when Storage is reachable.</p>}
            <a className="studio-btn studio-btn--line" href={linkedInCertificateUrl(certificate)} target="_blank" rel="noreferrer">Add to LinkedIn</a>
            <Link className="studio-btn studio-btn--line" to="/explore">Browse courses</Link>
          </div>
        </article>
      </div>
    </div>
  );
}
