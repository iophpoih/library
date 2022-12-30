(function (Vue) {
	'use strict';

	// Your starting point. Enjoy the ride!
	const items=[
		// {
		// 	id:1,
		// 	content:"java Homework",
		// 	completed:false
		// },
		// {
		// 	id:2,
		// 	content:"web Homework",
		// 	completed:false
		// },
		// {
		// 	id:3,
		// 	content:"python Homework",
		// 	completed:true
		// }
	]
	const STRORAGE_KEY='todo-list-items'
	//定义本地储存loaclstrorage
	const itemStrorage={
		fetch:function(){
			return JSON.parse(localStorage.getItem(STRORAGE_KEY)||'[]')
		},
		save:function(items){
			localStorage.setItem(STRORAGE_KEY,JSON.stringify(items))
		}
	}
	//全局指令写在vue外
	Vue.directive('focus',{
		inserted:function(el){
			el.focus()
		}
	})

	const vm = new Vue({
		el:'#todoapp',
		data:{
			// items:items
			items:itemStrorage.fetch(),
			inputValue:'',
			currentItem:null,
			filterStatus:'all',
		},
		//配置侦听器
		watch:{
			items:{
				deep:true,//深度侦听
				handler:function(newItems,oldItems){
					// console.log('item的值发生变化了')
					itemStrorage.save(newItems)
				}
			}
		},
		//计算属性
		computed:{
			filterItems(){
				switch(this.filterStatus){
					case 'active':
						return this.items.filter(item=>!item.completed)
						break;
					case 'completed':
						return this.items.filter(item=>item.completed)
						break;
					default:
						return this.items;
				}
			}
			,
			remaining(){
				// this.items.filter(function(item){
					// return !item.completed
				// })
				// return newitem.length
				return this.items.filter(item=>!item.completed).length
			},
			toggleAll:{
				set(newState){
					console.log('set'+"  "+newState)
					// this.items.forEach(function(item){
					// 	item.completed=newState
					// })
					this.items.forEach(item=>item.completed=newState)
				
				},
				get(){
					console.log('get'+"  "+this.remaining)
					return this.remaining === 0
				}

			},
		},
		
		methods: {

			cancelEdit(){
				this.currentItem=null
			},
			okEdit($event,index,item){
				const content=$event.target.value.trim()
				if(!content){
					this.del(index)
					return
				}
				item.content=content
				this.currentItem=null
				// this.items.splice(index,1,this.currentItem)
				// this.currentItem=null

			},
			editItem(item){
				this.currentItem=item
			},
			removeAll(){
				this.items=this.items.filter(item=>!item.completed)
			},
			addItem(){
				this.items.push({id:items.index+1,content:this.inputValue,completed:false}),
				this.inputValue=''
				
			},
			del(index){
				this.items.splice(index,1)
			}
		},
		directives:{
			'edit-focus':{
				update:function(el,){
					el.focus()
				}
			}
		}
	})


	


	//当Hash值变化时，拿到当前的Hash值
	window.onhashchange=function(){
		console.log(window.location.hash.substring(2))
		vm.filterStatus=window.location.hash.substring(2) ||'all'
	}
})(Vue);
