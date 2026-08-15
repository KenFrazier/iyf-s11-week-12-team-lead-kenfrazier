let issues = [
  {
    id: 1,
    title: "Broken water pipe on Main Street",
    description: "Water has been leaking for two days near the market.",
    reportedBy: "Frazier Kennedy",
    status: "reported",
    createdAt: "2026-01-15T10:00:00Z"
  },
  {
    id: 2,
    title: "Streetlight not working near school",
    description: "The streetlight has been off for a week, unsafe for children.",
    reportedBy: "Ronn Karimi",
    status: "acknowledged",
    createdAt: "2026-01-16T14:30:00Z"
  }
];

let comments = [
  { id: 1, issueId: 2, author: "Village Elder", text: "Noted, plumber has been notified.", createdAt: "2026-01-16T15:00:00Z" }
];

let users = [
  { id: 1, name: "Frazier Kennedy", email: "frazier@communityhub.com", role: "admin" },
  { id: 2, name: "Ronn Karimi", email: "ronn@communityhub.com", role: "citizen" },
  { id: 3, name: "Alvan Ninjago", email: "alvan@communityhub.com", role: "citizen" }
];

let nextIssueId = 3;
let nextCommentId = 2;
let nextUserId = 4;

module.exports = {
  issues,
  comments,
  users,
  getNextIssueId: () => nextIssueId++,
  getNextCommentId: () => nextCommentId++,
  getNextUserId: () => nextUserId++
};
