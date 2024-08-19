const { Conversation, UserBot } = require("../models/models");
const { Op } = require('sequelize')

class ConversationController {

    //создать беседу
    async newConversation(req, res) {        
        try {
            console.log(req.body)
            const {senderId, receiverId} = req.body

            //найти беседу
            const exist = await Conversation.findOne({
                where: { 
                    members: {
                        [Op.contains]: [senderId]
                    } 
                },
            }) 
            if (exist && exist.length !== 0) {
                return res.status(200).json(`conversation already exist`);
            }

            await Conversation.create({
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
    
            const conversation = await Conversation.findOne({
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
            const conversations = await Conversation.findAll({
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
            const conversations = await Conversation.findAll({
                order: [
                    ['id', 'DESC'],
                ],
            })

            const users = await UserBot.findAll({
                order: [
                    ['id', 'DESC'],
                ],
            })

            let array = []

            conversations.forEach(async (conv, index) => {
                const groupId = conv.dataValues.members[0]
                let userbot = users.find((item)=> item.chatId === groupId)
                const newObj = {
                    id: groupId,
                    name: userbot.lastname + userbot.firstname,
                    type: userbot.group.length > 0 ? 'group' : 'user',
                }
                array.push(newObj)
            })

            return res.status(200).json(array);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }
}

module.exports = new ConversationController()