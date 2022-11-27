import { getTodo } from "./getTodo.js"
import { addTodo } from "./addTodo.js"
import { deleteTodo } from "./deleteTodo.js"

const alert = document.querySelector('.alert')
const form = document.querySelector('.todo-form')
const todo = document.querySelector('.todo')
const submitBtn = document.querySelector('.submit-btn')
const container = document.querySelector('.container')
const list = document.querySelector('.list')
const clearBtn = document.querySelector('.clear-btn')

let editElement
let editFlag = false
let overlap = false

// submit 하면
form.addEventListener('submit', addItem)
// clear items 누르면
clearBtn.addEventListener('click', clearItems)
// 새로고침
// window.addEventListener('DOMContentLoaded', setupItems)

async function addItem(e) {
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
    await addTodo(title)
    await getTodo()
    createTodo(title)
    displayAlert('todo added to the list', 'success')
    container.classList.add('show-container')
    setBackToDefault()
  }
  else if(title && editFlag && !overlap){
    editElement.innerHTML = title
    displayAlert('value changed', 'success')
    setBackToDefault()
  }
  else if(!title && !overlap){
    displayAlert('please enter value', 'danger')
  }
  setBackToDefault()
}

function createTodo(title) {
  const element = document.createElement('article')
  // add class
  element.classList.add('item')
  element.innerHTML = /* html */`
    <p class="title">${title}</p>
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
  // 드래그&드랍
  new Sortable(list, {
    animation: 150,
    ghostClass: 'blue-backgorund-class'
  })
  list.appendChild(element)
}

// display alert
function displayAlert(text, action) {
  alert.textContent = text
  alert.classList.add(`alert-${action}`)

  // remove alert
  setTimeout(function() {
    alert.textContent = ''
    alert.classList.remove(`alert-${action}`)
  }, 1000)
}

async function clearItems() {
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
  }
  container.classList.remove('show-container')
  displayAlert('empty list', 'danger')
  setBackToDefault()
}

async function deleteItem(e) {
  const element = e.currentTarget.parentElement.parentElement
  const title = element.querySelector('p').textContent
  console.log(title);
  list.removeChild(element)
  if(list.children.length === 0) {
    container.classList.remove('show-container')
  }
  displayAlert('item removed', 'danger')
  
  let lists = await getTodo()
  for(const list of lists) {
    if(title === list.title) {
      const { id } = list
      await deleteTodo(id)
    }
  }
  setBackToDefault()
}

function editItem(e) {
  const element = e.currentTarget.parentElement.parentElement
  editElement = e.currentTarget.parentElement.previousElementSibling
  todo.value = editElement.innerHTML
  editFlag = true
  submitBtn.textContent = 'edit'
}

// set back to default
function setBackToDefault () {
  todo.value = ''
  editFlag = false
  overlap = false
  submitBtn.textContent = 'submit'
}

// function setupItems() {
//   let items = getLocalStorage()
//   if(items.length > 0) {
//     items.forEach((item) => {
//       createTodo(item.id, item.title)
//     })
//     container.classList.add('show-container')
//   }
// }
