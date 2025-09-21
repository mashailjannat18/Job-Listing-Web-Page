import "../stylesheets/Header.css"
import logo from "../assets/logo.png"
import savedIcon from "../assets/savedIcon.png"
import savedIconBlue from "../assets/savedIcon-blue.png"
import messagesIcon from "../assets/messagesIcon.png"
import messagesIconBlue from "../assets/messagesIcon-blue.png"
import notificationsIcon from "../assets/notificationsIcon.png"
import notificationsIconBlue from "../assets/notificationsIcon-blue.png"
import userIcon from "../assets/userIcon.png"
import userIconBlue from "../assets/userIcon-blue.png"
import { useState } from "react"
import menuIcon from "../assets/menu-icon.png"

export default function Header({ isBlur }) {
    const [hoverSaved, setHoverSaved] = useState(false)
    const [hoverMessages, setHoverMessages] = useState(false)
    const [hoverNotifications, setHoverNotifications] = useState(false)
    const [hoverAccount, setHoverAccount] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    return (
        <>
            <div className={`headerDiv ${isBlur ? "blurred" : ""}`}>
                <div className="header-container">
                    <img src={logo} alt="" className="logoImg" />
                    
                    <button 
                        className="mobile-menu-toggle"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <img src={menuIcon} alt="Menu" width={20} height={20} />
                    </button>
                
                    <div className={`navbarOptions ${isMobileMenuOpen ? "mobile-open" : ""}`}>
                        <span className="savedSpan">
                            <span className="saved" onMouseEnter={() => setHoverSaved(true)} onMouseLeave={() => setHoverSaved(false)}>
                                <img src={hoverSaved ? savedIconBlue : savedIcon} alt="" width={15} height={15} className="iconImg" />
                                <p className="headerOption">Saved</p>
                            </span>
                        </span>

                        <span className="messagesSpan">
                            <span className="messages" onMouseEnter={() => setHoverMessages(true)} onMouseLeave={() => setHoverMessages(false)}>
                                <img src={hoverMessages ? messagesIconBlue : messagesIcon} alt="" width={16.5} height={16.5} className="iconImg" />
                                <p className="headerOption">Messages</p>
                            </span>
                        </span>

                        <span className="notificationsSpan">
                            <span className="notifications" onMouseEnter={() => setHoverNotifications(true)} onMouseLeave={() => setHoverNotifications(false)}>
                                <img src={hoverNotifications ? notificationsIconBlue : notificationsIcon} alt="" width={16.5} height={16.5} className="iconImg" />
                                <p className="headerOption">Notifications</p>
                            </span> 
                        </span>

                        <span className="accountSpan">
                            <span className="account" onMouseEnter={() => setHoverAccount(true)} onMouseLeave={() => setHoverAccount(false)}>
                                <img src={hoverAccount ? userIconBlue : userIcon} alt="" width={16.5} height={16.5} className="iconImg" />
                                <p className="headerOption">My Account</p>
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        </>
    )
}