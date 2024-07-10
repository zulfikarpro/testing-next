const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const employeeSchema = new mongoose.Schema({
  Age :{type: Number, default: true},
  Attrition: {type: String, default: true},
  BusinessTravel: {type: String, default: true},
  DailyRate: {type: Number, default: true},
  Department: {type: String, default: true},
  DistanceFromHome: {type: Number, default: true},
  Education: {type: Number, default: true},
  EducationField: {type: String, default: true},
  EmployeeCount: {type: Number, default: true},
  EmployeeNumber: {type: Number, default: true},
  EnvironmentSatisfaction: {type: Number, default: true},
  Gender: {type: String, default: true},
  HourlyRate: {type: Number, default: true},
  JobInvolvement: {type: Number, default: true},
  JobLevel: {type: Number, default: true},
  JobRole: {type: String, default: true},
  JobSatisfaction: {type: Number, default: true},
  MaritalStatus: {type: String, default: true},
  MonthlyIncome: {type: Number, default: true},
  MonthlyRate: {type: Number, default: true},
  NumCompaniesWorked: {type: Number, default: true},
  Over18: {type: String, default: true},
  OverTime: {type: String, default: true},
  PercentSalaryHike: {type: Number, default: true},
  PerformanceRating: {type: Number, default: true},
  RelationshipSatisfaction: {type: Number, default: true},
  StandardHours: {type: Number, default: true},
  StockOptionLevel: {type: Number, default: true},
  TotalWorkingYears: {type: Number, default: true},
  TrainingTimesLastYear: {type: Number, default: true},
  WorkLifeBalance: {type: Number, default: true},
  YearsAtCompany: {type: Number, default: true},
  YearsInCurrentRole: {type: Number, default: true},
  YearsSinceLastPromotion: {type: Number, default: true},
  YearsWithCurrManager: {type: Number, default: true}
});

module.exports = mongoose.model("Employee", employeeSchema);
