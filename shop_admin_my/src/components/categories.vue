<template>
  <div class="Role">
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <!-- <el-breadcrumb-item :to="{ path: '/' }"></el-breadcrumb-item> -->
        <!-- <el-breadcrumb-item><a href="/">用户列表</a></el-breadcrumb-item> -->
        <el-breadcrumb-item class="el-breadcrumb-item1">权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-button type="success"
               @click="dialogFormVisible = true">角色添加</el-button>
    <el-table :data="tableData"
              style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">

          <!-- <el-form label-position="left"
                   inline
                   class="demo-table-expand"> -->
          <el-row v-if="scope.row.children.length ===0">
            暂无权限
          </el-row>
          <el-row v-for="level1 in scope.row.children"
                  :key="level1.id">
            <el-col :span="4">
              <div class="grid-content bg-purple">
                <el-tag closable
                        @close="deleteClose(scope.$index,scope.row)">{{level1.authName}}</el-tag>
              </div>
            </el-col>
            <el-col :span="20">
              <el-row v-for="level2 in level1.children"
                      :key="level2.id">
                <el-col :span="4">
                  <div class="grid-content bg-purple-light">
                    <el-tag type="success"
                            closable
                            :disable-transitions="false"
                            @close="deleteClose(scope.$index,scope.row)">{{level2.authName}}</el-tag>
                  </div>
                </el-col>
                <el-col :span="20">
                  <div class="grid-content bg-purple-light">
                    <el-tag type="danger"
                            closable
                            v-for="level3 in level2.children"
                            :key="level3.id"
                            @click="deletTag(scope.$index, scope.row)">{{level3.authName}}</el-tag>
                  </div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column label="#"
                       prop="id">
      </el-table-column>
      <el-table-column label="角色名称"
                       prop="roleName">
      </el-table-column>
      <el-table-column label="角色描述"
                       prop="roleDesc">
      </el-table-column>
      <el-table-column label="操作"
                       prop="desc">
        <template slot-scope="scope">
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
                     @click="fenpei(scope.$index, scope.row)"><i class="el-icon-check"></i>分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加角色  -->
    <el-dialog title="添加角色"
               :visible.sync="dialogFormVisible"
               width="40%">
      <el-form :model="form"
               :rules="rules"
               ref="ruleForm">
        <el-form-item label="角色名称"
                      :label-width="formLabelWidth"
                      prop="roleName">
          <el-input v-model="form.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述"
                      :label-width="formLabelWidth"
                      prop="roleDesc">
          <el-input v-model="form.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="submitForm('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!--  编辑角色-->
    <el-dialog title="修改角色"
               :visible.sync="dialogeditFormVisible"
               width="40%">
      <el-form :model="editForm"
               :rules="rules"
               ref="editForm">
        <el-form-item label="角色名称"
                      :label-width="formLabelWidth"
                      prop="roleName">
          <el-input v-model="editForm.roleName"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述"
                      :label-width="formLabelWidth"
                      prop="roleDesc">
          <el-input v-model="editForm.roleDesc"
                    autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="closeForm('editForm')">取 消</el-button>
        <el-button type="primary"
                   @click="editOnSubmit('editForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配权限树形控件 -->
    <el-dialog title="分配权限"
               :visible.sync="quxianDialogVisible"
               width="30%"
               center>
      <el-tree :data="data"
               ref="tree"
               show-checkbox
               node-key="id"
               @check='getCheckedKeys()'
               default-expand-all="true"
               :props="defaultProps"
               @setChecked="setCheckedFunc">
      </el-tree>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="quxianClose">取 消</el-button>
        <el-button type="primary"
                   @click="quxianOnsubmit">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Role',
  data () {
    return {
      dialogFormVisible: false,
      checked: [],
      roleid: '',
      rids: '',
      tableData: [],
      children1: [],
      dialogeditFormVisible: false,
      quxianDialogVisible: false,
      editForm: {
        id: '',
        roleDesc: '',
        roleName: ''
      },
      form: {
        roleName: '',
        roleDesc: ''
      },
      type: 'tree',
      authorList: '',
      data: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          { min: 2, max: 6, message: '长度在 2 到 6 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 2, max: 6, message: '长度在 2到 6 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 添加角色
    submitForm (formName) {
      // console.log(formName)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          axios({
            url: 'roles',
            method: 'post',
            data: this.form
          }).then(res => {
            console.log(res.data)
            this.$message({
              message: '添加角色成功 ',
              type: 'success'
            })
            this.dialogFormVisible = false
            this.gettableList()
          })
        } else {
          return false
        }
      })
    },
    quxianClose () {
      this.checked = []
      this.gettableData()
      this.quxianDialogVisible = false
    },
    quxianOnsubmit () {
      axios({
        url: `roles/${this.roleid}/rights`,
        method: 'post',
        data: {
          roleid: this.roleid,
          rids: this.rids
        }
      }).then(res => {
        console.log(res)
        this.$message({
          message: '分配权限成功',
          type: 'success'
        })
        this.checked = []
        this.quxianDialogVisible = false
        this.gettableData()
      })
    },
    getCheckedKeys () {
      this.rids = this.$refs.tree.getCheckedKeys().join()
      console.log(this.rids)
      // console.log(this.$refs.tree.getCheckedKeys())
    },
    deleteClose (index, row) {
      console.log(index, row)
      axios({
        url: `roles/${row.id}`,
        method: 'delete'
      }).then(res => {
        this.$message({
          message: '删除权限成功',
          type: 'success'
        })
        this.gettableData()
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
    // 分配权限
    fenpei (index, row) {
      console.log(row)

      this.roleid = row.id
      this.$nextTick(() => {
        row.children.forEach(l1 => {
          l1.children.forEach(l2 => {
            l2.children.forEach(l3 => {
              this.checked.push(l3.id)
            })
          })
        })
        // 获取已经设置的资源后渲染
        this.$refs.tree.setCheckedKeys(this.checked)
        console.log(this.checked)
      })
      this.quxianDialogVisible = true
    },
    // 删除角色
    handleDelete (index, row) {
      console.log(row.id)
      axios({
        url: `roles/${row.id}`,
        method: 'delete',
        params: {
          id: this.editForm.id
        }
        // console.log(data)
      }).then(res => {
        console.log(res.data)
        if (res.data.meta.msg === '删除成功') {
          this.$message({
            message: '删除角色成功',
            type: 'success'
          })
          this.gettableData()
        }
      })
    },
    // 编辑角色
    handleEdit (index, row) {
      this.editForm.roleName = row.roleName
      this.editForm.roleDesc = row.roleDesc
      this.editForm.id = row.id
      this.dialogeditFormVisible = true
    },
    closeForm (formName) {
      this.$refs[formName].resetFields()
      this.dialogeditFormVisible = false
    },
    editOnSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        // console.log(this.editForm)
        if (valid) {
          axios({
            url: `roles/${this.editForm.id}`,
            method: 'put',
            data: {
              id: this.editForm.id,
              roleName: this.editForm.roleName,
              roleDesc: this.editForm.roleDesc
            }
            // console.log(data)
          }).then(res => {
            console.log(res.data)
            if (res.data.meta.msg === '获取成功') {
              this.$message({
                message: '修改角色成功',
                type: 'success'
              })
              this.gettableData()
              this.$refs[formName].resetFields()
              this.dialogeditFormVisible = false
            }
          })
        } else {
          return false
        }
      })
    },
    // 获取表格内容
    gettableData () {
      axios({
        url: 'roles',
        method: 'get'
      }).then(res => {
        console.log(res.data)
        this.tableData = res.data.data
        this.tableData.forEach(item => {
          this.children1.push(item.children)
        })
        console.log(this.children1)
      })
    },
    // 获取所有权限列表
    getAllauthorList () {
      axios({
        url: `rights/${this.type}`,
        method: 'get',
        data: {
          type: this.type
        }
      }).then(res => {
        console.log(res.data)
        this.data = res.data.data
      })
    }
  },
  created () {
    this.gettableData()
    this.getAllauthorList()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
.el-breadcrumb-item1 {
  color: black;
  font-weight: 600;
}

.demo-table-expand {
  font-size: 0;
}

.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}

