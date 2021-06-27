"use strict";
const bcrypt = require("bcrypt");
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("database.sqlite3", (err) => {
  if (err) throw err;
});
db.run("PRAGMA foreign_keys = ON");

const db_getPollQuestions = (id_poll) => {
  const sql = ` SELECT questions.id_quest,name_quest,closed,min,max,id_poll,position,id_option,value_option
                FROM questions LEFT JOIN closedquestionsoptions ON closedquestionsoptions.id_quest=questions.id_quest 
                WHERE id_poll=?`;
  return new Promise((resolve, reject) => {
    db.all(sql, [id_poll], (err, rows) => {
      if (err) return reject(err);
      resolve(
        rows.map((x) => {
          return {
            id: x.id_quest,
            name: x.name_quest,
            closed: x.closed ? true : false,
            min: x.min,
            max: x.max,
            position: x.position,
            value_option: x.value_option,
          };
        })
      );
    });
  });
};

const db_getPollList = (id_manager) => {
  const sql = id_manager
    ? " SELECT * FROM polls WHERE id_manager=?;"
    : " SELECT * FROM polls;";

  return new Promise((resolve, reject) => {
    db.all(sql, id_manager?[id_manager]:[], (err, rows) => {
      if (err) return reject(err);
      resolve(
        rows.map((x) => {
          return {
            id: x.id_poll,
            name: x.name_poll,
          };
        })
      );
    });
  });
};

const db_getPollAnswers = (id_poll, id_manager) => {
  const sql = `
  SELECT * 
  FROM questions q, answers a, polls p, submissions s 
  WHERE a.id_quest = q.id_quest AND 
        p.id_poll=q.id_poll AND 
        q.id_poll=? AND 
        a.id_submission=s.id_submission AND
        p.id_manager=?;`;
  
  return new Promise((resolve, reject) => {
    db.all(sql, [id_poll,id_manager], (err, rows) => {
      if (err) return reject(err);
      resolve(
        rows.map((x) => {
          return {
            id_quest: x.id_quest,
            id_submission: x.id_submission,
            user: x.user,
            value: x.value,
          };
        })
      );
    });
  });
};

const db_insertPoll = (name_poll, id_manager) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO polls(name_poll,id_manager) VALUES (?,?)";
    db.run(sql, [name_poll, id_manager], function (err) {
      if (err) return reject(err);
      resolve(this.lastID);
    });
  });
};

const db_insertQuest = (name_quest, closed, min, max, id_poll, position) => {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO questions(name_quest,closed,min,max,id_poll,position) VALUES (?,?,?,?,?,?)";
    db.run(
      sql,
      [name_quest, closed, min, max, id_poll, position],
      function (err) {
        if (err) return reject(err);
        resolve(this.lastID);
      }
    );
  });
};

const db_insertClosedQuestOption = (value_option, id_quest) => {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO closedquestionsoptions(value_option, id_quest) VALUES (?,?)";
    db.run(sql, [value_option, id_quest], function (err) {
      if (err) return reject(err);
      resolve(this.lastID);
    });
  });
};

const db_insertAnswer = (id_submission, id_quest, value) => {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO answers(id_submission,id_quest,value) VALUES (?,?,?)";
    db.run(sql, [id_submission, id_quest, value], function (err) {
      if (err) return reject(err);
      resolve(this.lastID);
    });
  });
};

const db_createSubmission = (name_user, id_poll) => {
  return new Promise((resolve, reject) => {
    const sql = " INSERT INTO submissions(user,id_poll) VALUES (?,?)";
    db.run(sql, [name_user, id_poll], function (err) {
      if (err) return reject(err);
      resolve(this.lastID);
    });
  });
};

const db_getPollIdBySubmissionId = (id_submission) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM submissions WHERE id_submission=?";
    db.all(sql, [id_submission], function (err, rows) {
      if (err) return reject(err);
      if (rows[0]) resolve(rows[0].id_poll);
      else reject(new Error(`Submission_id ${id_submission} doesn't exist`));
    });
  });
};

const db_getQuestionById = (id_question) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM questions WHERE id_quest=?";
    db.all(sql, [id_question], function (err, rows) {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

const db_getOptionsByQuestId = (id_question) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM closedquestionsoptions WHERE id_quest=?";
    db.all(sql, [id_question], function (err, rows) {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

const db_getAnswersBySubmissionId = (id_submission) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM answers WHERE id_submission=?";
    db.all(sql, [id_submission], function (err, rows) {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

const db_getPollQuestionsUniq = (id_poll) => {
  //estrae la lista delle domande senza opzioni (ogni id_quest compare una sola volta)
  const sql = ` SELECT * FROM questions WHERE id_poll=?`;
  return new Promise((resolve, reject) => {
    db.all(sql, [id_poll], (err, rows) => {
      if (err) return reject(err);
      resolve(
        rows.map((x) => {
          return {
            id: x.id_quest,
            name: x.name_quest,
            closed: x.closed ? true : false,
            min: x.min,
            max: x.max,
            position: x.position,
          };
        })
      );
    });
  });
};

const db_getUser = (mail, password) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM managers WHERE mail = ?";
    db.get(sql, [mail], (err, row) => {
      if (err) reject(err);
      else if (row === undefined) resolve(false);
      else {
        const user = { id: row.id_manager, mail: row.mail, name: row.name };
        bcrypt.compare(password, row.hash).then((result) => {
          if (result) resolve(user);
          else resolve(false);
        });
      }
    });
  });
};

const db_getuserById = async (id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM managers WHERE id_manager=?";
    db.get(sql, [id], function (err, row) {
      if (err) return reject(err);
      else if (row === undefined) resolve({ error: "User not found." });
      else {
        resolve({
          id: row.id_manager,
          mail: row.mail,
          name: row.name,
        });
      }
    });
  });
};

exports.db_getPollQuestions = db_getPollQuestions;
exports.db_getPollList = db_getPollList;
exports.db_getPollAnswers = db_getPollAnswers;
exports.db_insertPoll = db_insertPoll;
exports.db_insertQuest = db_insertQuest;
exports.db_insertClosedQuestOption = db_insertClosedQuestOption;
exports.db_insertAnswer = db_insertAnswer;
exports.db_createSubmission = db_createSubmission;
exports.db_getPollIdBySubmissionId = db_getPollIdBySubmissionId;
exports.db_getQuestionById = db_getQuestionById;
exports.db_getOptionsByQuestId = db_getOptionsByQuestId;
exports.db_getAnswersBySubmissionId = db_getAnswersBySubmissionId;
exports.db_getPollQuestionsUniq = db_getPollQuestionsUniq;
exports.db_getUser = db_getUser;
exports.db_getuserById = db_getuserById;
