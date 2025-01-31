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
        title: "Workbench",
        dropdownItems: [
            {
                title:"My Storages",
                href: "#my-storages"
            },
            {
                title:"My Databases",
                href: "#my-databases"
            },
            {
                title:"My Datasources",
                href: "#my-datasources"
            },
            {
                title:"Web Service Builder",
                href: "#web-service-builder"
            }
        ]
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-users-group"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10 13a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M8 21v-1a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v1" /><path d="M15 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M17 10h2a2 2 0 0 1 2 2v1" /><path d="M5 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M3 13v-1a2 2 0 0 1 2 -2h2" /></svg>,
        title: "User administration",
        href: "#user-admin"
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-device-heart-monitor"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" /><path d="M4 9h6l1 -2l2 4l1 -2h6" /><path d="M4 14h16" /><path d="M14 17v.01" /><path d="M17 17v.01" /></svg>,
        title: "Ecosystem Monitoring",
        dropdownItems: [
            {
                icon: <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-notification"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 6h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" /><path d="M17 7m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /></svg>,
                title:"Notification History",
                href: "#notification-history"
            },
            {
                title:"Instance Monitor",
                href: "#instance-monitor"
            },
            {
                title:"Logger Explorer",
                href: "#logger-explorer"
            }
        ]
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-settings-cog"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12.003 21c-.732 .001 -1.465 -.438 -1.678 -1.317a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c.886 .215 1.325 .957 1.318 1.694" /><path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" /><path d="M19.001 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M19.001 15.5v1.5" /><path d="M19.001 21v1.5" /><path d="M22.032 17.25l-1.299 .75" /><path d="M17.27 20l-1.3 .75" /><path d="M15.97 17.25l1.3 .75" /><path d="M20.733 20l1.3 .75" /></svg>,
        title: "Ecosystem Settings",
        dropdownItems: [
            {
                icon: <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-adjustments"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 10a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M6 4v4" /><path d="M6 12v8" /><path d="M10 16a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M12 4v10" /><path d="M12 18v2" /><path d="M16 7a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M18 4v1" /><path d="M18 9v11" /></svg>,
                title:"Default Parameters",
                href: "#default-parameters"
            },
            {
                icon: <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-books"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 4m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z" /><path d="M9 4m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z" /><path d="M5 8h4" /><path d="M9 16h4" /><path d="M13.803 4.56l2.184 -.53c.562 -.135 1.133 .19 1.282 .732l3.695 13.418a1.02 1.02 0 0 1 -.634 1.219l-.133 .041l-2.184 .53c-.562 .135 -1.133 -.19 -1.282 -.732l-3.695 -13.418a1.02 1.02 0 0 1 .634 -1.219l.133 -.041z" /><path d="M14 9l4 -1" /><path d="M16 16l3.923 -.98" /></svg>,
                title:"Repository Settings",
                href: "#repository-settings"
            },
            {
                icon: <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-book-download"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 20h-6a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12v5" /><path d="M13 16h-7a2 2 0 0 0 -2 2" /><path d="M15 19l3 3l3 -3" /><path d="M18 22v-9" /></svg>,
                title:"Repository Sources",
                href: "#repository-sources"
            }
        ]
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
                                .map(({ icon, title, href, dropdownItems}) => {

                                    const isDropdown = dropdownItems && dropdownItems.length > 0

                                    return <li className={`nav-item ${isDropdown ? "dropdown" : ''}`}>
                                                <a className={`nav-link ${isDropdown ? "dropdown-toggle" : ''}`} href={href || "#"} {...isDropdown ? {"data-bs-toggle":"dropdown"} : {}}>
                                                    <span className="nav-link-icon d-md-none d-lg-inline-block">{icon}</span>
                                                    <span className="nav-link-title">{title}</span>
                                                </a>
                                                {
                                                    isDropdown
                                                    && <div className="dropdown-menu">
                                                            {
                                                                dropdownItems
                                                                .map(({ title, href, icon }) => 
                                                                    <a className="dropdown-item" href={href}>{icon}{title}</a>)
                                                            }
                                                        </div>
                                                }
                                            </li>
                                })
                            }
                    </ul>
                </div>
            </div>
        </div>
    </header>
}

export default WelcomeMenu