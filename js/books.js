const STRORAGE_KEY = "books"
//定义本地储存loaclstrorage
const bookStrorage = {
    fetch: function () {
        return JSON.parse(window.localStorage.getItem(STRORAGE_KEY) || '[]')
    },
    save: function (books) {
        window.localStorage.setItem(STRORAGE_KEY, JSON.stringify(books))
        console.log("的男女单独你")
    }
}
//定义数组
const books = [

]
const users = [
    {
        username: 'admin',
        upassword: 'admin123'
    }
]
Vue.component('loginframe', {
    template: '#login',
    data() {
        return {
            loginf: true,
            username: '',
            upassword: '',
            users: users,
            lname: '',
            email: '',
            lpassword: '',
            spassword: '',

        }

    },
    methods: {
        login() {
            if (this.username == 'admin' && this.upassword == 'admin123') {
                this.loginf = false,
                    // this.$parent.LoginFlag=false
                    this.$parent.BooksFlag = true
            } else {
                alert('账号或密码错误')
            }

        },
        register() {

        }
    },
})

Vue.component('bookframe', {
    template: '#books',
    data() {
        return {
            booksf: false,
            addbook: false,
            info: true,
            id: '',
            name: '',
            author: '',
            chubanshe: '',
            ISBN: '',
            banci: '',
            pingpai: '',
            yongzhi: '',
            pages: '',
            leibie: '',
            flag: false,
            submitFlag: false,
            // books:books,
            books: bookStrorage.fetch(),
            filterStatus: 'all'
        }
    },
    methods: {
        addo() {
            this.addbook = true
            this.info = false
        },
        add() {
            if (this.flag) {
                // 根据当前的id更新数组中对应的数据
                this.books.forEach(books => {
                    if (books.id == this.id) {
                        books.name = this.name;
                        books.author = this.author;
                        books.chubanshe = this.chubanshe;
                        books.ISBN = this.ISBN;
                        books.banci = this.banci;
                        books.pingpai = this.pingpai;
                        books.yongzhi = this.yongzhi;
                        books.pages = this.pages;
                        books.leibie = this.leibie;
                        return;
                    }
                });
                this.flag = false;
                
            } else {
                let result = this.books.some(item => {
                    return item.id == this.id;
                })
                if (result) {
                    alert("编号已存在")
                } else if (this.id.length != 0 && this.name.length != 0) {
                    this.books.push({
                        id: this.id, name: this.name, author: this.author, chubanshe: this.chubanshe, ISBN: this.ISBN,
                        banci: this.banci, pingpai: this.pingpai, yongzhi: this.yongzhi, pages: this.pages, leibie: this.leibie, date: '',

                    });
                    
                }
            }
            //清空表单
            this.addbook = false
            this.info = true
            this.id = '';
            this.name = '';
            this.author = '';
            this.chubanshe = '',
                this.ISBN = '',
                this.banci = '',
                this.pingpai = '',
                this.yongzhi = '',
                this.pages = '',
                this.leibie = '';
        },
        cancel() {
            this.addbook = false
            this.info = true
        },
        updateBook(id) {
            // 禁止改变id
            this.flag = true;
            //根据id查询要编辑的数据
            this.addbook = true
            this.info = false
            let book = this.books.filter(books => {
                return books.id == id;
            });
            //把获取的信息填充表单
            this.id = book[0].id;
            this.name = book[0].name;
            this.author = book[0].author;
            this.chubanshe = book[0].chubanshe;
            this.ISBN = book[0].ISBN;
            this.banci = book[0].banci;
            this.pingpai = book[0].pingpai;
            this.yongzhi = book[0].yongzhi;
            this.pages = book[0].pages;
            this.leibie = book[0].leibie;
        },
        //删除图书
        deleteBook(id) {
            //通过数组的filter方法进行删除
            this.books = this.books.filter(books => {
                // 排除掉id不等于books.id中的项
                return books.id !== id;
            })
        }
    },
    //时间过滤器
    filters: {
        format() {
            let date = new Date();
            return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        }
    },
    //自定义指令
    directives: {
        focus: {
            inserted(el) {
                el.focus();
            }
        }
    },
    //计算属性
    computed: {
        total() {
            //计算图书总数
            return this.books.length;
        },
        filterItems() {
            switch (this.filterStatus) {
                case 'wenxue':
                    return this.books.filter(books => books.leibie == "文学")
                    break;
                case 'gongcheng':
                    return this.books.filter(books => books.leibie == "工程")
                    break;
                case 'jingro':
                    return this.books.filter(books => books.leibie == "金融")
                    break;
                case 'xiaoshuo':
                    return this.books.filter(books => books.leibie == "小说")
                    break;
                case 'all':
                    return this.books
                    break;
            }
        }
    },
    watch: {
        books: {
            deep: true,
            handler: function (newBooks, oldBooks) {
            //    console.log('item的值发生变化了')
                bookStrorage.save(newBooks)
                // console.log('yigengxin')
            }
        },
        name: function (val) {
            // 验证图书名称是否已经存在
            this.submitFlag = this.books.some(books => {
                // 如果存在则为真，将submitflag等于true
                return books.name == val;
            })
        },

    }
    
})

const vm = new Vue({
    el: "#app",
    data: {
        // LoginFlag: false,
        // BooksFlag: true,
        LoginFlag: true,
        BooksFlag: false,
    },

})
//当hash值变化时，拿到当前的hash值
window.onhashchange = function () {
    vm.filterStatus = window.location.hash.substring(2) || 'all'
    console.log(vm.filterStatus)
}
window.onhashchange()

