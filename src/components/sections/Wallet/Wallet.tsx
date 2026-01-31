import { useEffect, useState, useMemo } from "react";
import { Modal } from "react-responsive-modal";
import { getAllPasses } from "../../../utils/apiHelper";
import { Pass } from "@/types";
import "./Wallet.scss";
import { InfinitySpin } from "react-loader-spinner";
import WalletCard from "../../base/WalletCard/WalletCard";
import PassQRModal from "../PassQRModal/PassQRModal";


const Wallet = (): JSX.Element => {
    const [passes, setPasses] = useState<Pass[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [selectedPass, setSelectedPass] = useState<Pass | null>(null);
    const [openQRModal, setOpenQRModal] = useState<boolean>(false);

    useEffect(() => {
        const fetchPasses = async () => {
            setLoading(true);
            setError("");
            try {
                const result = await getAllPasses();
                console.log("Fetched Passes:", result);
                setPasses(result);
            } catch (err: any) {
                setError("Failed to load passes");
            } finally {
                setLoading(false);
            }
        };
        fetchPasses();
    }, []);

    const handlePassClick = (pass: Pass) => {
        setSelectedPass(pass);
        setOpenQRModal(true);
    };

    const handleCloseModal = () => {
        setOpenQRModal(false);
    };

    // only re-runs when passes changes
    const { futureTrips, pastTrips } = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const future: Pass[] = [];
        const past: Pass[] = [];
        
        passes.forEach(pass => {
            const tripStartDate = new Date(pass.plan.startDate);
            tripStartDate.setHours(0, 0, 0, 0);
            const tripEndDate = new Date(pass.plan.endDate);
            tripEndDate.setHours(0, 0, 0, 0);
            
            if (tripStartDate >= today || tripEndDate >= today) {
                future.push(pass);
            } else {
                past.push(pass);
            }
        });
        
        future.sort((a, b) => { // Ascending
            const dateA = new Date(a.plan.startDate).getTime();
            const dateB = new Date(b.plan.startDate).getTime();
            return dateA - dateB; 
        });
        
        past.sort((a, b) => { // Descending
            const dateA = new Date(a.plan.startDate).getTime();
            const dateB = new Date(b.plan.startDate).getTime();
            return dateB - dateA; 
        });
        
        return { futureTrips: future, pastTrips: past };
    }, [passes]);

    if(loading) {
        return (
            <div className="loader-overlay">
                <InfinitySpin
                    width="200"
                    color="#ffffff"
                />
            </div>
        );
    }

    return (
        <>
            <section className="wallet">
                <h2 className="wallet__title">My Passes</h2>
                <div className="wallet__list">
                    {loading && <div className="wallet__loading">Loading...</div>}
                    {error && <div className="wallet__error">{error}</div>}
                    
                    {futureTrips.length > 0 && (
                        <div className="wallet__section">
                            <h3 className="wallet__section-title">Upcoming Trips</h3>
                            <div className="wallet__passes">
                                {futureTrips.map((pass) => (
                                    <WalletCard 
                                        key={pass.passId} 
                                        pass={pass} 
                                        onClick={() => handlePassClick(pass)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {pastTrips.length > 0 && (
                        <div className="wallet__section">
                            <h3 className="wallet__section-title">Past Trips</h3>
                            <div className="wallet__passes wallet__passes--past">
                                {pastTrips.map((pass) => (
                                    <WalletCard 
                                        key={pass.passId} 
                                        pass={pass} 
                                        onClick={() => handlePassClick(pass)}
                                        isPast={true}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
            <Modal
                open={openQRModal}
                onClose={handleCloseModal}
                classNames={{
                    modal: "react-responsive-modal-modal--qr-code",
                    modalAnimationIn: "modalInBottom",
                    modalAnimationOut: "modalOutBottom",
                }}
                animationDuration={500}
            >
                {selectedPass && (
                    <PassQRModal
                        passId={selectedPass.id}
                        passTitle={selectedPass.plan.title}
                        onClose={handleCloseModal}
                    />
                )}
            </Modal>
        </>
    );
};

export default Wallet;