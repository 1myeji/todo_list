import { getTodo, addTodo, deleteTodo, editTodo, changeOrder } from "./api.js"

const alert = document.querySelector('.todo-alert')
const form = document.querySelector('.todo-form')
const todo = document.querySelector('.todo')
const submitBtn = document.querySelector('.submit-btn')
const container = document.querySelector('.todocontainer')
const list = document.querySelector('.list')
const clearBtn = document.querySelector('.clear-btn')
const orderchangeBtn = document.querySelector('.orderchange-btn')
const spinner = document.querySelector('.spinner-border')
const select = document.querySelector('.form-select')

let editlist, editupdate, editID, editOrder, editDone, update 
let editFlag = false
let overlap = false
let idArray= []

// 새로고침
window.onbeforeunload = () => {
  spinner.classList.add('show-container')
}
window.addEventListener('DOMContentLoaded', loadlist)
// submit 하면
form.addEventListener('submit', addlist)
// clear items 누르면
clearBtn.addEventListener('click', clearlist)

// 리스트 추가
async function addlist(e) {
  e.preventDefault()
  // 중복값 안 되게
  let title = todo.value
  const lists = await getTodo()
  for(const list of lists) {
    if(title === list.title) {
      displayAlert('this value already exists', 'danger')
      overlap = true
      todo.value = ''
    } 
  }
  // 할 일을 완료한 항목과 완료하지 않은 항목 분류해서 출력
  let doneYet = select.value
  if(!title && doneYet === 'done') {
    list.innerHTML = ''
    for(const list of lists) {
      if(list.done === true) {
        date(list.updatedAt)
        let check = 'checked'
        createTodo(list.title, list.id, update, check)
      }
    }
  } else if(!title && doneYet === 'yet') {
    list.innerHTML = ''
    for(const list of lists) {
      if(list.done === false) {
        date(list.updatedAt)
        createTodo(list.title, list.id, update)
      }
    }
  } else if((!title && doneYet === 'all')) {
    list.innerHTML = ''
    for(const list of lists) {
      date(list.updatedAt)
      if(list.done === true) {
        let check = 'checked'
        createTodo(list.title, list.id, update, check)
      } else createTodo(list.title, list.id, update)
    }
  }
  
  if(title && doneYet === 'all' && !editFlag && !overlap){
    spinner.classList.add('show-container')
    let lists = await getTodo()
    let order = lists.length
    let todos = await addTodo(title, order)
    const { id, updatedAt } = todos
    date(updatedAt)
    idArray.push(id)
    createTodo(title, id, update)
    displayAlert('value added to the list', 'success')
    container.classList.add('show-container')
    spinner.classList.remove('show-container')
    setBackToDefault()
  } 
  else if(title && doneYet === 'all' && editFlag && !overlap){
    spinner.classList.add('show-container')
    editlist.innerHTML = title
    let lists = await editTodo(editID, title, editDone, editOrder)
    const { updatedAt } = lists
    date(updatedAt)
    editupdate.innerHTML = update
    displayAlert('list value changed', 'success')
    spinner.classList.remove('show-container')
    setBackToDefault()
  }
  // else if(!title && doneYet === 'all' && !overlap){
  //   displayAlert('please enter value', 'danger')
  // }
  setBackToDefault()
}

// 날짜 포맷 변경
function date (updatedAt) {
  let date = new Date(updatedAt);
  let year = date.getFullYear();
  let month = ('0' + (date.getMonth() + 1)).slice(-2);
  let day = ('0' + date.getDate()).slice(-2);
  let hours = ('0' + date.getHours()).slice(-2); 
  let minutes = ('0' + date.getMinutes()).slice(-2);
  let seconds = ('0' + date.getSeconds()).slice(-2);
  update = `update : ${year}년 ${month}월 ${day}일 ${hours}:${minutes}:${seconds}`
}

