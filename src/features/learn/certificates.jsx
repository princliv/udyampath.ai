import { useState } from "react";
import { Link } from "react-router-dom";
import Confetti from "react-confetti";
import { useReducedMotion } from "framer-motion";
import { httpsCallable } from "firebase/functions";
import { functions } from "../../firebase/firebase";

export function linkedInCertificateUrl(certificate) {
  const issued = new Date(certificate.issuedAt || Date.now());
  const page = `${window.location.origin}/verify/certificate/${certificate.id}`;
  const url = new URL("https://www.linkedin.com/profile/add");
  url.searchParams.set("startTask", "CERTIFICATION_NAME");
  url.searchParams.set("name", certificate.title || "UdyamPath certificate");
  url.searchParams.set("organizationName", "UdyamPath");
  url.searchParams.set("issueYear", String(issued.getFullYear()));
  url.searchParams.set("issueMonth", String(issued.getMonth() + 1));
  url.searchParams.set("certUrl", page);
  url.searchParams.set("certId", certificate.id);
  return url.toString();
}

export async function requestCertificate(kind, refId) {
  const call = httpsCallable(functions, "issueCertificate");
  const response = await call({ kind, refId });
  return response.data;
}

export function CertificateMoment({ certificate, onClose }) {
  const reduce = useReducedMotion();
  if (!certificate) return null;
  return (
    <div className="cert-overlay" role="dialog" aria-modal="true" aria-label="Certificate issued">
      {reduce ? null : <Confetti recycle={false} numberOfPieces={160} />}
      <article className="cert-card">
        <p className="studio-kicker">Certificate</p>
        <h2>{certificate.already ? "You already earned this" : "Certificate issued"}</h2>
        <p>{certificate.title}</p>
        <p>{certificate.recipientName}</p>
        <div className="learn-actions">
          <Link className="studio-btn studio-btn--dark" to={`/verify/certificate/${certificate.id}`}>Open certificate</Link>
          <a className="studio-btn studio-btn--line" href={linkedInCertificateUrl(certificate)} target="_blank" rel="noreferrer">Add to LinkedIn</a>
          <button className="studio-btn studio-btn--line" type="button" onClick={onClose}>Close</button>
        </div>
      </article>
    </div>
  );
}

export function IssueCertificateButton({ kind, refId, label }) {
  const [certificate, setCertificate] = useState(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const issue = async () => {
    setBusy(true);
    setMessage("");
    try {
      setCertificate(await requestCertificate(kind, refId));
    } catch (error) {
      setMessage(error.message || "Could not issue the certificate.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <button className="studio-btn studio-btn--dark" type="button" onClick={issue} disabled={busy}>
        {busy ? "Issuing…" : label}
      </button>
      {message ? <p>{message}</p> : null}
      {certificate ? <CertificateMoment certificate={certificate} onClose={() => setCertificate(null)} /> : null}
    </>
  );
}
