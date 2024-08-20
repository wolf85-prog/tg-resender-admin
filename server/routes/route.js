const Router = require('express')
const route = new Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')
const { getAllMessages} = require('../controllers/messageController')
const { newConversation, getConversation, getConversations, getConversationsTable } = require('../controllers/conversationController')
const { addUser, getUsers, getUsersTable, getUser, editUser, editUserAvatar, getUsersGroup} = require('../controllers/userbotController')

route.post('/user/registration', userController.registration)
route.post('/user/login', userController.login)
route.get('/user/auth', authMiddleware, userController.check)
route.get('/user/get', authMiddleware, userController.getAll)
route.get('/user/get/:id', authMiddleware, userController.getOne)


route.get('/message/get', getAllMessages)

route.post('/conversation/add', newConversation)
route.get('/conversation/get/:id', getConversation)
route.get('/conversations/get', getConversations)

route.get('/conversations/table/get', getConversationsTable)

route.post('/userbots/add', addUser)
route.get('/userbots/get', getUsers)
route.get('/userbots/table/get', getUsersTable)
route.get('/userbots/get/:id', getUser)
route.patch('/userbots/update/:id', editUser)
route.patch('/userbots/updatefile/:id', editUserAvatar)

route.get('/userbots/group/get/:id', getUsersGroup)


module.exports = route