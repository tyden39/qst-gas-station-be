const Branch = require("../models/branch.model")
const Company = require("../models/company.model")
const Invoice = require("../models/invoice.model")
const Store = require("../models/store.model")
const User = require("../models/user.model")
const moment = require("moment")

const initialData = async () => {
  const companyA = await Company.create({ name: "Company A" })
  const companyB = await Company.create({ name: "Company B" })

  const branch1 = await Branch.create({
    name: "Branch 1",
    companyId: companyA.id,
  })
  const branch2 = await Branch.create({
    name: "Branch 2",
    companyId: companyA.id,
  })
  const branch3 = await Branch.create({
    name: "Branch 3",
    companyId: companyB.id,
  })

  const store1 = await Store.create({
    name: "Store 1",
    branchId: branch1.id,
  })
  const store2 = await Store.create({
    name: "Store 2",
    branchId: branch2.id,
  })
  const store3 = await Store.create({
    name: "Store 3",
    branchId: branch2.id,
  })
  const store4= await Store.create({
    name: "Store 4",
    branchId: branch3.id,
  })
  const store5= await Store.create({
    name: "Store 5",
    branchId: branch3.id,
  })

  await User.create({
    username: "admin",
    password: "123",
    phone: "0987654321",
    email: "admin@gmail.com",
    firstName: "Admin",
    lastName: "",
    roles: ["000","001","002","003","004"]
  })
  await User.create({
    username: "user1",
    password: "123",
    companyId: companyA.id,
    phone: "0987654322",
    email: "user1@gmail.com",
    firstName: "Trần",
    lastName: "Thị B",
    roles: ["001","002","003","004"]
  })
  await User.create({
    username: "user2",
    password: "123",
    branchId: branch2.id,
    companyId: companyA.id,
    phone: "0987654323",
    email: "user2@gmail.com",
    firstName: "Lê",
    lastName: "Văn C",
    roles: ["002","003","004"]
  })
  await User.create({
    username: "user3",
    password: "123",
    storeId: store3.id,
    branchId: branch3.id,
    companyId: companyB.id,
    phone: "0987654324",
    email: "user3@gmail.com",
    firstName: "Phạm",
    lastName: "Thị D",
    roles: ["003","004"]
  })
  await User.create({
    username: "user4",
    password: "123",
    storeId: store3.id,
    branchId: branch3.id,
    companyId: companyB.id,
    phone: "0987654325",
    email: "user4@gmail.com",
    firstName: "Hoàng",
    lastName: "Văn E",
    roles: ["004"]
  })

  const invoices = [
    {
      Logger_ID: "01905969501",
      Check_Key: "T00R00K155528140524",
      Logger_Time: "14-05-2024 15-55-28",
      Pump_ID: 0,
      Bill_No: 1,
      Bill_Type: 1,
      Fuel_Type: "XĂNG RON 95 - III",
      Start_Time: "12-06-2024 16-51-21",
      End_Time: "12-06-2024 16-52-50",
      Unit_Price: 25740,
      Quantity: 0.545,
      Total_Price: 14020,
      storeId: store3.id
    },
    {
      Logger_ID: "01905969502",
      Check_Key: "T00R00K155528140525",
      Logger_Time: "14-05-2024 16-02-13",
      Pump_ID: 1,
      Bill_No: 2,
      Bill_Type: 1,
      Fuel_Type: "DẦU DO 0,05S - III",
      Start_Time: "12-06-2024 17-01-05",
      End_Time: "12-06-2024 17-02-12",
      Unit_Price: 22040,
      Quantity: 2.312,
      Total_Price: 50970,
      storeId: store3.id
    },
    {
      Logger_ID: "01905969503",
      Check_Key: "T00R00K155528140526",
      Logger_Time: "14-05-2024 16-15-38",
      Pump_ID: 2,
      Bill_No: 3,
      Bill_Type: 1,
      Fuel_Type: "XĂNG RON 95 - III",
      Start_Time: "12-06-2024 17-14-20",
      End_Time: "12-06-2024 17-15-37",
      Unit_Price: 25740,
      Quantity: 10.823,
      Total_Price: 278530,
      storeId: store3.id
    },
    {
      Logger_ID: "01905969504",
      Check_Key: "T00R00K155528140527",
      Logger_Time: "14-05-2024 16-23-17",
      Pump_ID: 3,
      Bill_No: 4,
      Bill_Type: 1,
      Fuel_Type: "DẦU DO 0,05S - III",
      Start_Time: "12-06-2024 17-22-01",
      End_Time: "12-06-2024 17-23-16",
      Unit_Price: 22040,
      Quantity: 18.456,
      Total_Price: 406870,
      storeId: store3.id
    },
    {
      Logger_ID: "01905969505",
      Check_Key: "T00R00K155528140528",
      Logger_Time: "14-05-2024 16-36-52",
      Pump_ID: 4,
      Bill_No: 1,
      Bill_Type: 1,
      Fuel_Type: "XĂNG RON 95 - III",
      Start_Time: "12-06-2024 17-35-43",
      End_Time: "12-06-2024 17-36-51",
      Unit_Price: 25740,
      Quantity: 5.689,
      Total_Price: 146570,
      storeId: store3.id
    },
    {
      Logger_ID: "01905969506",
      Check_Key: "T00R00K155528140529",
      Logger_Time: "14-05-2024 16-48-29",
      Pump_ID: 5,
      Bill_No: 1,
      Bill_Type: 1,
      Fuel_Type: "XĂNG E5 RON 92 - II",
      Start_Time: "12-06-2024 17-47-15",
      End_Time: "12-06-2024 17-48-28",
      Unit_Price: 24570,
      Quantity: 12.365,
      Total_Price: 304360,
      storeId: store3.id
    },
    {
      Logger_ID: "01905969507",
      Check_Key: "T00R00K155528140530",
      Logger_Time: "14-05-2024 16-59-05",
      Pump_ID: 6,
      Bill_No: 1,
      Bill_Type: 1,
      Fuel_Type: "DẦU DO 0,05S - III",
      Start_Time: "12-06-2024 17-57-58",
      End_Time: "12-06-2024 17-59-04",
      Unit_Price: 22040,
      Quantity: 25.987,
      Total_Price: 572740,
      storeId: store3.id
    },
    {
      Logger_ID: "01905969508",
      Check_Key: "T00R00K155528140531",
      Logger_Time: "14-05-2024 17-07-43",
      Pump_ID: 7,
      Bill_No: 1,
      Bill_Type: 1,
      Fuel_Type: "XĂNG RON 95 - III",
      Start_Time: "12-06-2024 18-06-32",
      End_Time: "12-06-2024 18-07-42",
      Unit_Price: 25740,
      Quantity: 32.145,
      Total_Price: 828470,
      storeId: store4.id
    },
    {
      Logger_ID: "01905969509",
      Check_Key: "T00R00K155528140532",
      Logger_Time: "14-05-2024 17-16-21",
      Pump_ID: 8,
      Bill_No: 1,
      Bill_Type: 1,
      Fuel_Type: "XĂNG E5 RON 92 - II",
      Start_Time: "12-06-2024 18-15-10",
      End_Time: "12-06-2024 18-16-20",
      Unit_Price: 24570,
      Quantity: 8.901,
      Total_Price: 218340,
      storeId: store4.id
    },
    {
      Logger_ID: "01905969510",
      Check_Key: "T00R00K155528140533",
      Logger_Time: "14-05-2024 17-28-56",
      Pump_ID: 9,
      Bill_No: 1,
      Bill_Type: 1,
      Fuel_Type: "DẦU DO 0,05S - III",
      Start_Time: "12-06-2024 18-27-49",
      End_Time: "12-06-2024 18-28-55",
      Unit_Price: 22040,
      Quantity: 41.568,
      Total_Price: 916020,
      storeId: store4.id
    },
    {
      Logger_ID: "01905969511",
      Check_Key: "T00R00K155528140534",
      Logger_Time: "14-05-2024 17-39-32",
      Pump_ID: 10,
      Bill_No: 1,
      Bill_Type: 1,
      Fuel_Type: "XĂNG RON 95 - III",
      Start_Time: "12-06-2024 18-38-25",
      End_Time: "12-06-2024 18-39-31",
      Unit_Price: 25740,
      Quantity: 15.478,
      Total_Price: 398110,
      storeId: store4.id
    },
    {
      Logger_ID: "01905969512",
      Check_Key: "T00R00K155528140535",
      Logger_Time: "14-05-2024 17-51-09",
      Pump_ID: 11,
      Bill_No: 2,
      Bill_Type: 2,
      Fuel_Type: "XĂNG E5 RON 92 - II",
      Start_Time: "12-06-2024 18-49-58",
      End_Time: "12-06-2024 18-51-08",
      Unit_Price: 24570,
      Quantity: 3.287,
      Total_Price: 80820,
      storeId: store4.id
    },
    {
      Logger_ID: "01905969513",
      Check_Key: "T00R00K155528140536",
      Logger_Time: "14-05-2024 18-03-44",
      Pump_ID: 12,
      Bill_No: 1,
      Bill_Type: 1,
      Fuel_Type: "DẦU DO 0,05S - III",
      Start_Time: "12-06-2024 18-02-37",
      End_Time: "12-06-2024 18-03-43",
      Unit_Price: 22040,
      Quantity: 38.296,
      Total_Price: 844050,
      storeId: store4.id
    },
    {
      Logger_ID: "01905969514",
      Check_Key: "T00R00K155528140537",
      Logger_Time: "14-05-2024 18-11-22",
      Pump_ID: 13,
      Bill_No: 1,
      Bill_Type: 1,
      Fuel_Type: "XĂNG RON 95 - III",
      Start_Time: "12-06-2024 18-10-11",
      End_Time: "12-06-2024 18-11-21",
      Unit_Price: 25740,
      Quantity: 21.753,
      Total_Price: 560500,
      storeId: store4.id
    },
    {
      Logger_ID: "01905969515",
      Check_Key: "T00R00K155528140538",
      Logger_Time: "14-05-2024 18-24-07",
      Pump_ID: 14,
      Bill_No: 1,
      Bill_Type: 1,
      Fuel_Type: "XĂNG E5 RON 92 - II",
      Start_Time: "12-06-2024 18-22-56",
      End_Time: "12-06-2024 18-24-06",
      Unit_Price: 24570,
      Quantity: 6.418,
      Total_Price: 157700,
      storeId: store4.id
    },
    {
      Logger_ID: "01905969516",
      Check_Key: "T00R00K155528140539",
      Logger_Time: "14-05-2024 18-32-53",
      Pump_ID: 15,
      Bill_No: 1,
      Bill_Type: 1,
      Fuel_Type: "DẦU DO 0,05S - III",
      Start_Time: "12-06-2024 18-31-42",
      End_Time: "12-06-2024 18-32-52",
      Unit_Price: 22040,
      Quantity: 52.804,
      Total_Price: 1163650,
      storeId: store2.id
    },
    {
      Logger_ID: "01905969517",
      Check_Key: "T00R00K155528140540",
      Logger_Time: "14-05-2024 18-45-28",
      Pump_ID: 0,
      Bill_No: 1,
      Bill_Type: 1,
      Fuel_Type: "XĂNG RON 95 - III",
      Start_Time: "12-06-2024 18-44-19",
      End_Time: "12-06-2024 18-45-27",
      Unit_Price: 25740,
      Quantity: 1.124,
      Total_Price: 28950,
      storeId: store2.id
    },
    {
      Logger_ID: "01905969518",
      Check_Key: "T00R00K155528140541",
      Logger_Time: "14-05-2024 18-53-16",
      Pump_ID: 1,
      Bill_No: 1,
      Bill_Type: 1,
      Fuel_Type: "XĂNG E5 RON 92 - II",
      Start_Time: "12-06-2024 18-52-07",
      End_Time: "12-06-2024 18-53-15",
      Unit_Price: 24570,
      Quantity: 19.543,
      Total_Price: 480620,
      storeId: store2.id
    },
    {
      Logger_ID: "01905969519",
      Check_Key: "T00R00K155528140542",
      Logger_Time: "14-05-2024 19-01-04",
      Pump_ID: 2,
      Bill_No: 1,
      Bill_Type: 1,
      Fuel_Type: "DẦU DO 0,05S - III",
      Start_Time: "12-06-2024 18-59-55",
      End_Time: "12-06-2024 19-01-03",
      Unit_Price: 22040,
      Quantity: 7.635,
      Total_Price: 168260,
      storeId: store2.id
    },
    {
      Logger_ID: "01905969520",
      Check_Key: "T00R00K155528140543",
      Logger_Time: "14-05-2024 19-08-42",
      Pump_ID: 3,
      Bill_No: 1,
      Bill_Type: 1,
      Fuel_Type: "XĂNG RON 95 - III",
      Start_Time: "12-06-2024 19-07-33",
      End_Time: "12-06-2024 19-08-41",
      Unit_Price: 25740,
      Quantity: 28.319,
      Total_Price: 729520,
      storeId: store2.id
    },
    {
      Logger_ID: "01905969521",
      Check_Key: "T00R00K155528140544",
      Logger_Time: "14-05-2024 19-19-18",
      Pump_ID: 4,
      Bill_No: 1,
      Bill_Type: 1,
      Fuel_Type: "XĂNG E5 RON 92 - II",
      Start_Time: "12-06-2024 19-18-09",
      End_Time: "12-06-2024 19-19-17",
      Unit_Price: 24570,
      Quantity: 9.854,
      Total_Price: 242180,
      storeId: store2.id
    },
    {
      Logger_ID: "01905969522",
      Check_Key: "T00R00K155528140545",
      Logger_Time: "14-05-2024 19-27-55",
      Pump_ID: 5,
      Bill_No: 1,
      Bill_Type: 1,
      Fuel_Type: "DẦU DO 0,05S - III",
      Start_Time: "12-06-2024 19-26-46",
      End_Time: "12-06-2024 19-27-54",
      Unit_Price: 22040,
      Quantity: 14.208,
      Total_Price: 313180,
      storeId: store2.id
    },
    {
      Logger_ID: "01905969523",
      Check_Key: "T00R00K155528140546",
      Logger_Time: "14-05-2024 19-36-33",
      Pump_ID: 6,
      Bill_No: 1,
      Bill_Type: 1,
      Fuel_Type: "XĂNG RON 95 - III",
      Start_Time: "12-06-2024 19-35-24",
      End_Time: "12-06-2024 19-36-32",
      Unit_Price: 25740,
      Quantity: 45.781,
      Total_Price: 1178240,
      storeId: store2.id
    },
    {
      Logger_ID: "01905969524",
      Check_Key: "T00R00K155528140547",
      Logger_Time: "14-05-2024 19-44-11",
      Pump_ID: 7,
      Bill_No: 4,
      Bill_Type: 4,
      Fuel_Type: "XĂNG E5 RON 92 - II",
      Start_Time: "12-06-2024 19-43-02",
      End_Time: "12-06-2024 19-44-10",
      Unit_Price: 24570,
      Quantity: 0.0,
      Total_Price: 0,
      storeId: store2.id
    },
    {
      Logger_ID: "01905969525",
      Check_Key: "T00R00K155528140548",
      Logger_Time: "14-05-2024 19-52-49",
      Pump_ID: 8,
      Bill_No: 1,
      Bill_Type: 1,
      Fuel_Type: "DẦU DO 0,05S - III",
      Start_Time: "12-06-2024 19-51-40",
      End_Time: "12-06-2024 19-52-48",
      Unit_Price: 22040,
      Quantity: 1.879,
      Total_Price: 41410,
      storeId: store1.id
    },
    {
      Logger_ID: "01905969526",
      Check_Key: "T00R00K155528140549",
      Logger_Time: "14-05-2024 19-58-26",
      Pump_ID: 9,
      Bill_No: 1,
      Bill_Type: 1,
      Fuel_Type: "XĂNG RON 95 - III",
      Start_Time: "12-06-2024 19-57-17",
      End_Time: "12-06-2024 19-58-25",
      Unit_Price: 25740,
      Quantity: 6.258,
      Total_Price: 161040,
      storeId: store1.id
    },
    {
      Logger_ID: "01905969527",
      Check_Key: "T00R00K155528140550",
      Logger_Time: "14-05-2024 20-06-14",
      Pump_ID: 10,
      Bill_No: 1,
      Bill_Type: 1,
      Fuel_Type: "XĂNG E5 RON 92 - II",
      Start_Time: "12-06-2024 20-05-05",
      End_Time: "12-06-2024 20-06-13",
      Unit_Price: 24570,
      Quantity: 34.962,
      Total_Price: 859310,
      storeId: store1.id
    },
    {
      Logger_ID: "01905969528",
      Check_Key: "T00R00K155528140551",
      Logger_Time: "14-05-2024 20-18-49",
      Pump_ID: 11,
      Bill_No: 1,
      Bill_Type: 1,
      Fuel_Type: "DẦU DO 0,05S - III",
      Start_Time: "12-06-2024 20-17-40",
      End_Time: "12-06-2024 20-18-48",
      Unit_Price: 22040,
      Quantity: 2.045,
      Total_Price: 45070,
      storeId: store1.id
    },
    {
      Logger_ID: "01905969529",
      Check_Key: "T00R00K155528140552",
      Logger_Time: "14-05-2024 20-26-37",
      Pump_ID: 12,
      Bill_No: 1,
      Bill_Type: 1,
      Fuel_Type: "XĂNG RON 95 - III",
      Start_Time: "12-06-2024 20-25-28",
      End_Time: "12-06-2024 20-26-36",
      Unit_Price: 25740,
      Quantity: 17.629,
      Total_Price: 453690,
      storeId: store1.id
    },
  ]

  invoices.forEach(async (invoice) => {
    const loggerTimeDate = moment(
      invoice.Logger_Time,
      "DD-MM-YYYY HH:mm:ss"
    ).toDate()
    const startTimeDate = moment(
      invoice.Start_Time,
      "DD-MM-YYYY HH:mm:ss"
    ).toDate()
    const endTimeDate = moment(invoice.End_Time, "DD-MM-YYYY HH:mm:ss").toDate()
    const createdInvoice = await Invoice.create({
      ...invoice,
      Logger_Time: loggerTimeDate,
      Start_Time: startTimeDate,
      End_Time: endTimeDate,
    })
  })

  console.log("Data inserted!")

  // const users = await User.findAll({
  //   include: [Branch, Company]
  // attributes: [
  //   'username',
  //   'firstName',
  //   'lastName',
  //   'email',
  //   'phone',
  //   'roles',
  //   'status',
  //   [Sequelize.literal('`Branch`.`name`'), 'branchName'],
  //   [Sequelize.literal('`Company`.`name`'), 'companyName']
  // ],
  // include: [{
  //   model: Branch,
  //   attributes: [] // Không cần lấy lại các thuộc tính của Branch
  // }, {
  //   model: Company,
  //   attributes: [] // Không cần lấy lại các thuộc tính của Company
  // }]
  // console.log(users.map(user => user.toJSON()))
}

module.exports = initialData