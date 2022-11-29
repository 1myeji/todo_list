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

let editlist
let editupdate
let editFlag = false
let overlap = false
let editID
let done = false // 일단 해둠
let editOrder
let idArray= []
let update 

// 새로고침
window.onbeforeunload = () => {
  spinner.classList.add('show-container')
}
window.addEventListener('DOMContentLoaded', loadlist)
// submit 하면
form.addEventListener('submit', addlist)
// clear items 누르면
clearBtn.addEventListener('click', clearlist)

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
  if(title && !editFlag && !overlap){
    spinner.classList.add('show-container')
    let lists = await getTodo()
    let order = lists.length
    let todos = await addTodo(title, order)
    const { id, updatedAt } = todos
    date(updatedAt)
    idArray.push(id)
    createTodo(title, id, update)
    displayAlert('todo added to the list', 'success')
    container.classList.add('show-container')
    spinner.classList.remove('show-container')
    setBackToDefault()
  } 
  else if(title && editFlag && !overlap){
    spinner.classList.add('show-container')
    editlist.innerHTML = title
    let lists = await editTodo(editID, title, done, editOrder)
    const { updatedAt } = lists
    date(updatedAt)
    editupdate.innerHTML = update
    displayAlert('value changed', 'success')
    spinner.classList.remove('show-container')
    setBackToDefault()
  }
  else if(!title && !overlap){
    displayAlert('please enter value', 'danger')
  }
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
  update = `update : ${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

function createTodo(title, id, update) {
  const element = document.createElement('article')
  // add class
  element.classList.add('item')
  const attr = document.createAttribute('data-id')
  attr.value = id
  element.setAttributeNode(attr)
  element.innerHTML = /* html */`
    <p class="title">${title}</p>
    <p class="update">${update}</p>
    <div class="btn-container">
      <button type="button" class="edit-btn">
        <i class="fas fa-edit"></i>
      </button>
      <button type="button" class="delete-btn">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `
  const deleteBtn = element.querySelector('.delete-btn')
  const editBtn = element.querySelector('.edit-btn')
  deleteBtn.addEventListener('click', deleteItem)
  editBtn.addEventListener('click', editItem)
  list.appendChild(element)
  list.addEventListener('drop', changelist)
}

// display alert
function displayAlert(text, action) {
  alert.textContent = text
  alert.classList.add(`todoalert-${action}`)

  // remove alert
  setTimeout(function() {
    alert.textContent = ''
    alert.classList.remove(`todoalert-${action}`)
  }, 1000)
}

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
  displayAlert('empty list', 'danger')
  spinner.classList.remove('show-container')
  setBackToDefault()
}

async function deleteItem(e) {
  spinner.classList.add('show-container')
  const element = e.currentTarget.parentElement.parentElement
  const title = element.querySelector('p').textContent
  list.removeChild(element)
  if(list.children.length === 0) {
    container.classList.remove('show-container')
  }
  displayAlert('item removed', 'danger')
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

async function editItem(e) {
  editlist = e.currentTarget.parentElement.previousElementSibling.previousElementSibling
  editupdate = e.currentTarget.parentElement.previousElementSibling
  todo.value = editlist.innerHTML
  let lists = await getTodo()
  for(const list of lists) {
    if(editlist.textContent === list.title ) {
      const { id, order } = list
      editID = id
      editOrder = order
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
    for(const list of lists) {
      date(list.updatedAt)
      createTodo(list.title, list.id, update)
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