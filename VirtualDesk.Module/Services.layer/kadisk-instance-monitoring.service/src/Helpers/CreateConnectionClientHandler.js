
const CreateConnectionClientHandler = () => {

    let clients = {}

    const AddNewClient = (socketFileId, communicationClient) => {
        clients[parseInt(socketFileId)] = communicationClient
    }

    const GetClient = (socketFileId) => clients[parseInt(socketFileId)]

    return {
        AddNewClient,
        GetClient
    }
}

module.exports = CreateConnectionClientHandler