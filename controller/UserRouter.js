const express = require("express");
const bcrypt = require("bcrypt");
const Account = require("../models/AccountModel");

const Transaction = require('../models/TransactionModel')
const CheckLogin = require("../auth/CheckForUser");
const FirstTime = require("../auth/CheckFirstTime");
const currencyFormatter = require("currency-formatter");
const generator = require("generate-password");
const changePassValidator = require("../routers/validators/changePassValidator");
const { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
const Router = express.Router();
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ewallet.webnc@gmail.com",
    pass: "webnangcao",
  },
});
//profile
Router.get("/", CheckLogin, FirstTime, (req, res) => {
  let id = req.session.account._id;
  Account.findById(id, (err, data) => {
    return res.render("user", {
      fullname: data.fullname,
      email: data.email,
      phone: data.phone,
      address: data.address,
      birthday: data.birthday,
      idcard_front: "",
      idcard_back: "",
      account_balance: currencyFormatter.format(data.account_balance, {
        symbol: "đ",
        thousand: ",",
        precision: 1,
        format: "%v %s",
      }),
      status: data.status,
    });
  });
});
//Nạp tiền
Router.get("/addMoney", CheckLogin, FirstTime, (req, res) => {
  let user = req.session.account;
  Account.findById(user._id,function(err,data){
    if(data.status==0)
    {
      res.render("notactive",{
        fullname: user.fullname,
      })
    }
    else
    {
    res.render("addMoney", {
      error: "",
      fullname: user.fullname,
    });
    }
  })
});
Router.post("/addMoney", CheckLogin, FirstTime, (req, res) => {
  let id = req.session.account._id;
  let { numberCard, dateExp, cvv, money } = req.body;
  money = parseInt(money);
  Account.findById(id, (err, data) => {
    if (numberCard === "111111") {
      if (dateExp === "2022-10-10") {
        if (cvv === "411") {
          Account.findByIdAndUpdate(id, {
            account_balance: data.account_balance + money,
          })
            .then(() => {
              let transaction = new Transaction({
                username:data.username,
                money,
                kind:0,
                status_transation:0,
                

            });
              return transaction.save()
             
            }).then(()=>{
              return res.redirect("/user/addMoney?message=addmoneysuccess");
            })
            .catch((err) => {
              return res.render("addMoney", {
                error: err.message,
                fullname: data.fullname,
              });
            });
        } else {
          return res.render("addMoney", {
            error: "Sai mã cvv",
            fullname: data.fullname,
          });
        }
      } else {
        return res.render("addMoney", {
          error: "Sai ngày hết hạn",
          fullname: data.fullname,
        });
      }
    } else if (numberCard === "222222") {
      if (dateExp === "2022-11-11") {
        if (cvv === "443") {
          if (money > 1000000) {
            return res.render("addMoney", {
              error: "Chỉ được nạp tối đa 1 triệu",
              fullname: data.fullname,
            });
          } else {
            Account.findByIdAndUpdate(id, {
              account_balance: data.account_balance + money,
            })
              .then(() => {
                let transaction = new Transaction({
                  username:data.username,
                  money,
                  kind:0,
                  status_transation:1, // Nạp tiền mặc định là duyệt
  
              });
              return transaction.save()
                
              }).then(()=>{
                return res.redirect("/user/addMoney");
              })
              .catch((err) => {
                return res.render("addMoney", {
                  error: err.message,
                  fullname: data.fullname,
                });
              });
          }
        } else {
          return res.render("addMoney", {
            error: "Sai mã cvv",
            fullname: user.fullname,
          });
        }
      } else {
        return res.render("addMoney", {
          error: "Sai ngày hết hạn",
          fullname: user.fullname,
        });
      }
    } else if (numberCard === "333333") {
      if (dateExp === "2022-12-12") {
        if (cvv === "577") {
          return res.render("addMoney", {
            error: "Thẻ hết tiền",
            fullname: data.fullname,
          });
        } else {
          return res.render("addMoney", {
            error: "Sai mã cvv",
            fullname: data.fullname,
          });
        }
      } else {
        return res.render("addMoney", {
          error: "Sai ngày hết hạn",
          fullname: data.fullname,
        });
      }
    } else if (numberCard.length === 6) {
      return res.render("addMoney", {
        error: "Thẻ này không được hỗ trợ",
        fullname: data.fullname,
      });
    } else {
      return res.render("addMoney", {
        error: "Sai mã thẻ",
        fullname: data.fullname,
      });
    }
  });
});
//Rút tiền - bắt đầu
Router.get("/withdrawMoney", CheckLogin, FirstTime, (req, res) => {

  let user = req.session.account;
  Account.findById(user._id,function(err,data){
    if(data.status==0)
    {
      res.render("notactive",{
        fullname: user.fullname,
      })
    }
    else
    {
    res.render("withdrawMoney", {
      error: "",
      fullname: user.fullname,
    });
    }
  })
 
});

