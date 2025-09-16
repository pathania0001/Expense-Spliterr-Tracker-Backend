const { Settlement } = require("../../models");
const CrudRepositories = require("../crud.repo");

class SettlementRepository extends CrudRepositories{
    constructor(){
        super(Settlement)
    }
    async getAll(filter){
        return await Settlement.find(filter)
      .populate("paidByUser", "name email")  
      .populate("paidToUser", "name email")      
      .populate("groupId")         

    }
}

module.exports = SettlementRepository;