async function createTodo(title, id, update, check) {
  const element = document.createElement('article')
  // add class
  element.classList.add('item')
  const attr = document.createAttribute('data-id')
  attr.value = id
  element.setAttributeNode(attr)
  element.innerHTML = /* html */`
    <div class="form-check">
      <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" ${check}>
      <label class="form-check-label" for="flexCheckDefault">
        <p class="title">${title}</p>
      </label>
    </div>
    <div class="btn-container">
      <p class="update">${update}</p>
      <button type="button" class="edit-btn">
        <i class="fa-solid fa-file-pen"></i>
      </button>
      <button type="button" class="delete-btn">
        <i class="fa-sharp fa-solid fa-trash"></i>
      </button>
    </div>
  `
  const deleteBtn = element.querySelector('.delete-btn')
  const editBtn = element.querySelector('.edit-btn')
  deleteBtn.addEventListener('click', deleteItem)
  editBtn.addEventListener('click', editItem)
  list.appendChild(element)
  // checked
  const checkbox = element.querySelector('.form-check-input')
  checkbox.addEventListener('click', async function isChecked (e) {
    const element = e.currentTarget.parentElement.parentElement
    const lists = await getTodo()
    if(checkbox.checked === true) {
      lists.forEach((list, i) => {
      if(list.id === element.dataset.id) {
        editTodo(list.id, list.title, true, list.order)
      }
      }) 
    }
    else if(checkbox.checked === false) {
      lists.forEach((list, i) => {
      if(list.id === element.dataset.id) {
        editTodo(list.id, list.title, false, list.order)
      }
      })
    }   
  })  
  list.addEventListener('drop', changelist)
}


// alert 표시
function displayAlert(text, action) {
  alert.textContent = text
  alert.classList.add(`todoalert-${action}`)
  setTimeout(function() {
    alert.textContent = ''
    alert.classList.remove(`todoalert-${action}`)
  }, 1500)
}

// delete all lists
async function clearlist() {
  spinner.classList.add('show-container')
  const items = document.querySelectorAll('.item')
  if(items.length > 0) {
    items.forEach(item => {
      list.removeChild(item)
    })
  }
  let lists = await getTodo()
  for(const list of lists) {
    const { id } = list
    await deleteTodo(id)
    idArray = []
  }
  container.classList.remove('show-container')
  displayAlert('All lists deleted', 'danger')
  spinner.classList.remove('show-container')
  setBackToDefault()
}

// delete
async function deleteItem(e) {
  spinner.classList.add('show-container')
  const element = e.currentTarget.parentElement.parentElement
  const title = element.querySelector('p').textContent
  list.removeChild(element)
  if(list.children.length === 0) {
    container.classList.remove('show-container')
  }
  displayAlert('list is deleted', 'danger')
  let lists = await getTodo()
  for(const list of lists) {
    if(title === list.title) {
      const { id, order } = list
      await deleteTodo(id)
      idArray.filter(value => value !== id)
    }
  }
  spinner.classList.remove('show-container')
  // delete시 order 변경
  lists = await getTodo()
  for(let i = 0; i < lists.length; i++) {
    let {id, title, done, order} = lists[i]
    if(i !== order) {
      order = i
      await editTodo(id, title, done, order)
    }
  }
  setBackToDefault()
}

// edit
async function editItem(e) {
  editlist = e.currentTarget.parentElement.previousElementSibling.querySelector('.title')
  editupdate = e.currentTarget.previousElementSibling
  todo.value = editlist.innerHTML
  let lists = await getTodo()
  for(const list of lists) {
    if(editlist.textContent === list.title ) {
      const { id, order, done } = list
      editID = id
      editOrder = order
      editDone = done
      break
    }
  }
  editFlag = true
  submitBtn.textContent = 'edit'
}

// 새로고침시
async function loadlist() {
  let lists = await getTodo()
  if(lists.length > 0) {
    container.classList.add('show-container')
    for(const list of lists){
      date(list.updatedAt)
      if(list.done === true) {
        let check = 'checked'
        createTodo(list.title, list.id, update, check)
      } else createTodo(list.title, list.id, update)
      idArray.push(list.id)
    }
  }
}

// 목록 순서 변경
new Sortable(list, {
  animation: 150,
  ghostClass: 'blue-backgorund-class'
})
async function changelist () {
  for(let i = 0; i < idArray.length; i++) {
    const pTitle = document.querySelectorAll('.title')[i].textContent
    let lists = await getTodo()
    if (pTitle != lists[i].title) {
      let articleArray = []
      for(let j = 0; j < idArray.length; j++) {
        let articleId = document.querySelectorAll('.item')[j].dataset.id
        articleArray.push(articleId)
        await changeOrder(articleArray)
      }
    } 
  }
}

// set back to default
function setBackToDefault () {
  todo.value = ''
  editFlag = false
  overlap = false
  submitBtn.textContent = 'submit'
}