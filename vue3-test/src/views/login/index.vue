<template>
  <div class="login-container">
    <el-form
      ref="loginFormRef"
      :model="loginData"
      class="login-form"
      :rules="loginRules"
    >
      <div class="flex text-white item-center py-4">
        <span class="text-2xl flex-1 text-center">
          {{ $t("login.title") }}
        </span>
        <LangSelect class="text-white! cursor-pointer" />
      </div>
      <el-form-item prop="username" class="mb-5">
        <div
          class="p-2 text-white"
          style="display: inline; vertical-align: text-top"
        >
          <el-icon>
            <User />
          </el-icon>
        </div>
        <el-input
          style="width: 90%"
          ref="username"
          v-model="loginData.username"
          class="flex-1 p-1"
          size="large"
          name="username"
          :placeholder="$t('login.username')"
        >
        </el-input>
      </el-form-item>
      <!-- 大写提示及密码 -->

      <el-form-item prop="password" class="mb-5" style="line-height: 32px">
        <div
          class="p-2 text-white"
          style="display: inline; vertical-align: top"
        >
          <el-icon><Unlock /></el-icon>
        </div>
        <el-input
          style="width: 85%"
          v-model="loginData.password"
          class="flex-1 p-1"
          placeholder="密码"
          :type="passwordVisible === false ? 'password' : 'input'"
          size="large"
          name="password"
          @keyup="checkCapslock"
          @keyup.enter="handleLogin"
        ></el-input>
        <template v-if="isCapslock">
          <el-tag type="warning">大写锁定已打开</el-tag>
        </template>
        <span
          class="mr-2"
          @click="passwordVisible = !passwordVisible"
          style="vertical-align: text-top"
        >
          <el-icon
            ><component :is="passwordVisible ? 'View' : 'Hide'"
          /></el-icon>
        </span>
      </el-form-item>
      <!-- 验证码 -->
      <el-form-item prop="verifyCode" class="mb-5" style="position: relative">
        <span
          class="p-2 text-white"
          style="display: inline; vertical-align: text-top"
        >
          <el-icon><Key /></el-icon>
        </span>
        <el-input
          style="width: 60%"
          v-model="loginData.verifyCode"
          auto-complete="off"
          :placeholder="$t('login.verifyCode')"
          class="w-[60%] p-1"
          @keyup.enter="handleLogin"
          size="large"
        />
        <div class="captcha">
          <img :src="captchaBase64" @click="getCaptcha" />
        </div>
      </el-form-item>
      <!-- 登录按钮 -->
      <el-button
        size="default"
        :loading="loading"
        type="primary"
        class="w-full"
        @click.prevent="handleLogin"
      >
        {{ $t("login.login") }}</el-button
      >
      <!-- 账号密码提示 -->
      <div class="mt-4 text-white text-sm">
        <span>{{ $t("login.username") }}: admin</span>
        <span class="ml-4">{{ $t("login.password") }}: 123456</span>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import router from "@/router";
import { LocationQuery, useRoute } from "vue-router";
import { LocationQueryValue } from "vue-router";

// 路由相关
const route = useRoute();

// API依赖
import { LoginData } from "@/api/auth/type";
import { getCaptchaApi } from "@/api/auth";

// Pinia状态管理
import { useUserStore } from "@/store/modules/user";
import { ElForm } from "element-plus";
const loginData = ref<LoginData>({
  username: "admin",
  password: "123456",
});
const loading = ref(false);
const passwordVisible = ref(false);
const isCapslock = ref(false);
const userStore = useUserStore();
const captchaBase64 = ref();
const loginFormRef = ref<InstanceType<typeof ElForm>>();
const loginRules = {
  username: [{ required: true, trigger: "blur" }],
  password: [{ required: true, trigger: "blur", validator: passwordValidator }],
  verifyCode: [{ required: true, trigger: "blur" }],
};

/**
 * 检查输入大小写状态
 */
function checkCapslock(e: any) {
  const { key } = e;
  isCapslock.value = key && key.length === 1 && key >= "A" && key <= "Z";
}

/**
 * 获取验证码
 */
const getCaptcha = () => {
  getCaptchaApi().then(({ data }) => {
    const { verifyCodeBase64, verifyCodeKey } = data;
    loginData.value.verifyCodeKey = verifyCodeKey;
    captchaBase64.value = verifyCodeBase64;
  });
};

// 登录
const handleLogin = () => {
  // 校验表单
  loginFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      loading.value = true;
      userStore.login(loginData.value).then(() => {
        const query: LocationQuery = route.query;
        const redirect = (query.redirect as LocationQueryValue) ?? "/";
        // 获取其他query参数(过滤掉redirect参数)
        const otherQueryParams = Object.keys(query).reduce(
          (acc: any, cur: string) => {
            if (cur !== "redirect") {
              acc[cur] = query[cur];
            }
            return acc;
          },
          {}
        );
        router.push({ path: redirect, query: otherQueryParams });
      });
    }
  });
};
/**
 * 密码校验器
 */
function passwordValidator(rule: any, value: any, callback: any) {
  if (value.length < 6) {
    callback(new Error("The password can not be less than 6 digits"));
  } else {
    callback();
  }
  if (rule) {
  }
}

onMounted(() => {
  getCaptcha();
});
</script>
<style lang="scss" scoped>
.login-container {
  width: 100%;
  min-height: 100%;
  overflow: hidden;
  background-color: #2d3a4b;

  .login-form {
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;

    .captcha {
      position: absolute;
      top: 0;
      right: 0;
      z-index: 100;

      img {
        width: 120px;
        height: 48px;
        cursor: pointer;
      }
    }
  }
}

.el-form-item {
  background: rgb(0 0 0 / 10%);
  border: 1px solid rgb(255 255 255 / 10%);
  border-radius: 5px;
}

.el-input {
  background: transparent;

  // 子组件 scoped 无效，使用 :deep
  :deep(.el-input__wrapper) {
    padding: 0;
    background: transparent;
    box-shadow: none;

    .el-input__inner {
      color: #fff;
      background: transparent;
      border: 0;
      border-radius: 0;
      caret-color: #fff;

      &:-webkit-autofill {
        box-shadow: 0 0 0 1000px transparent inset !important;
        -webkit-text-fill-color: #fff !important;
      }

      // 设置输入框自动填充的延迟属性
      &:-webkit-autofill,
      &:-webkit-autofill:hover,
      &:-webkit-autofill:focus,
      &:-webkit-autofill:active {
        transition: color 99999s ease-out, background-color 99999s ease-out;
        transition-delay: 99999s;
      }
    }
  }
}
</style>
