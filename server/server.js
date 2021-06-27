"use strict";

const express = require("express");
const morgan = require("morgan");
const { check, validationResult } = require("express-validator");
const dao = require("./dao");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");

const app = express();
const port = 3001;

app.use(morgan("dev"));
app.use(express.json());

passport.use(
  new LocalStrategy(function (username, password, done) {
    dao.db_getUser(username, password).then((user) => {
      if (!user)
        return done(null, false, {
          message: "Incorrect username and/or password.",
        });

      return done(null, user);
    });
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  dao
    .db_getuserById(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err, null);
    });
});

app.use(
  session({
    secret: "EsameDiWebApp1",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  return res.status(401).json({ error: "not authenticated" });
};

app.post(
  "/api/sessions",
  [check("username").isEmail()],
  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json(info);
      }
      req.login(user, (err) => {
        if (err) return next(err);

        return res.json({ email: req.user.email, name: req.user.name });
      });
    })(req, res, next);
  }
);

app.delete("/api/sessions/current", (req, res) => {
  req.logout();
  res.end();
});

const insertPoll = async (poll, id_manager) => {
  const id_poll = await dao.db_insertPoll(poll.name, id_manager);
  for (const question of poll.questions) {
    const id_quest = await dao.db_insertQuest(
      question.name,
      question.closed,
      question.min,
      question.max,
      id_poll,
      question.position
    );
    for (const option of question.options) {
      await dao.db_insertClosedQuestOption(option, id_quest);
    }
  }
  return id_poll;
};

const getPollQuestions = async (poll_id) => {
  const questions = await dao.db_getPollQuestions(poll_id);

  const questions_reduced = [];
  const indexes_questions = questions.map((x) => x.id);

  const indexes_questions_uniq = indexes_questions.filter(
    (x, pos) => indexes_questions.indexOf(x) === pos
  );

  indexes_questions_uniq.forEach((x) => {
    const quest = questions.find((y) => y.id == x);
    const tmp = questions.filter((y) => y.id == x).map((z) => z.value_option);

    questions_reduced.push({
      id: quest.id,
      name: quest.name,
      closed: quest.closed,
      min: quest.min,
      max: quest.max,
      position: quest.position,
      options: quest.closed ? [...tmp] : [],
    });
  });

  return questions_reduced;
};

const insertAnswer = async (answer) => {
  for (const question of answer.questions) {
    if (question.values.length === 0) {
      dao.db_insertAnswer(answer.id_submission, question.id_quest, null);
    } else {
      for (const value of question.values) {
        dao.db_insertAnswer(answer.id_submission, question.id_quest, value);
      }
    }
  }
};

const getAnswers = async (id_poll, manager_logged) => {
  const answers = await dao.db_getPollAnswers(id_poll, manager_logged);
  const answers_reduced = [];
  const indexes_answers = answers.map((x) => x.id_submission);

  const indexes_answers_uniq = indexes_answers.filter(
    (x, pos) => indexes_answers.indexOf(x) === pos
  );

  indexes_answers_uniq.forEach((x) => {
    const answ = answers.find((y) => y.id_submission == x);
    if (!answ) return [];
    const tmp = answers
      .filter((y) => y.id_submission == x)
      .map((z) => {
        return { id_quest: z.id_quest, value: z.value };
      });

    answers_reduced.push({
      id_submission: answ.id_submission,
      user: answ.user,
      questions: [...tmp],
    });
  });

  const answers_rereduced = answers_reduced.map((x) => {
    return { ...x, questions: [] };
  });

  answers_reduced.forEach((s, s_pos) => {
    const indexes_quest = s.questions.map((x) => x.id_quest);
    const indexes_quest_uniq = indexes_quest.filter(
      (x, pos) => indexes_quest.indexOf(x) === pos
    );
    indexes_quest_uniq.forEach((x, pos) => {
      const quest = s.questions.find((y) => y.id_quest == x);
      const tmp = s.questions
        .filter((y) => y.id_quest == x)
        .map((z) => z.value);
      answers_rereduced[s_pos].questions.push({
        id_quest: quest.id_quest,
        values: [...tmp],
      });
    });
  });

  return answers_rereduced;
};

app.get("/api/polls", (req, res) => {
  dao
    .db_getPollList(req.isAuthenticated() ? req.user.id : null)
    .then((polls) => {
      res.status(200).json(polls);
    })
    .catch((err) =>
      res.status(500).json({ errors: `Database error: ${err}.` })
    );
});

app.get(
  "/api/polls/:id/questions",
  [check("id").isInt({ min: 1 })],
  (req, res) => {
      getPollQuestions(req.params.id)
        .then((questions) => {
          res.status(200).json(questions);
        })
        .catch((err) =>
          res.status(500).json({
            errors: `Database errors: ${err}.`,
          })
        );
  }
);

app.get(
  "/api/polls/:id/answers",
  [isLoggedIn, check("id").isInt({ min: 1 })],
  (req, res) => {
      getAnswers(req.params.id, req.user.id)
        .then((questions) => {
          res.status(200).json(questions);
        })
        .catch((err) =>
          res.status(500).json({
            errors: `Database errors: ${err}.`,
          })
        );
  }
);

