import { useState } from "react";
import { FaHandshake, FaBullhorn, FaInfoCircle } from "react-icons/fa";

export default function Footer() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState("");

    const openModal = (content: string) => {
        setModalContent(content);
        setIsModalOpen(true);
    };
    const closeModal = () => setIsModalOpen(false);

    return (
        <>
            <footer className="footer">
                <div className="footer-links">
                    <button onClick={() => openModal("partnership")} className="footer-link"><FaHandshake /> Partnership</button>
                    <button onClick={() => openModal("advertisement")} className="footer-link"><FaBullhorn /> Advertising</button>
                    <button onClick={() => openModal("about")} className="footer-link"><FaInfoCircle /> About Us</button>
                </div>
                <div className="footer-copy">
                    <span>© {new Date().getFullYear()} </span>
                    <a href="https://icogemhunters.com" target="_blank" rel="noopener noreferrer" className="footer-link">ICOGemHunters</a>
                    <span>. All rights reserved.</span>
                </div>

                <style jsx>{`
                    .footer {
                        width: 100%;
                        max-width: 1200px;
                        margin: 2rem auto 0;
                        background-color: #1c273f;
                        color: white;
                        padding: 1.5rem;
                        text-align: center;
                        border-radius: 0.5rem;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        gap: 0.5rem;
                        box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
                    }

                    .footer-links {
                        display: flex;
                        gap: 2rem;
                        flex-wrap: wrap;
                        justify-content: center;
                        font-size: 1rem;
                        margin-bottom: 0.5rem;
                    }

                    .footer-link {
                        color: #ffffff;
                        text-decoration: none;
                        font-weight: 500;
                        display: flex;
                        align-items: center;
                        gap: 0.3rem;
                        transition: color 0.3s, transform 0.3s;
                        background: none;
                        border: none;
                        cursor: pointer;
                    }

                    .footer-link:hover {
                        color: #6c63ff;
                        transform: scale(1.05);
                    }

                    .footer-copy {
                        font-size: 0.9rem;
                        color: #aaaaaa;
                        display: flex;
                        gap: 0.3rem;
                        align-items: center;
                        flex-wrap: nowrap;
                    }

                    /* Responsive styling */
                    @media (max-width: 600px) {
                        .footer {
                            padding: 1rem;
                        }

                        .footer-links {
                            gap: 1rem;
                            font-size: 0.9rem;
                        }

                        .footer-copy {
                            font-size: 0.8rem;
                        }
                    }
                `}</style>
            </footer>

            {isModalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        {modalContent === "partnership" && (
                            <>
                                <h2>🤝 Partner with Us</h2>
                                <p>
                                    Join our ecosystem to grow together! We collaborate with investors, project owners, and service providers to enhance the crypto landscape.
                                </p>
                                <p>
                                    Explore partnership opportunities across <a href="https://icogemhunters.com" target="_blank" rel="noopener noreferrer">ICOGemHunters</a>, <a href="https://cryptews.com" target="_blank" rel="noopener noreferrer">Cryptews</a>, and <a href="https://ighgroup.io" target="_blank" rel="noopener noreferrer">IGH Groups</a>. Let’s create success together!
                                </p>
                            </>
                        )}
                        {modalContent === "advertisement" && (
                            <>
                                <h2>📈 Advertise with Us</h2>
                                <p>
                                    Get in front of an engaged crypto audience on DEX Paid Checker, ICOGemHunter, and more. Connect with investors and enthusiasts who value quality crypto projects.
                                </p>
                                <p>
                                    For advertising inquiries, please contact <a href="https://t.me/maxis0" target="_blank" rel="noopener noreferrer">maxis0</a> on Telegram.
                                </p>
                            </>
                        )}
                        {modalContent === "about" && (
                            <>
                                <h2>About Us</h2>
                                <p>
                                    At <a href="https://ighgroup.io" target="_blank" rel="noopener noreferrer">IGH Group</a>, our mission is to empower Web3 projects with strategic marketing solutions. Established in 2021, we provide investors, project owners, and service providers with effective strategies that drive high ROI and lasting impact.
                                </p>
                                <p>
                                    Our ecosystem includes <a href="https://icogemhunters.com" target="_blank" rel="noopener noreferrer">ICOGemHunters</a> (ICO Calendar), <a href="https://cryptews.com" target="_blank" rel="noopener noreferrer">Cryptews</a> (Crypto News Aggregator), and <a href="https://t.me/gemhuntersclub_bot" target="_blank" rel="noopener noreferrer">Gems</a> (Play-to-Earn Mini App).
                                </p>
                                <p>
                                    With a reliable team, goal-oriented strategies, and deep Web3 expertise, we’re here to support your journey in the decentralized space.
                                </p>
                            </>
                        )}
                        <div className="modal-buttons">
                            <button onClick={closeModal} className="modal-button close-button">Close</button>
                            {modalContent !== "about" && (
                                <a href="https://t.me/maxis0" target="_blank" rel="noopener noreferrer" className="modal-button chat-button">Let's Chat</a>
                            )}
                        </div>
                    </div>

                    <style jsx>{`
                        .modal-overlay {
                            position: fixed;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            background: rgba(0, 0, 0, 0.8);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            z-index: 1000;
                        }

                        .modal-content {
                            background: #222;
                            padding: 1.5rem;
                            max-width: 400px;
                            width: 90%;
                            border-radius: 0.5rem;
                            border: 1px solid #6c63ff;
                            color: #ddd;
                            text-align: center;
                            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                        }

                        .modal-content h2 {
                            color: #6c63ff;
                            margin-bottom: 1rem;
                        }

                        .modal-content p {
                            margin-bottom: 1rem;
                            line-height: 1.4;
                        }

                        .modal-content a {
                            color: #6c63ff;
                            transition: color 0.3s;
                        }

                        .modal-content a:hover {
                            color: #5a55cc;
                        }

                        .modal-buttons {
                            display: flex;
                            justify-content: center;
                            gap: 1rem;
                            margin-top: 1.5rem;
                        }

                        .modal-button {
                            background-color: #333;
                            color: white;
                            padding: 0.5rem 1.5rem;
                            border: 1px solid #6c63ff;
                            border-radius: 0.3rem;
                            cursor: pointer;
                            font-weight: bold;
                            text-decoration: none;
                            transition: background 0.3s, color 0.3s;
                        }

                        .modal-button:hover {
                            background-color: #6c63ff;
                            color: #fff;
                        }

                        .chat-button {
                            background-color: white;
                            text-decoration:none;
                            underline:none;
                            color: white;

                        }

                        .chat-button:hover {
                            background-color: #444;
                            color: #6c63ff;
                        }

                        .close-button {
                            background-color: #333;
                        }

                        .close-button:hover {
                            background-color: #444;
                            color: #6c63ff;
                        }

                        /* Responsive adjustments */
                        @media (max-width: 400px) {
                            .modal-content {
                                padding: 1rem;
                            }

                            .modal-buttons {
                                flex-direction: column;
                                gap: 0.5rem;
                            }
                        }
                    `}</style>
                </div>
            )}
        </>
    );
}
