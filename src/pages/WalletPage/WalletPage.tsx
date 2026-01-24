import { useEffect, useState } from "react";
import { Modal } from "react-responsive-modal";
import { getAllPasses } from "../../utils/apiHelper";
import { useNavigate } from "react-router-dom";
import { Pass } from "@/types";
import { ToastContainer } from "react-toastify";
import Header from "../../components/sections/Header/Header";
import ProfileIcon from "../../assets/icons/full-profile-icon.svg?react";
import "./WalletPage.scss";
import { InfinitySpin } from "react-loader-spinner";
import WalletCard from "../../components/base/WalletCard/WalletCard";
import { BasketProvider } from "../../context/BasketContext";
import Navigation from "../../components/sections/Navigation/Navigation";
import PassQRModal from "../../components/sections/PassQRModal/PassQRModal";


const WalletPage = (): JSX.Element => {
    const navigate = useNavigate();
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
            <ToastContainer />
            <Header
                rightElement={
                    <>
                        <ProfileIcon
                            className="header__profile-icon"
                            onClick={() => navigate("/user")}
                        />
                    </>
                }
            />
            <main className="main main-wallet">
                <h2 className="wallet__title">My Passes</h2>
                {loading && <div className="wallet__loading">Loading...</div>}
                {error && <div className="wallet__error">{error}</div>}
                <div className="wallet__passes">
                    {passes.map((pass) => (
                        <WalletCard 
                            key={pass.passId} 
                            pass={pass} 
                            onClick={() => handlePassClick(pass)}
                        />
                    ))}
                </div>
            </main>
            <BasketProvider>
                <Navigation pageType="travel" />
            </BasketProvider>
            
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

export default WalletPage;