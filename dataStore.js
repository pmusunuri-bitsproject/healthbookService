const fs = require('fs')
const filePath = './datastore/'
const files = ['user.json', 'userAppointment.json', 'providers.json', 'providerOrganization.json',
    'providerAppointment.json', 'organizations.json', 'healthRecord.json', 'healthRecordAccess.json']

module.exports.createDatastore = () => {
    data = JSON.stringify({})
    files.forEach(file => {
        try {
            if (!fs.existsSync(filePath + file)) {
                fs.openSync(filePath + file, 'a')
                fs.writeFileSync(filePath + file, data)
            }
        } catch (err) {
            console.error(err)
        }
    })
}

module.exports.gethealthRecordAccessDbo = () => {
    let data = JSON.parse(fs.readFileSync('datastore/healthRecordAccess.json'))
    return data
}


module.exports.getOrganizationDbo =() => {
    let data = JSON.parse(fs.readFileSync('datastore/organizations.json'))
    return data
}

module.exports.getProviderDbo = () => {
    let data = JSON.parse(fs.readFileSync('datastore/providers.json'))
    return data
}

module.exports.getProviderOrgDbo = () => {
    let data = JSON.parse(fs.readFileSync('datastore/providerOrganization.json'))
    return data
}

module.exports.getHealthRecordDbo = () => {
    let data = JSON.parse(fs.readFileSync('datastore/healthRecord.json'))
    return data
}

module.exports.getUserDbo = () => {
    let data = JSON.parse(fs.readFileSync('datastore/user.json'))
    return data
}

module.exports.getAppointmentDbo = () => {
    let data = JSON.parse(fs.readFileSync('datastore/appointments.json'))
    return data
}

module.exports.getAppointmentParticipantDbo = () => {
    let data = JSON.parse(fs.readFileSync('datastore/appointmentParticipant.json'))
    return data
}
