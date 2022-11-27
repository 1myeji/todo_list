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
let editID = ''

// submit form
form.addEventListener('submit', addItem)
// clear items
clearBtn.addEventListener('click', clearItems)
window.addEventListener('DOMContentLoaded', setupItems)

async function addItem(e) {
  e.preventDefault()
  const value = todo.value
  await addTodo(value)
  // await getTodo()
  // const id = new Date().getTime().toString()
  if(value && !editFlag){
    createListItem(value)
    displayAlert('item added to the list', 'success')
    container.classList.add('show-container')
    // add to local storage
    addToLocalStorage(id, value)
    // set back to default
    setBackToDefault()
  }
  else if(value && editFlag){
    editElement.innerHTML = value
    displayAlert('value changed', 'success')
    // edit local storage
    editLocalStorage(editID, value)
    setBackToDefault()
  }
  else{
    displayAlert('please enter value', 'danger')
  }
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

function clearItems() {
  const items = document.querySelectorAll('.item')

  if(items.length > 0) {
    items.forEach(item => {
      list.removeChild(item)
    })
  }
  container.classList.remove('show-container')
  displayAlert('empty list', 'danger')
  setBackToDefault()
  localStorage.removeItem('list')
}

function deleteItem(e) {
  const element = e.currentTarget.parentElement.parentElement
  const id = element.dataset.id
  list.removeChild(element)
  if(list.children.length === 0) {
    container.classList.remove('show-container')
  }
  displayAlert('item removed', 'danger')
  setBackToDefault()
  // remove from local storage
  removeFromLocalStorage(id)
}

function editItem(e) {
  const element = e.currentTarget.parentElement.parentElement
  editElement = e.currentTarget.parentElement.previousElementSibling
  todo.value = editElement.innerHTML
  editFlag = true
  editID = element.dataset.id
  submitBtn.textContent = 'edit'
}

// set back to default
function setBackToDefault () {
  todo.value = ''
  editFlag = false
  editID = ''
  submitBtn.textContent = 'submit'
}
//local storage
function addToLocalStorage(id, value) {
  const todo = {id: id, value: value}
  let items = getLocalStorage()
  console.log(items);

  items.push(todo)
  localStorage.setItem('list', JSON.stringify(items))
}
function removeFromLocalStorage(id) {
  let items = getLocalStorage()

  items = items.filter((item) => {
    if(item.id !== id) {
      return item
    }
  })
  localStorage.setItem('list', JSON.stringify(items))
}
function editLocalStorage(id, value) {
  let items = getLocalStorage()
  items = items.map((item) => {
    if(item.id === id) {
      item.value = value
    }
    return item
  })
  localStorage.setItem('list', JSON.stringify(items))
}
function getLocalStorage() {
  return localStorage.getItem('list')? JSON.parse(localStorage.getItem('list')) : []
}

function setupItems() {
  let items = getLocalStorage()
  if(items.length > 0) {
    items.forEach((item) => {
      createListItem(item.id, item.value)
    })
    container.classList.add('show-container')
  }
}

function createListItem(value) {
  const element = document.createElement('article')
  // add class
  element.classList.add('item')
  // add id
  const attr = document.createAttribute('data-id')
  attr.value = id
  element.setAttributeNode(attr)
  element.innerHTML = /* html */`
    <p class="title">${value}</p>
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

// localStorage.setItem('orange', JSON.stringify(['item', 'item2']))
// const oranges = JSON.parse(localStorage.getItem('orange'))
// console.log(oranges);
// localStorage.removeItem('orange')