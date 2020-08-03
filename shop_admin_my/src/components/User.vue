<template>
  <div class="user">
    <!-- user -->
    <!-- 面包屑导航 -->
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }"></el-breadcrumb-item>
        <!-- <el-breadcrumb-item><a href="/">用户列表</a></el-breadcrumb-item> -->
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>

      </el-breadcrumb>
    </div>
    <!-- 搜索 -->
    <el-input placeholder="请输入内容"
              v-model="query"
              clearable>
    </el-input>
    <el-button class="search_button"
               type="info"
               plain
               icon="el-icon-search"
               @click="serach"></el-button>
    <el-button type="success"
               @click="dialogFormVisible = true">用户添加</el-button>
    <!-- 表格数据 -->
    <div class="table">
      <el-table :data="tableData"
                style="width: 100%">
        <el-table-column label="姓名"
                         width="180"
                         prop="username">
        </el-table-column>
        <el-table-column label="邮箱"
                         width="180"
                         prop="email">
        </el-table-column>
        <el-table-column label="电话"
                         width="180"
                         prop="mobile">
        </el-table-column>
        <el-table-column label="状态"
                         width="180"
                         prop="mg_state">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state"
                       active-color="#13ce66"
                       inactive-color="#ff4949"
                       @change='getchange($event,scope.row,scope.$index)'>
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- <el-button size="mini"
                       @click="handleEdit(scope.$index, scope.row)">编辑</el-button> -->
            <el-button type="primary"
                       plain
                       icon="el-icon-edit"
                       size="mini"
                       @click="handleEdit(scope.$index, scope.row)"></el-button>
            <el-button type="danger"
                       plain
                       size="mini"
                       icon="el-icon-delete"
                       @click="handleDelete(scope.$index, scope.row)"></el-button>
            <el-button type="success"
                       plain
                       size="mini"
                       @click="fenpei(scope.$index, scope.row)"><i class="el-icon-check"></i>分配角色</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="block">
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="currentPage"
                     :page-sizes="[2, 4, 6, 8]"
                     :page-size="pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </div>
    <!-- 添加用户 -->
    <el-dialog title="添加用户"
               :visible.sync="dialogFormVisible"
               width="40%">
      <el-form :model="form"
               :rules="rules"
               ref="ruleForm">
        <el-form-item label="用户名"
                      :label-width="formLabelWidth"
                      prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码"
                      :label-width="formLabelWidth"
                      prop="password">
          <el-input v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱"
                      :label-width="formLabelWidth"
                      prop="email">
          <el-input v-model="form.email"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话"
                      :label-width="formLabelWidth"
                      prop="mobile">
          <el-input v-model="form.mobile"
                    autocomplete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="submitForm('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!--  编辑用户-->
    <el-dialog title="修改用户"
               :visible.sync="dialogeditFormVisible"
               width="40%">
      <el-form :model="editForm"
               :rules="rules"
               ref="editForm">
        <el-form-item label="用户名"
                      :label-width="formLabelWidth"
                      prop="username">
          <el-input v-model="editForm.username"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱"
                      :label-width="formLabelWidth"
                      prop="email">
          <el-input v-model="editForm.email"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话"
                      :label-width="formLabelWidth"
                      prop="mobile">
          <el-input v-model="editForm.mobile"
                    autocomplete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="clearForm('editForm')">取 消</el-button>
        <el-button type="primary"
                   @click="editOnSubmit('editForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!--  分配角色-->
    <el-dialog title="分配角色"
               :visible.sync="dialogfenpeiFormVisible"
               width="40%">
      <el-form :model="fenpeiForm"
               :rules="rules"
               ref="fenpeiForm">
        <el-form-item label="用户名"
                      :label-width="formLabelWidth"
                      prop="username">
          <el-button type="info"
                     plain
                     disabled="true">{{this.fenpeiForm.name}}</el-button>
        </el-form-item>
        <el-form-item label="角色列表"
                      :label-width="formLabelWidth"
                      prop="mobile"
                      class="jiaose">
          <el-select v-model="fenpeivalue"
                     placeholder="请选择">
            <el-option v-for="item in roleData"
                       :key="item.id"
                       :label="item.roleName"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="closeForm('fenpeiForm')">取 消</el-button>
        <el-button type="primary"
                   @click="fenpeiOnSubmit('fenpeiForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Login',
  data () {
    return {
      uid: '',
      type: '',
      id: '',
      value: true,
      query: '',
      input: '',
      currentPage: 1,
      pageSize: 2,
      total: '',
      tableData: [],
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      fenpeiForm: {
        id: '',
        name: ''
      },
      dialogFormVisible: false,
      dialogeditFormVisible: false,
      dialogfenpeiFormVisible: false,
      formLabelWidth: '80px',
      ruleForm: {
        username: '',
        password: '',
        emile: '',
        mobile: ''
      },
      roleData: [],
      fenpeivalue: '',
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ],
        emile: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 添加用户
    submitForm (formName) {
      // console.log(formName)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          axios({
            url: 'users',
            method: 'post',
            data: this.form
          }).then(res => {
            console.log(res.data)
            this.gettableList()
          })
          this.dialogFormVisible = false
        } else {
          return false
        }
      })
    },
    // 修改用户
    clearForm (formName) {
      // this.$refs.formName.resetFields()

      // this.$nextTick(() => {
      // this.$refs.editForm.resetFields()
      // })
      this.dialogeditFormVisible = false
    },
    editOnSubmit (formName) {
      console.log(this.id)
      this.$refs[formName].validate((valid) => {
        // console.log(this.editForm)
        if (valid) {
          axios({
            url: `users/${this.id}`,
            method: 'put',
            data: {
              id: this.id,
              email: this.editForm.email,
              mobile: this.editForm.mobile
            }
            // console.log(data)
          }).then(res => {
            console.log(res.data)
            if (res.data.meta.msg === '更新成功') {
              this.dialogeditFormVisible = false
            }
          })
          this.dialogFormVisible = false
        } else {
          return false
        }
      })
    },
    // 分配角色
    fenpei (index, row) {
      console.log(row)
      this.fenpeiForm.id = row.id
      this.fenpeiForm.name = row.username
      console.log(this.fenpeiForm.id)
      this.dialogfenpeiFormVisible = true
    },
    fenpeiOnSubmit (form) {
      console.log(form)
      axios({
        url: `users/${this.fenpeiForm.id}/role`,
        method: 'put',
        data: {
          id: this.fenpeiForm.id,
          rid: this.fenpeivalue
        }
      }).then(res => {
        this.$message({
          message: '设置角色成功',
          type: 'success'
        })
        this.dialogfenpeiFormVisible = false
        console.log(res)
      })
    },
    closeForm () {
      this.dialogfenpeiFormVisible = false
    },
    // 搜索
    serach () {
      // console.log(this.query)
      this.gettableList()
    },
    getchange (e, row, index) {
      axios({
        url: `users/${row.id}/state/${e}`,
        method: 'put',
        data: {
          uid: row.id,
          type: e
        }
      }).then(res => {
        this.$message({
          message: '恭喜你,修改状态成功',
          type: 'success'
        })
      })
    },
    gettroleData () {
      axios({
        url: 'roles',
        method: 'get'
      }).then(res => {
        this.roleData = res.data.data
        console.log(this.roleData)
      })
    },
    editStatus (index, row) {
      console.log(111)
      console.loe(index, row)
    },
    handleEdit (index, row) {
      this.dialogeditFormVisible = true
      this.editForm = row
      this.id = row.id
    },
    handleDelete (index, row) {
      console.log(index, row)
      this.id = row.id
      axios({
        url: `users/${this.id}`,
        method: 'delete',
        params: {
          id: this.id
        }
      }).then(res => {
        this.gettableList()
      })
    },
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.gettableList()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      console.log(val)
      this.currentPage = val
      this.gettableList()
    },
    // 获取表格数据
    gettableList () {
      axios({
        url: 'users',
        method: 'get',
        params: {
          query: this.query,
          pagesize: this.pageSize,
          pagenum: this.currentPage
        }
      }).then(res => {
        console.log(res.data)
        this.total = res.data.data.total
        this.tableData = res.data.data.users
        // console.log(this.tableData)
      })
    },
    // 用户添加
    userAdd () {

    }
  },
  created () {
    this.gettableList()
    this.gettroleData()
  },
  watch: {
    query () {
      this.gettableList()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-input {
  width: 400px;
  margin:20px 0;
}
.search_button{
  position: relative;
  left: -5px;
}
.el-form-item__label {
    text-align: right;
    vertical-align: middle;
    float: left;
    font-size: 14px;
    color: #606266;
    line-height: 72px!important;
    padding: 0 12px 0 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}
.el-form-item{
  margin-bottom:0px;
}
.jiaose{
  margin-top:20px;
}
/* .el-input{
  margin-bottom:20px;
} */
</style>
