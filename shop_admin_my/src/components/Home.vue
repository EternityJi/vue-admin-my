<template>
  <div class="Home">
    <el-container>
      <el-header>
        <h1>电商后台管理系统</h1>
        <div class="right">
          <div class="right1">欢迎光临</div>
          <div class="right2"
               @click=layout()>退出</div>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-row class="tac">
            <el-col :span="24">
              <el-menu default-active="1"
                       collapse-transition
                       unique-opened
                       class="el-menu-vertical-demo"
                       @open="handleOpen"
                       @close="handleClose"
                       background-color="#545c64"
                       text-color="#fff"
                       active-text-color="#ffd04b"
                       router>
                <el-submenu :index="l1.path" v-for="l1 in menusList" :key="l1.id">
                  <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>{{l1.authName}}</span>
                  </template>
                  <el-menu-item-group>
                    <el-menu-item :index="l2.path" v-for="l2 in l1.children" :key="l2.id">
                      <i class="el-icon-menu" ></i>
                      {{l2.authName}}
                    </el-menu-item>
                  </el-menu-item-group>
                </el-submenu>
                <!-- <el-submenu index="2">
                  <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>权限管理</span>
                  </template>
                  <el-menu-item-group>
                    <el-menu-item index="Role"> <i class="el-icon-menu"></i>角色列表</el-menu-item>
                    <el-menu-item index="2-2"> <i class="el-icon-menu"></i>权限列表</el-menu-item>
                  </el-menu-item-group>
                </el-submenu>
                <el-submenu index="3">
                  <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>商品管理</span>
                  </template>
                  <el-menu-item-group>
                    <el-menu-item index="3-1"> <i class="el-icon-menu"></i>商品列表</el-menu-item>
                    <el-menu-item index="3-2"> <i class="el-icon-menu"></i>分类参数</el-menu-item>
                    <el-menu-item index="3-3"> <i class="el-icon-menu"></i>商品分类</el-menu-item>
                  </el-menu-item-group>
                </el-submenu>
                <el-submenu index="4">
                  <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>订单管理</span>
                  </template>
                  <el-menu-item-group>
                    <el-menu-item index="4-1"> <i class="el-icon-menu"></i>订单列表</el-menu-item>
                  </el-menu-item-group>
                </el-submenu>
                <el-submenu index="5">
                  <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>数据统计</span>
                  </template>
                  <el-menu-item-group>
                    <el-menu-item index="DataList"> <i class="el-icon-menu"></i>数据报表</el-menu-item>
                     <el-menu-item index="DemoList"> <i class="el-icon-menu"></i>Demo</el-menu-item>
                  </el-menu-item-group>
                </el-submenu> -->
              </el-menu>
            </el-col>
          </el-row>
        </el-aside>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Home',
  data () {
    return {
      form: {
        menusList: []
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
    getMenus () {
      axios({
        url: 'menus',
        method: 'get'
      }).then(res => {
        console.log(res.data)
        this.menusList = res.data.data
        console.log(this.menusList)
        localStorage.setItem('menusList', JSON.stringify(this.menusList))
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    },
    layout () {
      localStorage.removeItem('userInfo')
      this.$router.push('/login')
    },
    getLogin () {
      axios({
        url: 'login',
        method: 'post',
        data: this.form
      }).then(res => {
        console.log(res.data)
      })
    }
  },
  created () {
    // this.getMenus()
  },
  mounted () {
    this.getMenus()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
.el-header {
  background: #b3c1cd;
  text-align: center;
  position: relative;

  h1 {
    color: #fff;
  }

  .right {
    .right1, .right2 {
      position: absolute;
      top: 20px;
      right: 0;
    }

    .right1 {
      right: 60px;
    }

    .right2 {
      right: 20px;
      color: red;
    }
  }
}

.el-main {
  background-color: #d4dfe4;
}
</style>
