const {UserBot, Conversation} = require('../models/models')
const ApiError = require('../error/ApiError')

class UserbotController {

    async addUser(req, res) {       
        try {    
            let exist=await User.findOne( {sub: request.body.sub})
            
            if(exist){
                response.status(200).json({msg: "user already exist"});
                return;
            }

            const {first_name, last_name, chatId} = req.body

            const newUser = await UserBot.create({first_name, last_name, chatId})
            return res.status(200).json(newUser);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    async editUser(req, res) { 
        const {id} = req.params      
        try {    
            let exist=await UserBot.findOne( {where: {chatId: id}} )
            
            if(!exist){
                res.status(500).json({msg: "user not exist"});
                return;
            }

            const {username} = req.body

            const newUser = await UserBot.update(
                { username },
                { where: {chatId: id} })
            return res.status(200).json(newUser);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    async editUserAvatar(req, res) { 
        const {id} = req.params      
        try {    
            let exist=await UserBot.findOne( {where: {chatId: id}} )
            
            if(!exist){
                res.status(500).json({msg: "user not exist"});
                return;
            }

            const {avatar} = req.body

            const newUser = await UserBot.update(
                { avatar },
                { where: {chatId: id} })
            return res.status(200).json(newUser);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    async getUsers(req, res) {
        try {
            const users = await UserBot.findAll({
                order: [
                    ['id', 'DESC'],
                ],
            })
            return res.status(200).json(users);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    async getUsersTable(req, res) {
        try {
            const users = await UserBot.findAll({
                order: [
                    ['id', 'DESC'],
                ],
            })

            const conversations = await Conversation.findAll({
                order: [
                    ['id', 'DESC'],
                ],
            })

            let array = []

            users.forEach(async (user, index) => {
                let conv = conversations.find((item)=> item.dataValues.members[0] === user.dataValues.groupId.toString())
                console.log("conv: ", conv)

                //if (userbot1) {
                    const newObj = {
                        id1: user.dataValues.chatId,
                        name1: user.dataValues.lastname + ' '  + user.dataValues.firstname,
                        type1: user.dataValues.groupId !== null ? 'group' : 'user',//userbot?.group.length > 0 ? 'group' : 'user',
                        status1: '',
                        id2: '',
                        name2: '',//userbot1.dataValues.lastname + ' '  + userbot1.dataValues.firstname,
                        type2: '',//userbot?.group.length > 0 ? 'group' : 'user',
                        status2: '',
                    }
                    array.push(newObj)
                //}
            })

            return res.status(200).json(array);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    async getUser(req, res) {
        const {id} = req.params
        try {
            const userbot = await UserBot.findOne({where: {chatId: id}})
            return res.status(200).json(userbot);
        } catch (err) {
            return res.status(500).json(err);
        }
    }
}

module.exports = new UserbotController()