"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");

module.exports = class extends Generator {
  async prompting() {
    this.answers = await this.prompt([
      {
        type: "input",
        name: "pennId",
        message: "Your PennID/Name:"
      },
      {
        type: "input",
        name: "courseName",
        message: "Course name:"
      },
      {
        type: "input",
        name: "homeworkNumber",
        message: "Homework number:"
      },
      {
        type: "confirm",
        name: "hasCollaborators",
        message: "Do you have collaborators? (y/n)"
      },
      {
        when: response => response.hasCollaborators,
        type: "input",
        name: "collaborators",
        message: "Collaborator names (comma separated):"
      }
    ]);
  }

  writing() {
    const {
      pennId,
      courseName,
      homeworkNumber,
      collaborators,
      hasCollaborators
    } = this.answers;
    // Read the template
    var template = this.fs.read(this.templatePath("hw-template.tex"));

    let collaboratorsString = "";
    let collaboratorsFormatted = "";
    if (hasCollaborators) {
      collaboratorsString = `{\\large Collaborators: \\MyCollaboratorCheck{\\CollaboratorNames}}\n`;
      collaboratorsFormatted = collaborators.split(",").join(", ");
    } else {
      // Pattern to find and remove the collaborators line
      const collaboratorsPattern = /{\\large Collaborators: \\MyCollaboratorCheck{\\CollaboratorNames}}\n?/;
      template = template.replace(collaboratorsPattern, "");
      collaboratorsFormatted = "";
    }

    let document = template
      .replace("PENNIDENTRY", pennId)
      .replace("XXENTRY", homeworkNumber)
      .replace("COURSEENTRY", courseName)
      .replace("COLLABORATORSENTRY", collaboratorsFormatted);
    // Additional placeholders like course name and user name can be added here
    if (collaboratorsString) {
      document = document.replace("COLLABORATORSENTRY", collaboratorsString);
    }
    // Write the document to a new LaTeX file

    this.fs.write(this.destinationPath(`hw-${homeworkNumber}.tex`), document);
  }

  install() {
    this.log("Generating LaTeX document...");
  }
};
