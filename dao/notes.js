const db = require('../db/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')

class NotesDAO {
  async createNote(user_id, title, body) {
    const [id] = await db('notes')
      .insert({
        user_id:user_id,
        title: title,
        body: body,
      })
      .returning('id');

    return id;
  }

  async getNotes(id) {
    return id;
  }
}

module.exports = new NotesDAO();
