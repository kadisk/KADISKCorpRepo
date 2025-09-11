const colors = require('colors')
const MountServiceOrchestratorCommand = require('../Helpers/MountServiceOrchestratorCommand')

const PrintServiceInfo = (info) => {
    const labelWidth = 26
    const label = (text) => colors.cyan.bold(text.padEnd(labelWidth))
    const value = (text) => colors.white(text)

    const printLine = (l, v) =>
        console.log(label(l) + value(v))

    const title = 'Service Information'
    const totalWidth = labelWidth + 40
    const titlePad = Math.floor((totalWidth - title.length) / 2)

    console.log('\n' + colors.bold(' '.repeat(titlePad) + title + ' '.repeat(titlePad)))
    console.log(colors.gray('-'.repeat(totalWidth)))

    printLine('Service ID:', info.serviceId)
    printLine('Service Name:', info.serviceName)
    printLine('Service Description:', info.serviceDescription)
    printLine('Instance Repo Code Path:', info.instanceRepositoryCodePath)
    printLine('Origin Repository ID:', info.originRepositoryId)
    printLine('Origin Repository NS:', info.originRepositoryNamespace)
    printLine('Origin Repo Code Path:', info.originRepositoryCodePath)
    printLine('Origin Package ID:', info.originPackageId)
    printLine('Origin Package Name:', info.originPackageName)
    printLine('Origin Package Type:', info.originPackageType)
    printLine('Origin Package Path:', info.originPackagePath)

    console.log(colors.gray('-'.repeat(totalWidth)) + '\n')
}

const GetServiceDataCommand = async ({ args, startupParams, params }) => {
    const { serviceId } = args
    const ServiceOrchestratorCommand = MountServiceOrchestratorCommand({ startupParams, params })
    const serviceInfo = await ServiceOrchestratorCommand((API) => API.GetService({ serviceId }))
    PrintServiceInfo(serviceInfo)
}

module.exports = GetServiceDataCommand
