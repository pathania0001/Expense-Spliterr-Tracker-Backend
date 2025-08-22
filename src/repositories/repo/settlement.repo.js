const { Settlement } = require("../../models");
const CrudRepositories = require("../crud.repo");

class SettlementRepository extends CrudRepositories{
    constructor(){
        super(Settlement)
    }
}

module.exports = SettlementRepository;