Router.post("/withdrawMoney", CheckLogin, FirstTime, (req, res) => {
  let id = req.session.account._id;
  let { numberCard, dateExp, cvv, money,note } = req.body;
  money = parseInt(money);

 
  Account.findById(id, (err, data) => {
    if (numberCard === "111111") {
      if (dateExp === "2022-10-10") {
        if (cvv === "411") {
          if (money > data.account_balance) {
            return res.render("withdrawMoney", {
              error: "Số dư không đủ",
              fullname: data.fullname,
            });
          } else if (money % 50 != 0) {
            return res.render("withdrawMoney", {
              error: "Số tiền rút phải là bội số của 50",
              fullname: data.fullname,
            });
          } else {
            Account.findByIdAndUpdate(id, {
              account_balance: data.account_balance - money - money * 0.05,
            })
              .then(() => {
                let transaction = new Transaction({
                  username:data.username,
                  money,
                  kind:2,
                  status_transation:0,
                  note,
                });
                return transaction.save()
                
              }).then(()=>{
                return res.redirect(
                  "/user/withdrawMoney?message=withdrawmoneysuccess"
                );
              })
              .catch((err) => {
                return res.render("withdrawMoney", {
                  error: err.message,
                  fullname: data.fullname,
                });
              });
          }
        } else {
          return res.render("withdrawMoney", {
            error: "Sai mã cvv",
            fullname: data.fullname,
          });
        }
      } else {
        return res.render("withdrawMoney", {
          error: "Sai ngày hết hạn",
          fullname: data.fullname,
        });
      }
    } else if (numberCard.length === 6) {
      return res.render("withdrawMoney", {
        error: "Thẻ này không được hỗ trợ",
        fullname: data.fullname,
      });
    } else {
      return res.render("withdrawMoney", {
        error: "Sai mã thẻ",
        fullname: data.fullname,
      });
    }
  });
});

// Rút tiền - kết thúc

