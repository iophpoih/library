//Vue.config.productionTip的作用-阻止vue启动生产模式(生产消息)
Vue.config.productionTip = false
// 注册自定义指令。 
Vue.directive('color', {
    // bind: 只调用一次，指令第一次绑定到元素时调用，用这个钩子函数可以定义一个在绑定时执行一次的初始化动作。
    // 使用该钩子函数，因为需要在v-model生效后执行该钩子函数 用v-color来调用
    bind(el, binding) {
        //element组件所绑定的css类型为对应颜色
        el.style.color = binding.value;
    }
})
//Javascript的两种存储对象的方式:Web 存储 API 提供了 sessionStorage （会话存储） 和 localStorage（本地存储）两个存储对象来对网页的数据进行添加、删除、修改、查询操作
//localStorage(5M大小 ) 用于长久保存整个网站的数据，保存的数据没有过期时间，直到手动去除。  localStorage 属性是只读的。
//sessionStorage 用于临时保存同一窗口(或标签页)的数据，在关闭窗口或标签页之后将会删除这些数据。
var LocalStoragekey="Student";//键值对 key values
var StudentsStorage={
	getLocalstorage:function(){
	//取出来      
    //因为localStorage里存的是字符串 故我们取出来的时候 JSON字符串要转化JavaScript对象  ||或  这里也是是假入有的话就读出前者，若没有就转化成一个空对象
		var Storageitems=JSON.parse(window.localStorage.getItem(LocalStoragekey)||'[]');
		return Storageitems;
	},
	save:function(students){
		//将items这一对象 JSON格式化变为字符串(存进去时)
        //JavaScript对象转化JSON字符串
		window.localStorage.setItem(LocalStoragekey,JSON.stringify(students));
		console.log("保存成功");
	}
}


//信息展示
//Vue.component  1.自定义组件 组件名为"student-list"; 2.data 写函数; 3.template 写组件的内容（元素和触发的事件）
Vue.component('student-list', {
    // template 是模板的意思，在 html 里面是一个可以同时控制多个子元素的父元素
    template: '#studentList',//将Vue渲染到id为studentList的template里
    data() {
        return {
            // 数组集合 用来存放添加的学生 读取存入的值
            students: StudentsStorage.getLocalstorage(),
            // 学生集合 临时存放比如增加学生,最后调用
            studentDTO: {},
            // 下标 默认为-1 通过数组下标位置为-1时,往数组末尾追加一个学生字典
            indexDTO: -1,
            // 统计信息的集合
            statisticsDTO: {},
            // 用来显示inputStudent那个template模板
            inputStuFlag: false,
             //统计信息页面展示出来
            statisticsFlag: false,
            // 默认为true 视图显示
            innerListFlag: true,
            // vue实例创建时长
            vueDuration: 0
        }
    },
    created() {
        // var student1 = {
        //     class: "计软21302",
        //     name: "王雄",
        //     enName: "wx",
        //     gender: "男",
        //     age: 20
        // }
        // var student2 = {
        //     class: "计软21302",
        //     name: "蒲兴林",
        //     enName: "pyl",
        //     gender: "男",
        //     age: 20
        // }
        // var student3 = {
        //     class: "计软21302",
        //     name: "顾玲玲",
        //     enName: "gll",
        //     gender: "女",
        //     age: 20
        // }
        // //默认数据
        // this.students.push(student1, student2,student3)
        // console.log(this.students)
    },
    //这个是钩子函数
    //如果cartView函数要执行，必须先执行钩子函数
    //这个钩子函数完成了对cratView函数的调用
    mounted() {
        // vue中$root是用来访问根组件的 这里是来访问vue vm实例里的duration属性,读出 通过getMilliseconds 方法 返回 Date 对象中用本地时间表示的毫秒值。
        this.vueDuration = this.$root.duration
    },
    methods: {
        //添加学生或更新学生后
        addOrUpdateStudent(student, index) {
            console.log("addOrUpdateStudent")
            console.log(student, index)
            // 数组下标位置为-1时,往数组末尾追加一个学生字典
            if (index == -1) {
                //添加学生
                this.students.push(student)
            } 
            else {
                //为学生本身时,就更新学生
                this.students[index] = student
            }
            //学生添加完后调用此方法进行视图隐藏 释放学生字典
            this.clearInputPage()
        },
        // 删除
        delStudent(index) {
            // splice() 方法用于添加或删除数组中的元素。
			// 返回值 如果删除一个元素，则返回一个元素的数组。 如果未删除任何元素，则返回空数组。
            this.students.splice(index, 1)
        },
        //修改
        showUpdatePage(index) {
            var stu = this.students[index]
            // 学生集合 存放学生并显示在添加学生页面
            this.studentDTO = stu
            //记住下标
            this.indexDTO = index
            //隐藏添加学生页
            this.inputStuFlag = true
        },
        // 统计页面
        showStatisticsPage() {
            console.log("showStatisticsPage")
            this.innerListFlag = false
            //统计信息页面展示出来
            this.statisticsFlag = true
            // temp里有三属性
            var temp = {
                boyNums: 0,
                girlNums: 0,
                totleNums: 0
            }
            this.students.forEach(function (item) {
                if (item.gender == "男") {
                    temp.boyNums++
                } else {
                    temp.girlNums++
                }
                temp.totleNums++
            })
            this.statisticsDTO = temp
        },
        //学生添加完后调用此方法进行视图隐藏 释放学生字典
        clearInputPage() {
            //页面隐藏
            this.inputStuFlag = false
            //用于存放的学生字典清空
            this.studentDTO = {}
            //默认为-1
            this.indexDTO = -1
        }
    },
    // filters 本地过滤器
    filters: {
        toLowerCase(str) { 
            //用于 添加学生里的英文名 过滤   toLowerCase()方法是JavaScript中的字符串方法，用于转换所有小写字母并返回带有小写字母的新字符串
            // 判断str 有值没
            return str ? str.toLowerCase() : ''
        }
    },
    //计算属性
    computed: {
        // 计算学生多少
        totleStudent() {
            return this.students.length
        }
    },
    //监控器 -监控items  侦听器的使用
	watch:{
		students:{
			//handler（固定方法触发）：因为你要添加deep的配置，所以，侦听器的形式要变更为对象形式，
			//只有对象才能添加其它的配置, 同时侦听函数必须为handler
			//当items发生变化时调用
			//handler（固定方法触发）：因为你要添加deep的配置，所以，侦听器的形式要变更为对象形式，只有对象才能添加其它的配置, 同时侦听函数必须为handler
			handler:function(newstudents,oldTtems){
				//保存变化的items  newitems是侦听items得到的新值
				StudentsStorage.save(newstudents);
			},
            //深度监听 items值发生变化时的深度侦听
            deep:true
		}
	}
})

