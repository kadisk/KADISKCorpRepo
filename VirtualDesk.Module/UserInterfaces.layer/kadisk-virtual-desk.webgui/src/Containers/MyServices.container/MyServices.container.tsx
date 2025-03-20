import * as React             from "react"
import {useEffect, useState}  from "react"
import { connect }            from "react-redux"
import { bindActionCreators } from "redux"


import WelcomeMyServices from "./WelcomeMyServices"
import ImportRepositoryModal from "./ImportRepository.modal"

const DEFAULT_MODE             = Symbol()
const IMPORT_SELECT_MODE       = Symbol()
const IMPORTING_MODE           = Symbol()


const MyServicesContainer = () => {

    const [ interfaceModeType,  setInterfaceModeType] = useState(DEFAULT_MODE)

    const changeMode = (mode) => setInterfaceModeType(mode)

    const handleImportNew = () => {
        changeMode(IMPORT_SELECT_MODE)
    }

    const handleImportingMode = (importData) => {
        changeMode(IMPORTING_MODE)
    }

    const handleUseFromMyWorkspace = () => {
        console.log("== handleUseFromMyWorkspace")
    }

    const handleCloseModal = () => setInterfaceModeType(DEFAULT_MODE)

    return <>
                {interfaceModeType === IMPORT_SELECT_MODE && <ImportRepositoryModal onImport={handleImportingMode} onClose={handleCloseModal} />}
                <WelcomeMyServices onImportNew={handleImportNew} onUseFromMyWorkspace={handleUseFromMyWorkspace}/>
            </>
}
    

export default MyServicesContainer