app.post(
  "/api/polls",
  [
    isLoggedIn,
    check("name").exists({ checkFalsy: true }).isString(),
    check("questions")
      .exists()
      .isArray()
      .custom((questions) => {
        if (questions.length === 0)
          throw new Error("Cannot create a poll without questions");
        if (
          questions
            .map((x) => x.position)
            .filter((v, i) => questions.map((x) => x.position).indexOf(v) === i)
            .length != questions.length
        )
          throw new Error("Cannot insert repeated positions");
        for (const question of questions) {
          if (typeof question.name !== "string")
            throw new Error("Question name is not a string");
          if (typeof question.closed !== "boolean")
            throw new Error(
              `Question ${question.name} closed is not a boolean`
            );
          if (Number.isNaN(question.min) || !Number.isInteger(question.min))
            throw new Error(`Question ${question.name} min is not an integer`);
          if (Number.isNaN(question.max) || !Number.isInteger(question.max))
            throw new Error(`Question ${question.name} max is not an integer`);
          if (
            Number.isNaN(question.position) ||
            !Number.isInteger(question.position)
          )
            throw new Error(
              `Question ${question.name} position is not an integer`
            );
          if (Array.isArray(question.options)) {
            for (const option of question.options) {
              if (typeof option !== "string" || option === "")
                throw new Error(
                  `Question ${question.name} option ${option} is not a string or void`
                );
            }
          } else {
            throw new Error(
              `Question ${question.name} options is not an array`
            );
          }

          if (question.closed) {
            if (
              question.max < question.min ||
              question.min < 0 ||
              question.max < 1
            )
              throw new Error(
                `Question ${question.name} min max values are not consistent with a close question`
              );
            if (
              question.options.length <= question.min || 
              question.options.length < question.max 
            )
              throw new Error(
                `Question ${question.name} min max values are not consistent with the number of options`
              );
            if (question.options.length > 10)
              throw new Error(
                `Question ${question.name} options are more than 10`
              );
            if (
              question.options.filter(
                (v, i) => question.options.indexOf(v) === i
              ).length != question.options.length
            )
              throw new Error(
                `Question ${question.name} options contain double values`
              );
          } else {
            if (question.min < 0 || question.min > 1 || question.max != 1)
              throw new Error(
                `Question ${question.name} min max values are not consistent with an open question`
              );
            if (question.options.length !== 0)
              throw new Error(
                `Question ${question.name} options length is not consistent with an open question, (it must be 0)`
              );
          }
        }
        return true;
      }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const poll = {
      name: req.body.name,
      questions: req.body.questions,
    };

    insertPoll(poll, req.user.id)
      .then((id) => res.status(201).json({ addedId: id }))
      .catch((err) =>
        res.status(503).json({
          errors: `Database error during the creation of task: ${err}.`,
        })
      );
  }
);

app.post(
  "/api/answers",
  [
    check("id_submission")
      .exists()
      .isInt({ min: 1 })
      .custom(async (id_submission) => {
        const answers = await dao.db_getAnswersBySubmissionId(id_submission);
        if (answers.length != 0)
          throw new Error("Same id_submission cannot be reused");
        return true;
      }),
    check("questions")
      .exists()
      .isArray()
      .custom(async (questions, { req }) => {
        for (const question of questions) {
          if (
            Number.isNaN(question.id_quest) ||
            !Number.isInteger(question.id_quest)
          )
            throw new Error(
              `Question ${question.id_quest} id_quest is not an integer`
            );

          if (Array.isArray(question.values)) {
            for (const value of question.values) {
              if (typeof value !== "string" || !value)
                throw new Error(
                  `Question ${question.id_quest} value is not a string or is a void string`
                );
            }
          } else {
            throw new Error(
              `Question ${question.id_quest} options is not an array`
            );
          }

          const rows = await dao.db_getQuestionById(question.id_quest);

          if (rows.length === 0)
            throw new Error(`Question ${question.id_quest} doesn't exist`);
          if (
            question.values.length < rows[0].min ||
            question.values.length > rows[0].max
          )
            throw new Error(
              `Question ${question.id_quest} options are  not consistent with question's min or max`
            );

          if (
            !rows[0].closed &&
            question.values.length > 0 &&
            question.values[0].length > 200
          ) {
            throw new Error(
              `Question ${question.id_quest} answer cannot exceed 200 chars`
            );
          }

          if (rows[0].closed) {
            await dao
              .db_getOptionsByQuestId(question.id_quest)
              .then((options) => {
                const questionOptions = options.map((o) => o.value_option);
                for (const value of question.values) {
                  if (!questionOptions.includes(value))
                    throw new Error(
                      `Question ${question.id_quest} values are not consistent with possible values for this question`
                    );
                }
              });
          }
        }
        const id_poll = await dao.db_getPollIdBySubmissionId(
          req.body.id_submission
        );
        await dao.db_getPollQuestionsUniq(id_poll).then((pollQuestions) => {
          const v1 = pollQuestions.map((x) => x.id).sort((a, b) => a - b);
          if (v1.length === 0) throw new Error(`Poll doesn't exist`);
          const v2 = questions.map((x) => x.id_quest).sort((a, b) => a - b);
          if (v1.length !== v2.length)
            throw new Error(
              ` Number of questions is not consistent with the poll`
            );
          for (let index = 0; index < v1.length; index++) {
            if (v1[index] !== v2[index])
              throw new Error(
                `There are some questions in the answer not included in the poll or repeated`
              );
          }
        });

        return true;
      }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const answer = {
      id_submission: req.body.id_submission,
      questions: req.body.questions,
    };

    insertAnswer(answer)
      .then((id) => res.status(201).end())
      .catch((err) =>
        res.status(503).json({
          errors: `Database error during the creation of task: ${err}.`,
        })
      );
  }
);

app.post(
  "/api/submissions",
  [
    check("id_poll").exists().isInt({ min: 1 }),
    check("name_user").exists({ checkFalsy: true }).isString(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    dao
      .db_createSubmission(req.body.name_user, req.body.id_poll)
      .then((id) => res.status(201).json({ submissionId: id }))
      .catch((err) =>
        res.status(503).json({
          errors: `Database error during the creation of task: ${err}.`,
        })
      );
  }
);

app.listen(port, () => {
  console.log(`Express server listening at http: //localhost:${port}`);
});
