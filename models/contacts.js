

const {Contact}= require('../db/contactModel.js');


const listContacts = async (req, res) => {
 const {_id}= req.user
  const list = await Contact.find({owner:_id})

return list
}

const getContactById = async (contactId) => {
  const list = await Contact.findById(contactId)

  return list
  
}

const removeContact = async (contactId) => {
  const list = await Contact.findByIdAndRemove(contactId)
  return list
}

const addContact = async (req,name, email, phone) => {
  const {_id}= req.user
 
  const list = new Contact ({name, email, phone,owner:_id},_id)
 
await list.save()
}


const updateContact = async (contactId, body) => {
  const {name,email,phone}= body
  const list = await Contact.findByIdAndUpdate(contactId,{$set:{name,email,phone}})
  await list.save()

}


const updateStatusContact = async (contactId,body)=>{
  const{favorite}=body
 
  const list = await Contact.findByIdAndUpdate(contactId,{$set:{favorite}})
  await list.save()
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
 
}
