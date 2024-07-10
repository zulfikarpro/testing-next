import React, { useEffect, useRef, useState } from "react";
import {  Divider, Row, Col } from "antd";
import { Layout, Breadcrumb, Statistic, Progress, Tag } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { DashboardLayout } from "@/layout";
import RecentTable from "@/components/RecentTable";
import { request } from "@/request";
import useOnFetch from "@/hooks/useOnFetch";
import { Bar, Doughnut,HorizontalBar,Line, Pie,LinearScale, PointElement, Tooltip, Legend, TimeScale } from "react-chartjs-2";

const TopCard = ({ title, tagContent, tagColor, prefix }) => {
  return (
    <Col className="gutter-row" span={6}>
      <div
        className="whiteBox shadow"
        style={{ color: "#595959", fontSize: 13, height: "106px" }}
      >
        <div
          className="pad5 strong"
          style={{ textAlign: "center", justifyContent: "center" }}
        >
          <h3 style={{ color: "#22075e", marginBottom: 0 }}>{title}</h3>
        </div>
        <Divider style={{ padding: 0, margin: 0 }}></Divider>
        <div className="pad15">
          <Row gutter={[0, 0]}>
            <Col
              className="gutter-row"
              span={11}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Tag
                color={tagColor}
                style={{ margin: "0 auto", justifyContent: "center" }}
              >
                {tagContent}
              </Tag>
            </Col>
          </Row>
        </div>
      </div>
    </Col>
  );
};
const PreviewState = ({ tag, color, value }) => {
  let colorCode = "#000";
  switch (color) {
    case "bleu":
      colorCode = "#1890ff";
      break;
    case "green":
      colorCode = "#95de64";
      break;
    case "red":
      colorCode = "#ff4d4f";
      break;
    case "orange":
      colorCode = "#ffa940";
      break;
    case "purple":
      colorCode = "#722ed1";
      break;
    case "grey":
      colorCode = "#595959";
      break;
    case "cyan":
      colorCode = "#13c2c2";
      break;
    case "brown":
      colorCode = "#614700";
      break;
    default:
      break;
  }
  return (
    <div style={{ color: "#595959", marginBottom: 5 }}>
      <div className="left alignLeft">{tag}</div>
      <div className="right alignRight">{value} %</div>
      <Progress
        percent={value}
        showInfo={false}
        strokeColor={{
          "0%": colorCode,
          "100%": colorCode,
        }}
      />
    </div>
  );
};
export default function Dashboard() {
  const [totalEmployees, setTotalEmployees] = useState()
  const [jobSatisfactionAvg, setJobSatisfactionAvg] = useState('Low')
  const [performanceScoreRating, setPerformanceScoreRating] = useState('Low')
  const [age,setAge] = useState({sumAge1830:0, sumAge3140:0, sumAge4150:0, sumAge5160:0})
  const [departments, setDepartements] = useState([])
  const [departmentAttrition, setDepartmentAttrition] = useState([])
  const [overtime, setOvertime] = useState([])
  const [overtimeAttrition, setOvertimeAttrition] = useState([])
  const [ departmentOvertime, setDepartementOvertime] = useState([])
  const [jobRolePromotion, setJobRolePromotion] = useState([])
  const [jobRole, setJobRole] = useState([])
  const { onFetch, result, isLoading, isSuccess,pagination } = useOnFetch();
  const [attrition, setAttrition] = useState({
    falseAttrition:0,
    falseAttritionPercentage:"0%",
    trueAttrition:0,
    trueAttritionPercentage:"%"
  })
  const [gender, setGender] = useState({
            male: 0,
            female: 0,
            malePercentage: "0%",
            femalePercentage: "0%"
        },)
  
  
  useEffect(()=>{
    const getFn = () => {
      return request.get("chartData")
    };
    onFetch(getFn)
  },[])
  useEffect(()=>{if(result){setupData(result)}},[isLoading])

  const setupData =(resultData)=>{
    setGender(resultData?.gender)
    setTotalEmployees(resultData?.totalData)
    setAttrition(resultData?.attrition)
    setJobSatisfactionAvg(resultData?.jobSatisfactionLevel)
    setPerformanceScoreRating(resultData?.performanceScoreRating)
    setAge(resultData?.age)
    setDepartements(resultData?.department)
    setDepartmentAttrition(resultData?.attritionDepartment)
    setOvertimeAttrition(resultData?.attritionOvertime)
    setDepartementOvertime(resultData?.overtimeByDepartment)
    setJobRolePromotion(resultData?.jobRoleLastPromotion)
    setJobRole(resultData?.jobRole)
  }

  useEffect(()=>{console.log('age',overtimeAttrition)},[overtimeAttrition])


  return (
    <DashboardLayout>
      <Row gutter={[24, 24]}>
        <TopCard
          title={"Total Employees"}
          tagColor={"cyan"}
          prefix={"This month"}
          tagContent={totalEmployees}
        />
        <TopCard
          title={"Attrition Rate"}
          tagColor={"purple"}
          prefix={"This month"}
          tagContent={attrition?.trueAttritionPercentage}
        />
        <TopCard
          title={"Avg Job Satisfaction"}
          tagColor={"green"}
          prefix={"This month"}
          tagContent={jobSatisfactionAvg}
        />
        <TopCard
          title={"Avg Performance"}
          tagColor={"red"}
          prefix={"Not Paid"}
          tagContent={performanceScoreRating}
        />
      </Row>
      <div className="space30"></div>
      <Row gutter={[24, 24]}>
        <Col className="gutter-row" span={18}>
          <div className="whiteBox shadow" style={{ height: "380px" }}>
            <Row className="pad10" gutter={[0, 0]}>
              <Col className="pad5">
                <div className="pad5">
                  <Doughnut data={ {
                    labels: [`Male \n ${gender.malePercentage}`, `Female \n ${gender.femalePercentage}`],
                    datasets: [
                    {
                      label: 'test',
                      color: ['#95de64'],
                      backgroundColor: ["#95de64","#ff4d4f"],
                      data: [gender.male, gender.female],
                    },
                  ]}}/>
                </div>
              </Col>
              <Col className="pad5">
              <div className="pad5">
                <HorizontalBar 
                options={{
                  plugins: {
                  legend: {
                    display: false,
                  },
                  tooltip: {
                    callbacks: {
                      label: function (data) {
                        return "Custom Label Text:" + data.formattedValue;
                      },
                    },
                  },
                },
              }}
                data={{
                labels: ['18-30', '31-40','41-50','51-60'],
                datasets:[
                  {
                    label: ['Age'],
                    backgroundColor: '#95de64',
                    borderColor: '#95de64',
                    borderWidth: 1,
                    hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                    hoverBorderColor: 'rgba(255,99,132,1)',
                    data: [age.sumAge1830, age.sumAge3140, age.sumAge4150, age.sumAge5160],
                    parsing: {
                      AxisKey: 'key',
                      yAxisKey: 'value'
                    }
                },
                ]}}
                />
              </div>
              </Col>
            </Row>
          </div>
        </Col>

        <Col className="gutter-row" span={6}>
          <div className="whiteBox shadow" style={{ height: "380px" }}>
           <div
              className="pad20"
            >
              <p>Work Overtime</p>
              <Bar
                width={"30%"}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                     xAxes: [{barThickness : 40,
                    gridLines: {
                      display:false,
                      drawOnChartArea: false,
                    },
                        stacked: true // this should be set to make the bars stacked
                     }],
                     yAxes: [{barThickness : 40,
                        stacked: true // this also..
                     }]
                  },
            
                  plugins: {
                    responsive: true,
                  legend: {
                    display: false,
                  },
                  tooltip: {
                    callbacks: {
                      label: function (data) {
                        return "Custom Label Text:" + data.formattedValue;
                      },
                    },
                  },
                },
              }}
                data={{
                labels: ['Yes','No'],
                datasets: [
                  {
                    label: "Yes",
                    data: overtimeAttrition.map(e=>e.attritionCount),
                    backgroundColor: '#95de64',
                  },
                  {
                    label: 'No',
                    data: overtimeAttrition.map(e=>e.noAttritionCount),
                    backgroundColor: '#ff4d4f',
                    
                  },
                ]
              }}
                />
            </div>
          </div> 
        </Col>
      </Row>
      <div className="space30"></div>
      <Row gutter={[24, 24]}>
        <Col className="gutter-row" span={12}>
          <div className="whiteBox shadow" style={{ textAlign: "center", alignItems:'center',justifyContent: "center", height: '380px' }}>
          <p>Attrition by Department</p>
          <Bar 
                options={{
                  scales: {
                     xAxes: [{
                        stacked: true // this should be set to make the bars stacked
                     }],
                     yAxes: [{
                        stacked: true // this also..
                     }]
                  },
            
                  plugins: {
                  legend: {
                    display: false,
                  },
                  tooltip: {
                    callbacks: {
                      label: function (data) {
                        return "Custom Label Text:" + data.formattedValue;
                      },
                    },
                  },
                },
              }}
                data={{
                labels: departments,
                datasets: [
                  {
                    label: "Yes",
                    data: departmentAttrition.map(e=>e.attritionCount),
                    backgroundColor: '#95de64',
                    // parsing: {
                    //   yAxisKey: 'net'
                    // }
                  },
                  {
                    label: 'No',
                    data: departmentAttrition.map(e=>e.noCount),
                    backgroundColor: '#ff4d4f',
                    
                  },
                ]
              }}
                />
          </div>
        </Col>
        <Col className="gutter-row" span={12}>
          <div className="whiteBox shadow" style={{ textAlign: "center", alignItems:'center',justifyContent: "center", height: '380px' }}>
          <p>Work Overtime by Department</p>
          <Bar 
                options={{
                  scales: {
                     xAxes: [{
                        // stacked: true // this should be set to make the bars stacked
                     }],
                     yAxes: [{
                        // stacked: true // this also..
                     }]
                  },
            
                  plugins: {
                  legend: {
                    display: false,
                  },
                  tooltip: {
                    callbacks: {
                      label: function (data) {
                        return "Custom Label Text:" + data.formattedValue;
                      },
                    },
                  },
                },
              }}
                data={{
                labels: departments,
                datasets: [
                  {
                    label: "Yes",
                    data: departmentOvertime.map(e=>e.overtimeCount),
                    backgroundColor: '#95de64',
                    // parsing: {
                    //   yAxisKey: 'net'
                    // }
                  },
                  {
                    label: 'No',
                    data: departmentOvertime.map(e=>e.noOvertimeCount),
                    backgroundColor: '#ff4d4f',
                    
                  },
                ]
              }}
                />
          </div>
        </Col>
      </Row>
      <div className="space30"></div>
      <Row gutter={[24, 24]}>
        
      <Col className="gutter-row" span={12}>
        <div className="whiteBox shadow" style={{ textAlign: "center", alignItems:'center',justifyContent: "center", height: '380px' }}>
        <p>Average Years Since Last Promotion</p>
          <HorizontalBar 
          options={{
            plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                label: function (data) {
                  return "Custom Label Text:" + data.formattedValue;
                },
              },
            },
          },
        }}
          data={{
          labels: jobRole,
          datasets:[
            {
              label: ['Years'],
              backgroundColor: '#95de64',
              borderColor: '#95de64',
              borderWidth: 1,
              hoverBackgroundColor: 'rgba(255,99,132,0.4)',
              hoverBorderColor: 'rgba(255,99,132,1)',
              data: jobRolePromotion.map(e=>e.average),
              parsing: {
                AxisKey: 'key',
                yAxisKey: 'value'
              }
          },
          ]}}
          />
        </div>
        </Col>
        <Col className="gutter-row" span={12}>
          <div className="whiteBox shadow" style={{ textAlign: "center", alignItems:'center',justifyContent: "center", height: '380px' }}>
        <Bar />
        </div>
      </Col>
      </Row>

      <Col className="gutter-row" span={12}>
        <div className="whiteBox shadow" style={{ textAlign: "center", alignItems:'center',justifyContent: "center", height: '380px' }}>
          <Line/>
        </div>
      </Col>
    </DashboardLayout>
  );
}