//Chuyển tiền
Router.get("/transferMoney", CheckLogin, FirstTime, (req, res) => {
  let user = req.session.account;
  res.render("transferMoney", {
    fullname: user.fullname,
    phone: "",
    money: "",
    note: "",
    receiver: "",
    fee: "",
    nguoitra: "",
    OTP_code: "",
    error:'',
  });
});
let OTP_code_check = "";
let OTP_timecheck="";
Router.post("/transferMoney", CheckLogin, FirstTime, (req, res) => {
  let user = req.session.account;
  let id = req.session.account._id;
  let OTP_timecheck_curren=new Date().getTime();
  let { phone, money, note, receiver, fee, nguoitra, OTP_code } = req.body;
  let receiver_id,receiver_account_balance,receiver_email;
  money = parseInt(money);
  fee = (money / 100) * 5;
  fee = parseInt(fee);
  if (receiver === "Not found") {
    receiver = "";
  }
  if(phone==='' && money=== ""&&note=== ""&&receiver=== ""&&fee=== ""&& OTP_code=='')
  {
    return res.render("transferMoney", {
      fullname: user.fullname,
      phone: '',
      money: '',
      note: '',
      receiver: '',
      OTP_code:'',
      fee: fee,
      error:'Vui lòng nhập đủ thông tin.',
    });
  }
  else if(phone===user.phone)
  {
    return res.render("transferMoney", {
      fullname: user.fullname,
      phone: '',
      money: '',
      note: '',
      receiver: '',
      OTP_code:'',
      fee: fee,
      error:'Đây là số điện thoại của bạn! Hãy nhập số điện thoại của người nhận.',
    });
  }
  else if(user.account_balance<0)
  {
    return res.render("transferMoney", {
      fullname: user.fullname,
      phone: '',
      money: '',
      note: '',
      receiver: '',
      OTP_code:'',
      fee: fee,
      error:'Bạn không còn tiền trong tài khoản.',
    });
  }
  else if(user.account_balance<money)
  {
    return res.render("transferMoney", {
      fullname: user.fullname,
      phone: '',
      money: '',
      note: '',
      receiver: '',
      OTP_code:'',
      fee: fee,
      error:'Số dư của bạn không đủ thực hiện giao dịch.',
    });
  }
  Account.findOne({ phone:phone },(err,account) => {
    if (!account) {
      return res.render("transferMoney", {
        fullname: user.fullname,
        phone: '',
        money: '',
        note: '',
        receiver: '',
        OTP_code:'',
        fee: '',
        error:'Không tìm thấy người nhận!',
      });
    }
    
  // Account.findOne({ phone: phone }, (err, data) =>(receiver_id = data._id)); 
  // Account.findOne({ phone: phone }, (err, data) =>(receiver_account_balance = data.account_balance)); 
  // Account.findOne({ phone: phone }, (err, data) =>(receiver_email = data.email));
  }); 
  if (phone !== "" && money !== "" && note !== "" && receiver === "") {
    //check infor receiver
    Account.findOne({ phone: phone }, (err, data) => 
      {
        return res.render("transferMoney", {
          fullname: user.fullname,
          phone: phone,
          money: money,
          note: note,
          receiver:data.fullname,
          OTP_code:'',
          fee: fee,
          error:'',
        });
      });
  } else if (phone !== "" && money !== "" && note !== "" && receiver !== "" &&
OTP_code === "") 
{
    //button get OTP
    OTP_code_check = generator.generate({
      //Tự tạo OTP
      length: 6,
      numbers: true,
    });
    OTP_timecheck= new Date().getTime();
    var mailOptions = {
      from: "ewallet.webnc@gmail.com",
      to: user.email,
      subject: "OTP chuyển tiền E-Wallet",
      text:
        "Người nhận: " +
        receiver +
        "\nSố tiền: " +
        money +" VND."+
        "\nMã OTP: " +
        OTP_code_check+
        "\nLưu ý: Mã OTP chỉ có hiệu lực trong vòng một phút."
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      }
    });
    return res.render("transferMoney", {
      fullname: user.fullname,
      phone: phone,
      money: money,
      note: note,
      receiver: receiver,
      error:'',
      fee: fee,
      OTP_code:OTP_code_check,
    });
  } else if (phone !== "" && money !== "" && note !== "" && receiver !== "" &&
OTP_code !== "" && fee!=='') {
  //xác nhận giao dịch
    let time = (OTP_timecheck_curren - OTP_timecheck)/1000;
    if (OTP_code === OTP_code_check && time<61) {
      let account_balance_after,receiver_account_balance_after;
      let time = new Date().toISOString();
      if(nguoitra=='nguoichuyentra')
      {
        account_balance_after = user.account_balance - money - fee;
        //receiver_account_balance_after = receiver_account_balance + money;
      }
      else if(nguoitra=='nguoinhantra')
      {
        account_balance_after = user.account_balance - money;
        //receiver_account_balance_after = receiver_account_balance + money - fee;
      }
      if(money>5000000)
      {
        let transaction = new Transaction({
          username:user.username,
          time:Date.parse(time),
          money:money,
          kind:0,
          status_transation:1,
          note:note,
        });
        transaction.save();
        var mailOptions = {
          from: "ewallet.webnc@gmail.com",
          to: user.email,
          subject: "Chờ duyệt giao dịch E-Wallet",
          text:
            "Tài khoản của bạn " +
            user.fullname +
            "\nVừa chuyển: " +
            money +" VND."+
            "\nTrạng thái: Chờ duyệt"+
            "\nNgày giao dich: "+time+".",
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          }
        });
        return res.redirect('/user/transferMoney' + '?message=transferMoneychoduyet');
      }
      else
      {
        //update balance 
        Account.findByIdAndUpdate(id, {
          account_balance: account_balance_after,
        })
          .then(() => {
            let transaction = new Transaction({
              username:user.username,
              money,
              kind:0,
              status_transation:0,
              note:note,
            });
            return transaction.save()
          })
          .then(()=>{
            var mailOptions = {
              from: "ewallet.webnc@gmail.com",
              to: user.email,
              subject: "Giao dịch thành công E-Wallet",
              text:
                "Tài khoản của bạn " +
                user.fullname +
                "\nVừa chuyển: " +
                money +" VND."+
                "\nSố dư: " +
                account_balance_after+" VND."+
                "\nNgày giao dich: "+time+".",
            };
            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                console.log(error);
              }
            });
          })
          .catch((err)=>{
            return res.render("transferMoney", {
              fullname: user.fullname,
              error:"Lỗi cập nhật số dư người gửi!",
              phone: '',
              money: '',
              note: '',
              receiver: '',
              OTP_code:'',
              fee: '',
            });
          });
          
          //update balance receiver
          if(nguoitra=='nguoichuyentra')
          {
            Account.findOneAndUpdate({phone:phone},(err,data)=> {
              account_balance: data.account_balance+money;
            })
            .then(()=>{
              var mailOptions = {
                from: "ewallet.webnc@gmail.com",
                to: receiver_email,
                subject: "Giao dịch thành công E-Wallet",
                text:
                  "Tài khoản của bạn " +
                  receiver +
                  "\nVừa nhận: " +
                  money +" VND."+
                  "\nTừ: " +
                  user.fullname+" VND."+
                  "\nSố dư: " +
                  receiver_account_balance_after+" VND."+
                  "\nNgày giao dich: "+time+".",
              };
              transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                  console.log(error);
                }
              });
            })
            .catch((err)=>{
              return res.render("transferMoney", {
                fullname: user.fullname,
                error:"Lỗi cập nhật số dư người nhận!",
                phone: '',
                money: '',
                note: '',
                receiver: '',
                OTP_code:'',
                fee: '',
              });
            });
          }
          else if(nguoitra=='nguoinhantra')
          {
            Account.findOneAndUpdate({phone:phone},(err,data)=> {
              account_balance: data.account_balance+money-fee;
            })
            .then(()=>{
              var mailOptions = {
                from: "ewallet.webnc@gmail.com",
                to: receiver_email,
                subject: "Giao dịch thành công E-Wallet",
                text:
                  "Tài khoản của bạn " +
                  receiver +
                  "\nVừa nhận: " +
                  money +" VND."+
                  "\nTừ: " +
                  user.fullname+" VND."+
                  "\nSố dư: " +
                  receiver_account_balance_after+" VND."+
                  "\nNgày giao dich: "+time+".",
              };
              transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                  console.log(error);
                }
              });
            })
            .catch((err)=>{
              return res.render("transferMoney", {
                fullname: user.fullname,
                error:"Lỗi cập nhật số dư người nhận!",
                phone: '',
                money: '',
                note: '',
                receiver: '',
                OTP_code:'',
                fee: '',
              });
            });
          }
          return res.redirect('/user/transferMoney' + '?message=transferMoneySuccess');
      }
    } else {
      res.render("transferMoney", {
        fullname: user.fullname,
        error:"Mã OTP sai hoặc quá hạn!",
        phone: '',
        money: '',
        note: '',
        receiver: '',
        OTP_code:'',
        fee: '',
      });
    }
  } else {
    //not infor
    return res.render("transferMoney", {
      fullname: user.fullname,
      phone: "",
      money: "",
      note: "",
      fee: "",
      receiver: "",
      OTP_code: "",
      error:'Vui lòng nhập đủ thông tin.'
    });
  }
});
//Mua thẻ cào
Router.get("/buyCard", CheckLogin, FirstTime, (req, res) => {
  let user = req.session.account;
  res.render("buyCard", { fullname: user.fullname });
});
//Xem lịch sử giao dịch - bắt đầu
Router.get("/history", CheckLogin, (req, res) => {
  let user = req.session.account;
  Account.findById(user._id,function(err,data){
    if(data.status==0)
    {
      res.render("notactive",{
        fullname: user.fullname,
      })
    }
    else
    {
      Transaction.find({}).then((his) => {
        res.render("history", { his: his,
           fullname: user.fullname,
        });
      });
    }
  })

 
});
//Xem chi tiết giao dịch
Router.get('/detailhistory/:id', CheckLogin, (req, res) => {
  Transaction.findById(req.params.id, function(err, transaction) {
      res.render('detailhistory', {
          transaction,fullname: transaction.fullname,
      });
  });
});
// Xem lịch sử giao dịch - kết thúc
//Đổi mật khẩu
Router.get("/changePassworduser", CheckLogin, FirstTime, (req, res) => {
  let user = req.session.account;
  res.render("changePassworduser", { error: "", fullname: user.fullname });
});
Router.post("/changePassworduser", changePassValidator, (req, res) => {
  let user = req.session.account;
  let { oldpass, confirm1, confirm2 } = req.body;
  let result = validationResult(req);
  if (result.errors.length === 0) {
    if (req.session.account) {
      if (bcrypt.compareSync(oldpass, user.password)) {
        if (confirm1 === confirm2) {
          bcrypt
            .hash(confirm2, 10)
            .then((hashed) => {
              Account.findByIdAndUpdate(req.session.account._id, {
                password: hashed,
              }).then(() => {
                return res.redirect("/user/changePassworduser");
              });
            })
            .catch((err) => {
              return res.render("changePassworduser", {
                error: err.message,
              });
            });
        } else {
          return res.render("changePassworduser", {
            error: "Mật khẩu không khớp",
            fullname: user.fullname,
          });
        }
      } else {
        return res.render("changePassworduser", {
          error: "Mật khẩu cũ không đúng",
          fullname: user.fullname,
        });
      }
    } else {
      res.redirect("/");
    }
  } else {
    let messages = result.mapped();
    let message = "";
    for (m in messages) {
      message = messages[m].msg;
      break;
    }
    res.render("changePassworduser", {
      error: message,
      fullname: user.fullname,
    });
  }
});
//Logout
Router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

//up hình bổ sung profile
const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
var upload = multer({ storage: storage });
var multipleUpload = upload.fields([
  { name: "idcard_front" },
  { name: "idcard_back" },
]);

Router.post("/updateprofile", multipleUpload, (req, res) => {
  var today = new Date()
  let {
    idcard_front = req.files.idcard_front[0].originalname,
    idcard_back = req.files.idcard_back[0].originalname,
  } = req.body;
  if (req.session.account) {
    Account.findByIdAndUpdate(req.session.account._id, {
      idcard_front: idcard_front,
      idcard_back: idcard_back,
      status: 0,
      date_register:today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear()+' '
      +today.getHours()+":"+today.getMinutes()+":"+today.getSeconds()
  
    }).then(() => {
      return res.redirect("/user");
    });
  } else {
    res.redirect("/user");
  }
});


module.exports = Router;