//统计信息
//Vue.component 1.组件名为"statistics"; 2.data 写函数; 3.template 写组件的内容（元素和触发的事件）
Vue.component('statistics', {
    //template 是模板的意思，在 html 里面是一个可以同时控制多个子元素的父元素
    template: "#statistics",
    // 定义一个props属性，用于接收别的组件传进来的值。 接收view里statisticsDTO统计学生的所有信息
    props: ["statisticsinfo"],
    methods: {
        back() {
            console.log("back")
            //主页面显示 this.$parent访问父组件 vue里的innerListFlag属性
            this.$parent.innerListFlag = true
            // 统计页面隐藏
            this.$parent.statisticsFlag = false
        }
    }
})

//添加学生
Vue.component('input-student', {
    template: "#inputStudent",
     // 定义一个props属性，用于接收别的组件传进来的值。接收view里student和index信息
    props: ["student", "index"],
    methods: {
        //信息提交
        submit() {
            // 定义一个props属性，用于接收别的组件传进来的值。接收view里student和index信息
            this.stu = this.$props.student
            this.i = this.$props.index
            if (this.stu.name == null
                || this.stu.name == undefined
                || this.stu.name == '') {
                alert("姓名不能为空！")
                return
            }

            if (this.stu.enName == null
                || this.stu.enName == undefined
                || this.stu.enName == '') {
                alert("英文名不能为空！")
                return
            }
            // 正则表达式判断字符串中是否只有英文
            var reg = /^[A-Za-z]+$///表示必须完全由大小写字母组成，长度不限
            var onlyEnglish = reg.test(this.stu.enName)//reg.test正则表达式的匹配工具
            var enName = this.stu.enName
             if (!onlyEnglish) {
                // 字符串不是纯英文
                alert("英文名必须是纯英文字母！")
                return
            } else if (enName.length < 2
                || enName.length > 10) {
                alert("英文名长度必须大于等于2且小于等于10个字母！")
                return
            }
            if (this.stu.class == null
                || this.stu.class == undefined) {
                alert("班级不能为空！")
                return
            }
            if (this.stu.gender == null
                || this.stu.gender == undefined
                || this.stu.gender == '') {
                alert("性别不能为空！")
                return
            }
            if (this.stu.age == null
                || this.stu.age == undefined) {
                alert("年龄不能为空！")
                return
            }
            // vue中 关于$emit的用法:
            // 1、父组件可以使用 props 把数据传给子组件。
            // 2、子组件可以使用 $emit 触发父组件的自定义事件。
            //这里是触发视图里的callback方法回调addOrUpdateStudent 并传入两个参来更新这一学生
            this.$emit('callback', this.stu, this.i)
            //修改提交后清空里所有数据
            this.clear()
        },
        clear() {
            // 清空学生字典
            this.stu = {}
             // 下标 默认为-1 通过数组下标位置为-1时,往数组末尾追加一个学生字典
            this.i = -1
        }
    }
})

var vm = new Vue({
    el: '#app',//绑定
    data: {
        //默认显示主页面
        studentListFlag: true
    }
})