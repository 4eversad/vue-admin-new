/**
 * 登录请求参数
 */
export interface LoginData {
  /**
   * 用户名
   */
  username: string;

  /**
   * 密码
   */
  password: string;

  /**
   * 验证码缓存key
   */
  verifyCodeKey?: string;

  /**
   * 验证码
   */
  verifyCode?: string;
}

/**
 * 登录响应对象
 */
export interface LoginResult {
  /**
   * 访问token
   */
  accessToken?: string;
  /**
   * token类型
   */
  tokenType?: string;
  /**
   * 刷新token
   */
  refreshToken?: string | null;
  /**
   * 过期时间
   */
  expires?: number | null;
}

/**
 * 验证码结果
 */

export interface CaptchaResult {
  /**
   * 验证码缓存key
   */
  verifyCodeKey: string;
  verifyCodeBase64: string;
}
