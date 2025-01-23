import * as React from "react"


const MENU_CONFIG = [
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" stroke-width="2"> <path d="M4 4m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"></path> <path d="M4 14m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"></path> <path d="M14 14m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"></path> <path d="M14 7l6 0"></path> <path d="M17 4l0 6"></path> </svg>,
        title: "My Apps",
        href: "#apps"
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" stroke-width="2">
            <path d="M3 6h18"></path>
            <path d="M4 6v13"></path>
            <path d="M20 19v-13"></path>
            <path d="M4 10h16"></path>
            <path d="M15 6v8a2 2 0 0 0 2 2h3"></path>
        </svg>,
        title: "My Workbench",
        href: "#workbench"
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-users-group"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10 13a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M8 21v-1a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v1" /><path d="M15 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M17 10h2a2 2 0 0 1 2 2v1" /><path d="M5 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M3 13v-1a2 2 0 0 1 2 -2h2" /></svg>,
        title: "User administration",
        href: "#user-admin"
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-device-heart-monitor"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" /><path d="M4 9h6l1 -2l2 4l1 -2h6" /><path d="M4 14h16" /><path d="M14 17v.01" /><path d="M17 17v.01" /></svg>,
        title: "Ecosystem Monitor",
        href: "#ecosystem-monitor"
    }
]

const WelcomeMenu = () => {
    return <header className="navbar-expand-md">
        <div className="collapse navbar-collapse" id="navbar-menu">
            <div className="navbar">
                <div className="container-xl">
                    <ul className="navbar-nav">
                       
                            {
                                MENU_CONFIG
                                    .map(({ icon, title, href }) =>
                                        <li className="nav-item">
                                            <a className="nav-link" href={href}>
                                                <span className="nav-link-icon d-md-none d-lg-inline-block">{icon}</span>
                                                <span className="nav-link-title">{title}</span>
                                            </a>
                                        </li>)
                            }
                        
                    </ul>
                </div>
            </div>
        </div>
    </header>
}

export default WelcomeMenu