.el-tag {
  margin-right: 20px;
  margin-top: 20px;
}

.el-form-item {
  margin-bottom: 0;
  margin-top: 20px;
}

.el-input {
  width: 80%;
}
</style>
<template>
  <div class="Role">

    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <!-- <el-breadcrumb-item :to="{ path: '/' }"></el-breadcrumb-item> -->
        <!-- <el-breadcrumb-item><a href="/">用户列表</a></el-breadcrumb-item> -->
        <el-breadcrumb-item class="el-breadcrumb-item1">权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-button type="success"
               @click="dialogFormVisible = true">添加分类</el-button>
    <el-table :data="tableData"
              max-height="400">
      <el-table-tree-column :remote="remote"
                            file-icon="icon icon-file"
                            folder-icon="icon icon-folder"
                            prop="cat_name"
                            label="分类名称"
                            levelKey='cat_level'
                            parentKey='cat_pid'
                            treeKey='cat_id'
                            child-key='children'
                            :indentSize="20">
      </el-table-tree-column>
      <el-table-column prop="cat_deleted"
                       label="是否删除">
        <template slot-scope="scope">
          {{scope.row.cat_deleted == false?'否':'是'}}
        </template>
      </el-table-column>
      <el-table-column prop="cat_level"
                       label="排序"
                       :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="id"
                       label="操作">
        <template slot-scope="scope">
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
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="block">
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="currentPage"
                     :page-sizes="[10, 20, 30, 40]"
                     :page-size="10"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </div>
    <!-- 添加角色  -->
    <el-dialog title="添加分类"
               :visible.sync="dialogFormVisible"
               width="40%">
      <el-form :model="addCategoriesform"
               :rules="rules"
               ref="addCategoriesform">
        <el-form-item label="分类名称"
                      :label-width="formLabelWidth"
                      prop="cat_name">
          <el-input v-model="addCategoriesform.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级名称"
                      :label-width="formLabelWidth"
                      prop="pName">
          <el-cascader v-model="addCategoriesform.cat_pid"
                       :options="options"
                       @change="handleChangecascader"
                       :props="defaultProps"></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="submitForm('addCategoriesform')">确 定</el-button>
      </div>
    </el-dialog>
    <!--  编辑角色-->
    <el-dialog title="修改角色"
               :visible.sync="dialogeditFormVisible"
               width="40%">
      <el-form :model="editForm"
               :rules="rules"
               ref="editForm">
        <el-form-item label="角色名称"
                      :label-width="formLabelWidth"
                      prop="roleName">
          <el-input v-model="editForm.roleName"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述"
                      :label-width="formLabelWidth"
                      prop="roleDesc">
          <el-input v-model="editForm.roleDesc"
                    autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="closeForm('editForm')">取 消</el-button>
        <el-button type="primary"
                   @click="editOnSubmit('editForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import axios from 'axios'
