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
                    <button onClick={() => openModal("about")} className="footer-link"><FaInfoCircle /> About Me</button>
                </div>
                <div className="footer-copy">
                    <span>© {new Date().getFullYear()} </span>
                    <a href="https://crijanblog.vercel.app" target="_blank" rel="noopener noreferrer" className="footer-link">Crijan P</a>
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
                                <h2>🤝 Partner with Me</h2>
                                <p>
                                    Let's collaborate! I work with developers, companies, and other tech enthusiasts to bring exciting ideas to life in the web and blockchain space.
                                </p>
                                <p>
                                    Feel free to reach out for partnership opportunities—whether it's development, consulting, or any other exciting venture.
                                </p>
                            </>
                        )}
                        {modalContent === "advertisement" && (
                            <>
                                <h2>📈 Advertise with Me</h2>
                                <p>
                                    Get your brand in front of an engaged tech audience! Let's discuss opportunities to showcase your project or services to people who value quality in web and blockchain technology.
                                </p>
                                <p>
                                    For inquiries, please contact me directly through LinkedIn or email.
                                </p>
                            </>
                        )}
                        {modalContent === "about" && (
                            <>
                                <h2>About Me</h2>
                                <p>
                                    I'm Crijan Pokhrel, a passionate full-stack web developer specializing in JavaScript, React, and blockchain technology. With years of experience building high-quality, user-centric applications, I bring both technical skills and creativity to every project.
                                </p>
                                <p>
                                    I enjoy pushing the boundaries of modern web development and am always open to new challenges and collaborations.
                                </p>
                            </>
                        )}
                        <div className="modal-buttons">
                            <button onClick={closeModal} className="modal-button close-button">Close</button>
                            {modalContent !== "about" && (
                                <a href="https://t.me/crijanp" target="_blank" rel="noopener noreferrer" className="modal-button chat-button">Let's Chat</a>
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
                            color: #333;
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
