const projectID = 'healthbook-backend'
const {Datastore} = require('@google-cloud/datastore')

module.exports.Datastore = Datastore
module.exports.datastore = new Datastore({projectID:projectID})
module.exports.fromDatastore = function fromDatastore(item){
    item.id = item(Datastore.KEY).id
    return item
}