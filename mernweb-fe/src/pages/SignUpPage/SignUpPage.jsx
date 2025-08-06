// File: SignUpPage.jsx
import React, { useEffect, useState } from "react";
import {
  WrapperContainerLeft,
  WrapperContainerRight,
  WrapperTextLight,
} from "../SignInPage/style";
import InputForm from "../../components/InputForm/InputForm";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import imageLogo from "../../assets/images/logo-login.png";
import { Image } from "antd";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import * as UserService from "../../services/UserService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import Loading from "../../components/LoadingComponent/LoadingComponent";
import * as message from "../../components/Message/Message";
import ToastAddToCart from "../../components/ToastAddToCart/ToastAddToCart";

const SignUpPage = () => {
  const navigate = useNavigate();

  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [step, setStep] = useState("form");
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);

  const mutation = useMutationHooks((data) => UserService.signupUser(data));
  const { data, isLoading, isSuccess, isError } = mutation;

  useEffect(() => {
    if (isSuccess && data?.status !== "ERR") {
        setToast({ type: 'success', message: 'Đăng ký tài khoản thành công' });
        setTimeout(() => navigate("/sign-in"), 1500);
      } else if (isError || data?.status === "ERR") {
        setToast({ type: 'error', message: data?.message || "Đăng ký thất bại" });
      }      
  }, [isSuccess, isError, data, navigate]);

  const validateInputs = async () => {
    const newErrors = {};
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

    if (!email) newErrors.email = "Email không được để trống";
    else if (!emailRegex.test(email)) newErrors.email = "Email không hợp lệ";

    if (!name) newErrors.name = "Tên không được để trống";
    if (!phone) newErrors.phone = "Số điện thoại không được để trống";
    if (!password) newErrors.password = "Mật khẩu không được để trống";
    if (!confirmPassword) newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    else if (password !== confirmPassword) newErrors.confirmPassword = "Mật khẩu không khớp";

    if (!newErrors.email) {
      const checkEmail = await UserService.signupUser({ email, checkOnly: true });
      if (checkEmail?.status === "ERR") newErrors.email = "Email đã tồn tại trong hệ thống";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFirstSubmit = async () => {
    const isValid = await validateInputs();
    if (!isValid) return;

    const res = await UserService.sendVerifyCode({ email });
    if (res.status === "OK") {
        setToast({ type: 'success', message: 'Đã gửi mã xác nhận vào email của bạn' });
        setFormData({ email, name, phone, password, confirmPassword });
        setStep("verify");
      } else {
        setToast({ type: 'error', message: 'Gửi mã xác thực thất bại' });
      }
    };

  const handleVerifyAndRegister = () => {
    if (!verifyCode) return message.error("Vui lòng nhập mã xác thực");
    const payload = { ...formData, verifyCode };
    mutation.mutate(payload);
  };

  const handleNavigateLogin = () => navigate("/sign-in");

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 2500);
  
      return () => clearTimeout(timer);
    }
  }, [toast]);  

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.53)",
        height: "100vh",
      }}
    >
        {toast && (
            <ToastAddToCart
                type={toast.type}
                message={toast.message}
                onClose={() => setToast(null)}
            />
        )}
      <div
        style={{
          display: "flex",
          width: "800px",
          height: "530px",
          borderRadius: "6px",
          background: "#fff",
        }}
      >
        <WrapperContainerLeft>
          <h1>Xin chào</h1>
          <p>Tạo tài khoản</p>

          {step === "form" ? (
            <>
              <InputForm
                placeholder="abc@gmail.com"
                value={email}
                onChange={setEmail}
                style={{ marginBottom: "10px" }}
              />
              {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}

              <InputForm
                placeholder="Tên của bạn"
                value={name}
                onChange={setName}
                style={{ marginBottom: "10px" }}
              />
              {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}

              <InputForm
                placeholder="Số điện thoại"
                value={phone}
                onChange={setPhone}
                style={{ marginBottom: "10px" }}
              />
              {errors.phone && <p style={{ color: "red" }}>{errors.phone}</p>}

              <div style={{ position: "relative", marginBottom: "10px" }}>
                <span
                  onClick={() => setIsShowPassword(!isShowPassword)}
                  style={{ zIndex: 10, position: "absolute", top: "4px", right: "8px" }}
                >
                  {isShowPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
                </span>
                <InputForm
                  placeholder="Mật khẩu"
                  type={isShowPassword ? "text" : "password"}
                  value={password}
                  onChange={setPassword}
                />
              </div>
              {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}

              <div style={{ position: "relative" }}>
                <span
                  onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
                  style={{ zIndex: 10, position: "absolute", top: "4px", right: "8px" }}
                >
                  {isShowConfirmPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
                </span>
                <InputForm
                  placeholder="Xác nhận mật khẩu"
                  type={isShowConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                />
              </div>
              {errors.confirmPassword && <p style={{ color: "red" }}>{errors.confirmPassword}</p>}

              <Loading isPending={mutation.isPending}>
                <ButtonComponent
                  onClick={handleFirstSubmit}
                  size={40}
                  styleButton={{
                    background: "rgb(255,57,69)",
                    height: "48px",
                    width: "100%",
                    border: "none",
                    borderRadius: "4px",
                    margin: "26px 0 10px",
                  }}
                  textButton="Đăng Ký"
                  styleTextButton={{
                    color: "#fff",
                    fontSize: "15px",
                    fontWeight: "700",
                  }}
                />
              </Loading>
            </>
          ) : (
            <>
              <InputForm
                placeholder="Nhập mã xác thực"
                value={verifyCode}
                onChange={setVerifyCode}
              />
              <ButtonComponent
                textButton="Xác nhận đăng ký"
                onClick={handleVerifyAndRegister}
                styleButton={{
                  background: "rgb(255,57,69)",
                  height: "48px",
                  width: "100%",
                  border: "none",
                  borderRadius: "4px",
                  margin: "26px 0 10px",
                }}
                styleTextButton={{
                  color: "#fff",
                  fontSize: "15px",
                  fontWeight: "700",
                }}
              />
            </>
          )}

          {data?.status === "ERR" && (
            <span style={{ color: "red" }}>{data?.message}</span>
          )}

          <p>
            Bạn đã có tài khoản?{" "}
            <WrapperTextLight onClick={handleNavigateLogin}>
              Đăng nhập
            </WrapperTextLight>
          </p>
        </WrapperContainerLeft>

        <WrapperContainerRight>
          <Image
            src={imageLogo}
            preview={false}
            alt="image-logo"
            height="203px"
            width="203px"
          />
          <h4>Mua sắm tại TIKI</h4>
        </WrapperContainerRight>
      </div>
    </div>
  );
};

export default SignUpPage;