export default {
  name: 'Role',
  data () {
    return {
      value: [],
      options:[],
      pageSize: 10,
      currentPage: 1,
      total:'',
      dialogFormVisible: false,
      checked: [],
      roleid: '',
      rids: '',
      tableData: [],
      children1: [],
      dialogeditFormVisible: false,
      quxianDialogVisible: false,
      editForm: {
        id: '',
        roleDesc: '',
        roleName: ''
      },
      addCategoriesform: {
        cat_name:'',
        cat_pid:[],
        cat_level:''
      },
      defaultProps: {
        children: 'children',
        label: 'cat_name',
        value:'cat_id',
      },
      form: {
        roleName: '',
        roleDesc: ''
      },
      type: 'tree',
      authorList: '',
      data: [],
      rules: {
        cat_name: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          { min: 2, max: 6, message: '长度在 2 到 6 个字符', trigger: 'blur' }
        ],
      }
    }
  },
  methods: {
    handleChangecascader(value){
        this.addCategoriesform.cat_level = value.length
    },
     handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.pageSize = val
        this.gettableData()
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currentPage = val
        this.gettableData()
      },
    // 添加分类
    submitForm (formName) {
      console.log(this.addCategoriesform.cat_pid)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          axios({
            url: 'categories',
            method: 'post',
            data:{
              cat_pid:this.addCategoriesform.cat_pid[this.addCategoriesform.cat_pid.length-1] || 0,
              cat_name: this.addCategoriesform.cat_name,
              cat_level:this.addCategoriesform.cat_level
            }
          }).then(res => {
            console.log(res.data)
            this.$refs.addCategoriesform.resetFields()
            this.addCategoriesform.cat_pid = ''
            this.dialogFormVisible = false
            this.$message({
              message: '添加角色成功 ',
              type: 'success'
            })
           this.gettableData()
          })
        } else {
          return false
        }
      })
    },
    quxianClose () {
      this.checked = []
      this.gettableData()
      this.quxianDialogVisible = false
    },
    quxianOnsubmit () {
      axios({
        url: `roles/${this.roleid}/rights`,
        method: 'post',
        data: {
          roleid: this.roleid,
          rids: this.rids
        }
      }).then(res => {
        console.log(res)
        this.$message({
          message: '分配权限成功',
          type: 'success'
        })
        this.checked = []
        this.quxianDialogVisible = false
        this.gettableData()
      })
    },
    getCheckedKeys () {
      this.rids = this.$refs.tree.getCheckedKeys().join()
      console.log(this.rids)
      // console.log(this.$refs.tree.getCheckedKeys())
    },
    deleteClose (index, row) {
      console.log(index, row)
      axios({
        url: `roles/${row.id}`,
        method: 'delete'
      }).then(res => {
        this.$message({
          message: '删除权限成功',
          type: 'success'
        })
        this.gettableData()
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
    // 分配权限
    fenpei (index, row) {
      console.log(row)

      this.roleid = row.id
      this.$nextTick(() => {
        row.children.forEach(l1 => {
          l1.children.forEach(l2 => {
            l2.children.forEach(l3 => {
              this.checked.push(l3.id)
            })
          })
        })
        // 获取已经设置的资源后渲染
        this.$refs.tree.setCheckedKeys(this.checked)
        console.log(this.checked)
      })
      this.quxianDialogVisible = true
    },
    // 删除角色
    handleDelete (index, row) {
      console.log(row.id)
      axios({
        url: `roles/${row.id}`,
        method: 'delete',
        params: {
          id: this.editForm.id
        }
        // console.log(data)
      }).then(res => {
        console.log(res.data)
        if (res.data.meta.msg === '删除成功') {
          this.$message({
            message: '删除角色成功',
            type: 'success'
          })
          this.gettableData()
        }
      })
    },
    // 编辑角色
    handleEdit (index, row) {
      this.editForm.roleName = row.roleName
      this.editForm.roleDesc = row.roleDesc
      this.editForm.id = row.id
      this.dialogeditFormVisible = true
    },
    closeForm (formName) {
      this.$refs[formName].resetFields()
      this.dialogeditFormVisible = false
    },
    editOnSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        // console.log(this.editForm)
        if (valid) {
          axios({
            url: `roles/${this.editForm.id}`,
            method: 'put',
            data: {
              id: this.editForm.id,
              roleName: this.editForm.roleName,
              roleDesc: this.editForm.roleDesc
            }
            // console.log(data)
          }).then(res => {
            console.log(res.data)
            if (res.data.meta.msg === '获取成功') {
              this.$message({
                message: '修改角色成功',
                type: 'success'
              })
              this.gettableData()
              this.$refs[formName].resetFields()
              this.dialogeditFormVisible = false
            }
          })
        } else {
          return false
        }
      })
    },
    // 获取表格内容
    gettableData () {
      axios({
        url: 'categories',
        method: 'get',
        params:{
          type:[1,2,3],
          pagesize: this.pageSize,
          pagenum: this.currentPage
        }
      }).then(res => {
        console.log(res)
        this.tableData = res.data.data.result
        this.total = res.data.data.total
      })
    },
    getOptions(){
      axios({
        url: 'categories',
        method: 'get',
        params:{
          type:[2],
        }
      }).then(res => {
        console.log(res.data.data)
        this.options = res.data.data
        console.log(this.options)
      })
    },
    // 获取所有权限列表
    getAllauthorList () {
      axios({
        url: `rights/${this.type}`,
        method: 'get',
        data: {
          type: this.type
        }
      }).then(res => {
        console.log(res.data)
        this.data = res.data.data
      })
    }
  },
  created () {
    this.gettableData()
    this.getOptions()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
.el-breadcrumb-item1 {
  color: black;
  font-weight: 600;
}

.demo-table-expand {
  font-size: 0;
}

.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}

.el-tag {
  margin-right: 20px;
  margin-top: 20px;
}

.el-form-item {
  margin-bottom: 0;
  margin-top: 20px;
}

.el-input {
  width: 80%;
}
</style>
