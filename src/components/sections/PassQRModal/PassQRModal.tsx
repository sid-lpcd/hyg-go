import React, { useEffect, useState } from "react";
import { getPassQRCode } from "../../../utils/apiHelper";
import { InfinitySpin } from "react-loader-spinner";
import "./PassQRModal.scss";
import { PassGenerationResponse } from "@/types";

interface PassQRModalProps {
  passId: string;
  passTitle: string;
  onClose: () => void;
}

const PassQRModal: React.FC<PassQRModalProps> = ({
  passId,
  passTitle,
}) => {
  const [qrData, setQrData] = useState<PassGenerationResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchQRCode = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await getPassQRCode(passId);
        setQrData(response);
      } catch (err: any) {
        setError(err.message || "Failed to load QR code");
      } finally {
        setLoading(false);
      }
    };

    fetchQRCode();
  }, [passId]);

  return (
    <>
      <div className="pass-qr-modal__header">
        <h2 className="pass-qr-modal__title">{passTitle}</h2>
      </div>
        
      <div className="pass-qr-modal__content">
          {loading && (
            <div className="pass-qr-modal__loading">
              <InfinitySpin width="60" color="#007bff" />
              <p>Loading QR Code...</p>
            </div>
          )}
          
          {error && (
            <div className="pass-qr-modal__error">
              <p>{error}</p>
            </div>
          )}
          
          {qrData && !loading && !error && (
            <div className="pass-qr-modal__qr-container">
              <div className="pass-qr-modal__qr-code">
                {qrData.qrCodeUrl ? (
                  <img 
                    src={qrData.qrCodeUrl} 
                    alt="QR Code" 
                    className="pass-qr-modal__qr-image"
                  />
                ) : (
                  <div className="pass-qr-modal__qr-data">
                    {qrData.qrCodeToken}
                  </div>
                )}
              </div>
              <div className="pass-qr-modal__info">
                <p className="pass-qr-modal__expiry">Expires: {new Date(qrData.pass.expiresAt).toLocaleDateString()}</p>
                <p className="pass-qr-modal__pass-id">Pass ID: {qrData.pass.passId}</p>
              </div>
            </div>
          )}
      </div>
    </>
  );
};

export default PassQRModal;