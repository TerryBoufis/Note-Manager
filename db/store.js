const util = require("util");
const fs = require("fs");
const { v4: getId } = require("uuid");

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

class Store {
  read() {
    return readFileAsync("db/db.json", "utf8");
  }
  write(note) {
    return writeFileAsync("db/db.json", JSON.stringify(note));
  }

  getNotes() {
    return this.read().then((notes) => {
      return JSON.parse(notes) || [];
    });
  }

  addNote(note) {
    if (note.title === undefined || note.text === undefined) {
      throw new Error();
    }
    return this.getNotes()
      .then((notes) => {
        note.id = getId();
        // const notesArray = notes.push(note)
        return [...notes, note];
      })
      .then((updatedNotes) => {
        return this.write(updatedNotes);
      })
      .then(() => {
        return note;
      });
  }

  deleteNote(noteId) {
    return this.getNotes()
      .then((notes) => {
        //filter out the one with noteID
        return notes.filter((note) => {
          // return true or false
          // if false, that note gets filtered out.
          // if true, the note does not get filtered
          return note.id !== noteId;
        });
      })
      .then((updatedNotes) => {
        this.write(updatedNotes);
      });
  }
}

module.exports = new Store();
