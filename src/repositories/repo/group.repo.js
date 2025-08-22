const { Group } = require("../../models");
const CrudRepositories = require("../crud.repo");

class GroupRepository extends CrudRepositories{

    constructor(){
        super(Group)
    }
}

module.exports = GroupRepository;