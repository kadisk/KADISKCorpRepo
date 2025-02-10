import * as React             from "react"
import {useEffect, useState}  from "react"
import { connect }            from "react-redux"
import { bindActionCreators } from "redux"

import WelcomeWorkspace from "./WelcomeWorkspace"


import CreateNewRepositoryModal from "./CreateNewRepository.modal"
import ImportRepositoryModal from "./ImportRepository.modal"

const CREATE_MODE = Symbol()
const IMPORT_MODE = Symbol()
const DEFAULT_MODE = Symbol()

const MyWorkspaceContainer = ({ HTTPServerManager }) => {

    const [ modalCurrent,  setModalCurrent] = useState(DEFAULT_MODE)


    const handleSelectMode = (mode) => {
        setModalCurrent(mode)
    }

    const handleCloseModal = () => {
        setModalCurrent(DEFAULT_MODE)
    }

    const handleCreatedRepository = () => {
        setModalCurrent(DEFAULT_MODE)
    }

	return <>
                {modalCurrent === CREATE_MODE && <CreateNewRepositoryModal onCreated={handleCreatedRepository} onClose={handleCloseModal} />}
                {modalCurrent === IMPORT_MODE && <ImportRepositoryModal onClose={handleCloseModal} />}
                <WelcomeWorkspace
                    onSelectCreateRepository={() => handleSelectMode(CREATE_MODE)}
                    onSelectImportRepository={() => handleSelectMode(IMPORT_MODE)}/>
            </>
}

const mapDispatchToProps = (dispatch:any) => bindActionCreators({}, dispatch)

const mapStateToProps = ({ HTTPServerManager }:any) => ({ HTTPServerManager })

export default connect(mapStateToProps, mapDispatchToProps)(MyWorkspaceContainer)
