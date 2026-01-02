import { useEffect, useState } from "react";
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


const WalletPage = (): JSX.Element => {
    const navigate = useNavigate();
    const [passes, setPasses] = useState<Pass[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

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
                        <WalletCard key={pass.passId} pass={pass} />
                    ))}
                </div>
            </main>
            <BasketProvider>
                <Navigation pageType="travel" />
            </BasketProvider>
        </>
    );
};

export default WalletPage;