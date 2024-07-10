const mongoose = require("mongoose");
const employeeSchema = mongoose.model("Employee");



exports.chartData = async(req,res)=>{
    console.log('tyest')
    const totalData = await employeeSchema.countDocuments({})
    const trueAttrition = await employeeSchema.countDocuments({"Attrition": "Yes"})
    const male = await employeeSchema.countDocuments({"Gender": "Male"})
    const malePercentage =  Math.round(male/totalData*100).toFixed(2)
    const attritionPercentage = Math.round(trueAttrition/totalData*100).toFixed(2)
    const gender = {male, female: totalData-male, malePercentage: `${malePercentage}%`, femalePercentage: `${Math.round(100-malePercentage).toFixed(2)}%`}
    const attrition = {trueAttrition, falseAttrition: totalData-trueAttrition, trueAttritionPercentage: `${attritionPercentage}%`, falseAttritionPercentage: `${Math.round(100-attritionPercentage).toFixed(2)}%`}
    // const sumJobSatisfaction = await employeeSchema.aggregate([{ $match: { JobSatisfatction}}])
    const sumJobSatisfaction = await employeeSchema.aggregate([
        { $group: { _id: null, amount: { $sum: "$JobSatisfaction" } } }
    ])
    const averageJobSatisfaction = sumJobSatisfaction[0].amount/totalData
    const sumPerformanceRating = await employeeSchema.aggregate([{ $group: { _id: null, amount: { $sum: "$PerformanceRating" } } }])
    const averagePerformanceRating = sumPerformanceRating[0].amount/totalData
    const sumAge1830 = await employeeSchema.aggregate([
        { $match: { Age: {$gte: 18, $lte: 30} } },
        { $group: { _id: null, count: { $sum: 1 } } }
    ])
    const sumAge3140 = await employeeSchema.aggregate([
        { $match: { Age: {$gte: 31, $lte: 40} } },
        { $group: { _id: null, count: { $sum: 1 } } }
    ])
    const sumAge4150 = await employeeSchema.aggregate([
        { $match: { Age: {$gte: 41, $lte: 50} } },
        { $group: { _id: null, count: { $sum: 1 } } }
    ])
    const sumAge5160 = await employeeSchema.aggregate([
        { $match: { Age: {$gte: 51, $lte: 60} } },
        { $group: { _id: null, count: { $sum: 1 } } }
    ])
    const department = await employeeSchema.distinct("Department")
    let attritionDepartment = [];
    for (const dep of department) {
        const contents = await employeeSchema.aggregate([
                            { $match: { Department: dep, Attrition: 'Yes' } },
                            { $group: { _id: null, count: { $sum: 1 } } }
                        ]) 
        
        const noContent = await employeeSchema.aggregate([
            { $match: { Department: dep, Attrition: 'No' } },
            { $group: { _id: null, count: { $sum: 1 } } }
        ]) 
        attritionDepartment.push({department: dep, attritionCount: contents[0].count, noCount: noContent[0].count})
      }
    const overTime = ['Yes', 'No']
    let attritionOvertime = [];
    for(const over of overTime){
        const yes = await employeeSchema.aggregate([
            { $match: { OverTime: over, Attrition: 'Yes' } },
            { $group: { _id: null, count: { $sum: 1 } } }
        ])
        const no = await employeeSchema.aggregate([
            { $match: { OverTime: over, Attrition: 'No' } },
            { $group: { _id: null, count: { $sum: 1 } } }
        ])
            
        attritionOvertime.push({overTime: over, attritionCount: yes[0].count, noAttritionCount: no[0].count})
    }
    let overtimeByDepartment = [];
    for( const dep of department){
        const overtime = await employeeSchema.aggregate([
            { $match: { Department: dep, OverTime: 'Yes' } },
            { $group: { _id: null, count: { $sum: 1 } } }
        ]) 

        const noOvertime = await employeeSchema.aggregate([
            { $match: { Department: dep, OverTime: 'No' } },
            { $group: { _id: null, count: { $sum: 1 } } }
        ]) 
        overtimeByDepartment.push({department: dep, overtimeCount: overtime[0].count, noOvertimeCount: noOvertime[0].count})
    }

    const jobRole = await employeeSchema.distinct("JobRole")
    let jobRoleLastPromotion = [];
    console.log(jobRole)
    for(const role of jobRole){
        const sum = await employeeSchema.aggregate([{$match:{JobRole: role}},{ $group: { _id: null, count: { $sum: "$YearsSinceLastPromotion" } } }])
        const count = await employeeSchema.aggregate([{$match:{JobRole: role}},{ $group: { _id: null, count: { $sum: 1 } } }])
        jobRoleLastPromotion.push({jobRole: role, sumYears: sum[0].count, average: sum[0].count/count[0].count})
    }

    let monthlyIncomeByDepartment = [];
    for(const dep of department){
        const min = await employeeSchema.aggregate([{$match: {Department: dep}}, {$sort: {"MonthlyIncome": -1}},{$limit: 1}, {$project:{_id:null, min:'$MonthlyIncome'}}])
        console.log(dep, min)
    }

    
    
    return res.status(200).json({success:true, result:{
        gender,
        attrition,
        totalData, 
        department,
        jobSatisfactionLevel:jobSatisfactionScoreRating(averageJobSatisfaction),
        performanceScoreRating:performanceScoreRating(averagePerformanceRating),
        age:{sumAge1830: sumAge1830[0].count,sumAge3140:sumAge3140[0].count, sumAge4150:sumAge4150[0].count,sumAge5160:sumAge5160[0].count},
        attritionDepartment,
        overTime,
        attritionOvertime,
        overtimeByDepartment,
        jobRole,
        jobRoleLastPromotion
    },
    message:"success"}).end()
}

const performanceScoreRating = (score) => {
    if(score<2){
        return 'Low'
    }
    else if(score>3.0 && score< 4.1){
        return 'High'
    } 
    else if(score>4.0){
        return 'Highest'
    }else {
        return 'Medium'
    }
}
const jobSatisfactionScoreRating = (score) =>{
    if(score<2){
        return 'Low'
    }else if(score>3.1){
        return 'High'
    } else {
        return 'Medium'
    }
}