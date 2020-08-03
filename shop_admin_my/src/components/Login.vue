<template>
  <div class="login">
    <!-- 登录模块 -->
    <div class="login_item">
      <el-form ref="formName"
               :model="form"
               label-width="80px"
               :rules="rules"
               status-icon>
        <el-form-item label="用户名"
                      prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码"
                      prop="password">
          <el-input v-model="form.password"
                    @keyup.enter.native="submitForm('formName')"></el-input>
        </el-form-item>
        <el-form-item class="button">
          <el-button type="primary"
                     @keyup.enter="submitForm('formName')">登录</el-button>
          <el-button @click="resetForm('formName')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Login',
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          axios({
            url: 'login',
            method: 'post',
            data: this.form
          }).then(res => {
            console.log(res.data)
            if (res.data.meta.msg === '登录成功') {
              localStorage.setItem('userInfo', JSON.stringify(res.data.data))
              this.$message('恭喜登录成功')
              this.$router.push('/Home')
            }
          })
        } else {
          this.$message('请重新输入账号和密码')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    getLogin () {
      axios({
        url: 'http://localhost:8888/api/private/v1/login',
        method: 'post',
        data: this.form
      }).then(res => {
        console.log(res.data)
      })
    }
  },
  created () {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
html,body{
  background:#2d434c;
  height: 100%;
}
.login{
  width: 100%;
  height: 100%;
  background:#2d434c;
   position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  overflow-y: auto;
}
 .login_item{
   padding: 75px 40px 15px;
   width: 400px;
   height:250px;
   background: #fff;
   margin:0 auto;
   margin-top:200px;
   border-radius: 20px;
 }
 .button{
   text-align: center
 }
</style>
