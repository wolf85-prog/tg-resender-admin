const { Conversationbot, UserBot } = require("../models/models");
const { Op } = require('sequelize')

class ConversationController {

    //создать беседу
    async newConversation(req, res) {        
        try {
            console.log(req.body)
            const {senderId, receiverId} = req.body

            //найти беседу
            const exist = await Conversationbot.findOne({
                where: { 
                    members: {
                        [Op.contains]: [senderId]
                    } 
                },
            }) 
            if (exist && exist.length !== 0) {
                return res.status(200).json(`conversation already exist`);
            }

            await Conversationbot.create({
                members: [senderId, receiverId]
            }) 
            return res.status(200).json(`coversation saved sucessfully`)
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }
    
    async getConversation(req, res) {  
        try {
            const chatId = req.params.id
    
            const conversation = await Conversationbot.findOne({
                where: {
                    members: {
                        [Op.contains]: [chatId]
                    }
                },
            })
            return res.status(200).json(conversation);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    async getConversations(req, res) {  
        try {   
            const conversations = await Conversationbot.findAll({
                order: [
                    ['id', 'DESC'],
                ],
            })
            return res.status(200).json(conversations);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    async getConversationsTable(req, res) {  
        try {   
            const conversations = await Conversationbot.findAll({
                order: [
                    ['id', 'DESC'],
                ],
            })

            const users = await UserBot.findAll({
                order: [
                    ['id', 'DESC'],
                ],
            })
            console.log("users: ", users)

            let array = []

            conversations.forEach(async (conv, index) => {
                const groupId1 = conv.dataValues.members[0]
                const groupId2 = conv.dataValues.members[1]
                let userbot1 = users.find((item)=> item.dataValues.groupId === groupId1.toString())
                let userbot2 = users.find((item)=> item.dataValues.groupId === groupId2.toString())
                //console.log("userbot: ", userbot)

                if (userbot1) {
                    const newObj = {
                        id: groupId1,
                        name: userbot1.dataValues.lastname + ' '  + userbot1.dataValues.firstname,
                        //type: userbot?.group.length > 0 ? 'group' : 'user',
                    }
                    array.push(newObj)
                    //array[index].name = 

                } else if (userbot2) {
                    const newObj = {
                        id: groupId1,
                        //name1:'',
                        //id2: groupId2,
                        //name2:'',
                        name: userbot2.dataValues.lastname + ' '  + userbot2.dataValues.firstname,
                        //type: userbot?.group.length > 0 ? 'group' : 'user',
                    }
                    array.push(newObj)
                    //array[index].name = userbot2 ? userbot2.dataValues.lastname + ' ' : ''  + userbot ? userbot.dataValues.firstname : '',
                }        
            })

            return res.status(200).json(array);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }
}

module.exports = new ConversationController()