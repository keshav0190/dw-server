const notesDAO = require('../dao/notes');

class NotesService {
  createnote(notesDto) {
    const { user_id, title, body } = notesDto;
    return notesDAO.createNote(user_id, title, body);
  }

  getNote(notesDto) {
    const { id } = notesDto;
    return notesDAO.getNotes(id);
  }
}

module.exports = new NotesService();
