module.exports = {
  extends: ["@commitlint/config-conventional"],
  parserPreset: {
    parserOpts: {
      headerPattern: /^(AW|EB)-[0-9]+ \((\w+)(?:\/(\w+))?\): (.*)$/,
      headerCorrespondence: ["reference", "type", "scope", "subject"]
    }
  },
  rules: {
    "type-enum": [
      2,
      "always",
      ["build", "chore", "docs", "feat", "fix", "refactor", "revert", "style", "test", "merge"]
    ],
    "type-case": [2, "always", ["lower-case"]],
    "subject-max-length": [2, "always", 400],
    "subject-empty": [2, "never"],
    "subject-case": [0]
  }
};
