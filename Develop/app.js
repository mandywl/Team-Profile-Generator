const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");
const render = require("./lib/htmlRenderer");

// Use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

function promptUser(questions) {
  return inquirer.prompt(questions);
}

function validateEmail(email) {
  var re = /(.+)@(.+){2,}\.(.+){2,}/;
  return (
    re.test(String(email).toLowerCase()) ||
    "Please enter a valid email address!"
  );
}

function validateName(name) {
  var reg = /^[A-Za-z\'\s\.\,]+$/;
  return reg.test(name) || "Please enter a valid name!";
}

function validatePhoneNumber(manager_officeNumber) {
  var reg = /[-. +]?([0-9])$/;
  return reg.test(manager_officeNumber) || "Please enter a valid phone number!";
}

function validateNumberOfPeople(numberOfPeople) {
  var reg = /^\d+$/;
  return reg.test(numberOfPeople) || "Please enter a valid number!";
}

function validateGitHub(gitHub) {
  return gitHub !== "" || "Please enter a GitHub username!";
}

function validateSchool(school) {
  return school !== "" || "Please enter a school!";
}

const teamManagerQuestions = [
  {
    type: "input",
    name: "manager_name",
    message: "What's the team manager's name?",
    validate: validateName,
  },
  {
    type: "input",
    name: "manager_email",
    message: "What is the team manager's email",
    validate: validateEmail,
  },
  {
    type: "input",
    name: "manager_officeNumber",
    message: "What is the team manager's office number?",
    validate: validatePhoneNumber,
  },
];

const numberOfTeamMembers = [
  {
    type: "input",
    name: "numberOfPeople",
    message: "How many people in your team?",
    validate: validateNumberOfPeople,
  },
];

const teamMemberQuestions = [
  {
    type: "list",
    name: "role",
    message: "What's the next team member's role?",
    choices: ["Engineer", "Intern"],
  },
  {
    type: "input",
    name: "name",
    message: "What's the next team member's name?",
    validate: validateName,
  },
  {
    type: "input",
    name: "email",
    message: "What's the team member's email?",
    validate: validateEmail,
  },
  {
    type: "input",
    name: "gitHub",
    message: "What's the team member's GitHub username?",
    when: (answers) => answers.role === "Engineer",
    validate: validateGitHub,
  },
  {
    type: "input",
    name: "school",
    message: "What school is team member attending?",
    when: (answers) => answers.role === "Intern",
    validate: validateSchool,
  },
];

async function init() {
  try {
    const answerTeamManager = await promptUser(teamManagerQuestions);
    const managerResponseData = new Manager(
      answerTeamManager.manager_name,
      1,
      answerTeamManager.manager_email,
      answerTeamManager.manager_officeNumber
    );
    let teamResponseData;
    let teamID = 2;
    var teamArray = [managerResponseData];
    const answerNumberOfPeople = await promptUser(numberOfTeamMembers);
    for (var i = 0; i < answerNumberOfPeople.numberOfPeople; i++) {
      const answerTeamMember = await promptUser(teamMemberQuestions);
      switch (answerTeamMember.role) {
        case "Engineer":
          teamResponseData = new Engineer(
            answerTeamMember.name,
            teamID,
            answerTeamMember.email,
            answerTeamMember.gitHub
          );
          teamArray.push(teamResponseData);
          teamID++;
          break;
        case "Intern":
          teamResponseData = new Intern(
            answerTeamMember.name,
            teamID,
            answerTeamMember.email,
            answerTeamMember.school
          );
          teamArray.push(teamResponseData);
          teamID++;
          break;
      }
    }
    fs.writeFileSync(outputPath, render(teamArray));
    console.log("Please check out ./output/team.html");
  } catch (err) {
    console.log(err);
  }
}

init();
