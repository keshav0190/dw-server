const notesService = require('../service/notes');
const axios = require('axios');

class NotesController {
  async createNotes(req, res) {
    try {
      const id = await notesService.createnote(req.body);
      if(id)
      {
        res.status(200).json({
          status_code: 200,
          message: "Note Added",
          data: {
            id: id
          }
        })
      }else{
        res.status(500).json({
          status_code: 500,
          message: "Bad Request",
          data: {
            id: id
          }
        })
      }
    } catch (err) {
      console.error(err);
    }
  }

  async getNotes(req, res) {
    console.log('In get user',req.params.id);
    try {
      const id = await notesService.getNote(req.params.id);
      console.log('return data',id);
      res.status(200).json(id);
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = new NotesController();
