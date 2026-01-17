import { Pass } from "@/types";
import "./WalletCard.scss";
import { formatDateDisplay } from "../../../utils/dateFormat";

interface WalletCardProps {
  pass: Pass;
}

const WalletCard = ({pass}: WalletCardProps): JSX.Element => {
    return (
        <>
            <section className="wallet__card" key={pass.passId}>
                <div className="wallet__card-header"  
                style={{ backgroundImage: `url(${pass.plan.mainImageUrl})` }}> 
                    <div className="wallet__card-overlay">
                        <span className="wallet__card-title">{pass.plan.title}</span>
                        <span className="wallet__card-subtitle">{pass.location.name}, {pass.location.country}</span>
                    </div>
                </div>
                <div className="wallet__card-footer">
                    <span>Plan ID: {pass.planId}</span>
                    <span className="wallet__expiry">Expiry: {formatDateDisplay(pass.expiresAt)}</span>
                </div>
            </section>
        </>
    );
};

export default WalletCard;