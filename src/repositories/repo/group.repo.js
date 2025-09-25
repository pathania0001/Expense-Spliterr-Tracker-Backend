const { Group } = require("../../models");
const CrudRepositories = require("../crud.repo");

class GroupRepository extends CrudRepositories{

    constructor(){
        super(Group)
    }
    async getAll(condition){
      const response = await this.model.find(condition).populate("members",["name","email"]); ;
       return response;
    }
    async get(id){
      const response = await this.model.findById(id).populate("members",["name","email"]); ;
       return response;
    }
}

module.exports = GroupRepository;