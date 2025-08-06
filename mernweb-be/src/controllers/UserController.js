const UserService = require('../services/UserService');
const JwtService = require('../services/JwtService');
const User = require('../models/UserModel'); // cần để kiểm tra email đã tồn tại

const createUser = async (req, res) => {
    try {
        const { email, name, phone, password, confirmPassword, verifyCode, checkOnly } = req.body;

        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        const isCheckEmail = reg.test(email);

        if (checkOnly) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(200).json({
                    status: 'ERR',
                    message: 'Email đã tồn tại'
                });
            }
            return res.status(200).json({
                status: 'OK',
                message: 'Email hợp lệ và chưa tồn tại'
            });
        }

        if (!email || !name || !phone || !password || !confirmPassword) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Vui lòng nhập đầy đủ thông tin'
            });
        } else if (!isCheckEmail) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Email không hợp lệ'
            });
        } else if (password !== confirmPassword) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Mật khẩu và xác nhận mật khẩu không khớp'
            });
        } else if (!verifyCode) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Mã xác thực là bắt buộc'
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Email đã tồn tại'
            });
        }

        const response = await UserService.createUser(req.body);
        return res.status(200).json(response);

    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: 'Lỗi server',
            error: e.message
        });
    }
};


const loginUser = async (req,res) => {
    try {
        const { email, password } = req.body
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        const isCheckEmail = reg.test(email)
        if ( !email || !password ) {
            return res.status(200).json({
                status:'ERR',
                message:'The input is required'
            })
        }else if ( !isCheckEmail ){
            return res.status(200).json({
                status:'ERR',
                message:'The input is email'
            })
        }
        const respone = await UserService.loginUser(req.body)
        const { refresh_token, ...newRespone } = respone
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: false,
            samesite: 'strict'
        })
        return res.status(200).json(newRespone)
    } catch (e) {
        return res.status(404).json({
            message : e
        })
    }
}

const updateUser = async (req,res) => {
    try {
        const userId = req.params.id
        const data = req.body
        if ( !userId ){
            return res.status(200).json({
                status:'ERR',
                message:'The userId is required'
            })
        }
        const respone = await UserService.updateUser(userId, data)
        return res.status(200).json(respone)
    } catch (e) {
        return res.status(404).json({
            message : e
        })
    }
}

const deleteUser = async (req,res) => {
    try {
        const userId = req.params.id
        if ( !userId){
            return res.status(200).json({
                status:'ERR',
                message:'The userId is required'
            })
        }
        const respone = await UserService.deleteUser(userId)
        return res.status(200).json(respone)
    } catch (e) {
        return res.status(404).json({
            message : e
        })
    }
}

const deleteMany = async (req,res) => {
    try {
        const ids = req.body.ids
        if ( !ids){
            return res.status(200).json({
                status:'ERR',
                message:'The ids is required'
            })
        }
        const respone = await UserService.deleteManyUser(ids)
        return res.status(200).json(respone)
    } catch (e) {
        return res.status(404).json({
            message : e
        })
    }
}

const getAllUser = async (req,res) => {
    try {
        const respone = await UserService.getAllUser()
        return res.status(200).json(respone)
    } catch (e) {
        return res.status(404).json({
            message : e
        })
    }
}

const getDetailsUser = async (req,res) => {
    try {
        const userId = req.params.id
        if ( !userId){
            return res.status(200).json({
                status:'ERR',
                message:'The userId is required'
            })
        }
        const respone = await UserService.getDetailsUser(userId)
        return res.status(200).json(respone)
    } catch (e) {
        return res.status(404).json({
            message : e
        })
    }
}

const refreshToken = async (req,res) => {
    try {
        const token = req.cookies.refresh_token
        if ( !token ){
            return res.status(200).json({
                status:'ERR',
                message:'The token is required'
            })
        }
        const respone = await JwtService.refreshTokenJwtService(token)
        return res.status(200).json(respone)
    } catch (e) {
        return res.status(404).json({
            message : e
        })
    }
}

const logoutUser = async (req,res) => {
    try {
        res.clearCookie('refresh_token')
        return res.status(200).json({
            status: 'OK',
            message: 'logout successfully'
        })
    } catch (e) {
        return res.status(404).json({
            message : e
        })
    }
}

const sendVerifyCode = async (req, res) => {
    try {
      const { email } = req.body
      const response = await UserService.sendVerifyCode(email)
      return res.status(200).json(response)
    } catch (error) {
      return res.status(500).json({ status: 'ERR', message: error.message })
    }
  }
  
module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    refreshToken,
    logoutUser,
    deleteMany,
    sendVerifyCode
}
