import request from "../../utils/request";
import { LoginData, LoginResult, CaptchaResult } from "./type";
import { AxiosPromise } from "axios";

// 登录
/**
 * @param userData
 */

export function loginApi(data: LoginData): AxiosPromise<LoginResult> {
  const formData = new FormData();
  formData.append("username", data.username);
  formData.append("password", data.password);
  formData.append("verifyCodeKey", data.verifyCodeKey || "");
  formData.append("verifyCode", data.verifyCode || "");

  return request({
    url: "/api/v1/auth/login",
    method: "post",
    data: formData,
    headers: {
      "Content-type": "multipart/form-data",
    },
  });
}

/**
 * 注销
 */

export function logOutApi() {
  return request({
    url: "/api/v1/auth/logout",
    method: "delete",
  });
}

/**
 * 获取验证码
 *
 */
export function getCaptchaApi(): AxiosPromise<CaptchaResult> {
  return request({
    url: "/api/v1/auth/captcha",
    method: "get",
  });
}
