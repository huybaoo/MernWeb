const User = require("../models/UserModel")
const bcrypt =  require("bcrypt");
const { genneralAccessToken, genneralRefreshToken } = require("./JwtService");
const nodemailer = require('nodemailer');

const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, password, confirmPassword, phone, verifyCode } = newUser

        try {
            const checkUser =  await User.findOne({
                email : email
            })
            if ( checkUser !== null){
                resolve({
                    status: 'ERR',
                    message: 'The email is already'
                })
            }
            
            if (VerificationCodeStore[email] !== verifyCode) {
                return resolve({
                  status: 'ERR',
                  message: 'Mã xác thực không chính xác hoặc đã hết hạn'
                })
              }
        
            delete VerificationCodeStore[email]

            const hash = bcrypt.hashSync(password,10)
            const createdUser = await User.create({
                name,
                email,
                password: hash,
                phone
            })
            if ( createdUser ){
                resolve({
                    status:'OK',
                    message:'SUCCESS',
                    data: createdUser
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

const loginUser = (userLogin) => {
    return new Promise(async (resolve, reject) => {
        const { email, password } = userLogin
        try {
            const checkUser =  await User.findOne({
                email : email
            })
            if ( checkUser === null){
                resolve({
                    status: 'ERR',
                    message: 'The email is not defined'
                })
            }
            const comparePassword = bcrypt.compareSync(password, checkUser.password)

            if ( !comparePassword ){
                resolve({
                    status: 'ERR',
                    message: 'The password or user is incorrect'
                })
            }

            const access_token = await genneralAccessToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })

            const refresh_token = await genneralRefreshToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })

            resolve({
                status:'OK',
                message:'SUCCESS',
                access_token,
                refresh_token
            })
        } catch (e) {
            reject(e)
        }
    })
}

const updateUser = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser =  await User.findOne({
                _id: id
            })
            if ( checkUser === null ){
                resolve({
                    status:'OK',
                    message:'The user is not defined'
                })
            }

            const updateUser = await User.findByIdAndUpdate(id, data, { new: true})

            resolve({
                status:'OK',
                message:'SUCCESS',
                data: updateUser
            })
        } catch (e) {
            reject(e) 
        }
    })
}

const deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser =  await User.findOne({
                _id: id
            })
            if ( checkUser === null ){
                resolve({
                    status:'OK',
                    message:'The user is not defined'
                })
            }

            await User.findByIdAndDelete(id)

            resolve({
                status:'OK',
                message:'DELETED USER',
            })
        } catch (e) {
            reject(e) 
        }
    })
}

const deleteManyUser = (ids) => {
    return new Promise(async (resolve, reject) => {
        try {
            await User.deleteMany({_id: ids})

            resolve({
                status:'OK',
                message:'DELETED USERS',
            })
        } catch (e) {
            reject(e) 
        }
    })
}

const getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allUser = await User.find()

            resolve({
                status:'OK',
                message:'SUCCESS',
                data: allUser
            })
        } catch (e) {
            reject(e) 
        }
    })
}

const getDetailsUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user =  await User.findOne({
                _id: id
            })
            if ( user === null ){
                resolve({
                    status:'OK',
                    message:'The user is not defined'
                })
            }

            resolve({
                status:'OK',
                message:'SUCCESS',
                data: user
            })
        } catch (e) {
            reject(e) 
        }
    })
}

const VerificationCodeStore = {} 

const sendVerifyCode = async (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      const code = Math.floor(100000 + Math.random() * 900000).toString()
      VerificationCodeStore[email] = code 


      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.MAIL_ACCOUNT,
          pass: process.env.MAIL_PASSWORD,
        },
      })
      await transporter.sendMail({
        from: process.env.MAIL_ACCOUNT,
        to: email,
        subject: 'MERNWEB | Mã xác nhận đăng ký',
        html: `<p>Mã xác thực của bạn là: <strong style="font-size: 24px;">${code}</strong>. Mã có hiệu lực trong 5 phút.</p>`
      })

      setTimeout(() => delete VerificationCodeStore[email], 300000)

      resolve({ status: 'OK', message: 'Mã xác nhận đã được gửi' })
    } catch (e) {
      reject(e)
    }
  })
}

module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    deleteManyUser,
    sendVerifyCode,
    VerificationCodeStore
}