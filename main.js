import { getTodo, addTodo, deleteTodo, editTodo, changeOrder } from "./api.js";
import {
  alert,
  form,
  todo,
  submitBtn,
  container,
  list,
  clearBtn,
  orderchangeBtn,
  spinner,
  select,
  state,
} from "./store.js";
import { submitlist } from "./submit.js";

// 새로고침
window.addEventListener("DOMContentLoaded", loadlist);
async function loadlist() {
  classListController(spinner, "add");
  let lists = await getTodo();
  if (lists.length === 0) {
    classListController(spinner, "remove");
    return;
  }
  classListController(container, "add");
  for (const list of lists) {
    date(list.updatedAt);
    // 새로고침하면 idArray값이 초기화되기 때문에 다시 넣어주기
    state.idArray.push(list.id);
    if (list.done === true) {
      // 새로고침해도 check 표시 남을 수 있도록
      let check = "checked";
      createTodo(list.title, list.id, state.update, check);
      continue;
    }
    createTodo(list.title, list.id, state.update);
  }
  classListController(spinner, "remove");
}

// Submit
form.addEventListener("submit", submitlist);

// Delete All Lists 누르면
clearBtn.addEventListener("click", clearlist);
async function clearlist() {
  classListController(spinner, "add");
  const items = document.querySelectorAll(".item");
  if (items.length > 0) {
    items.forEach((item) => {
      list.removeChild(item);
    });
  }
  let lists = await getTodo();
  for (const list of lists) {
    const { id } = list;
    await deleteTodo(id);
    state.idArray = [];
  }
  classListController(container, "remove");
  displayAlert("All lists deleted", "danger");
  classListController(spinner, "remove");
  setBackToDefault();
}

// 날짜 포맷 변경
export function date(updatedAt) {
  let date = new Date(updatedAt);
  let year = date.getFullYear();
  let month = ("0" + (date.getMonth() + 1)).slice(-2);
  let day = ("0" + date.getDate()).slice(-2);
  let hours = ("0" + date.getHours()).slice(-2);
  let minutes = ("0" + date.getMinutes()).slice(-2);
  let seconds = ("0" + date.getSeconds()).slice(-2);
  state.update = `update : ${year}년 ${month}월 ${day}일 ${hours}:${minutes}:${seconds}`;
}

export async function createTodo(title, id, update, check) {
  const element = document.createElement("article");
  element.classList.add("item");
  const attr = document.createAttribute("data-id");
  attr.value = id;
  element.setAttributeNode(attr);
  element.innerHTML = /* html */ `
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
  `;
  const deleteBtn = element.querySelector(".delete-btn");
  const editBtn = element.querySelector(".edit-btn");
  deleteBtn.addEventListener("click", deleteItem);
  editBtn.addEventListener("click", editItem);
  list.appendChild(element);
  // checked
  const checkbox = element.querySelector(".form-check-input");
  checkbox.addEventListener("click", async function isChecked(e) {
    const element = e.currentTarget.parentElement.parentElement;
    const lists = await getTodo();
    if (checkbox.checked === true) {
      lists.forEach((list, i) => {
        if (list.id === element.dataset.id) {
          editTodo(list.id, list.title, true, list.order);
        }
      });
    } else if (checkbox.checked === false) {
      lists.forEach((list, i) => {
        if (list.id === element.dataset.id) {
          editTodo(list.id, list.title, false, list.order);
        }
      });
    }
  });
  list.addEventListener("drop", changelist);
}

// alert 표시
export function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`todoalert-${action}`);
  setTimeout(function () {
    alert.textContent = "";
    alert.classList.remove(`todoalert-${action}`);
  }, 1100);
}

// delete
async function deleteItem(e) {
  classListController(spinner, "add");
  const element = e.currentTarget.parentElement.parentElement;
  const title = element.querySelector("p").textContent;
  list.removeChild(element);
  if (list.children.length === 0) {
    classListController(container, "remove");
  }
  displayAlert("list is deleted", "danger");
  let lists = await getTodo();
  for (const list of lists) {
    if (title === list.title) {
      const { id, order } = list;
      await deleteTodo(id);
      state.idArray.filter((value) => value !== id);
    }
  }
  classListController(spinner, "remove");
  // delete시 order 변경
  lists = await getTodo();
  for (let i = 0; i < lists.length; i++) {
    let { id, title, done, order } = lists[i];
    if (i !== order) {
      order = i;
      await editTodo(id, title, done, order);
    }
  }
  setBackToDefault();
}

// edit
async function editItem(e) {
  state.editlist =
    e.currentTarget.parentElement.previousElementSibling.querySelector(
      ".title"
    );
  state.editupdate = e.currentTarget.previousElementSibling;
  todo.value = state.editlist.innerHTML;
  let lists = await getTodo();
  for (const list of lists) {
    if (state.editlist.textContent === list.title) {
      const { id, order, done } = list;
      state.editID = id;
      state.editOrder = order;
      state.editDone = done;
      break;
    }
  }
  state.editFlag = true;
  submitBtn.textContent = "edit";
}

// 목록 순서 변경
new Sortable(list, {
  animation: 150,
  ghostClass: "blue-backgorund-class",
});
async function changelist() {
  for (let i = 0; i < state.idArray.length; i++) {
    const pTitle = document.querySelectorAll(".title")[i].textContent;
    let lists = await getTodo();
    if (pTitle != lists[i].title) {
      let articleArray = [];
      for (let j = 0; j < state.idArray.length; j++) {
        let articleId = document.querySelectorAll(".item")[j].dataset.id;
        articleArray.push(articleId);
        await changeOrder(articleArray);
      }
    }
  }
}

// set back to default
export function setBackToDefault() {
  todo.value = "";
  state.editFlag = false;
  submitBtn.textContent = "submit";
}

// 반복되는 classList를 함수로 관리
export function classListController(element, type) {
  switch (type) {
    case "add":
      element.classList.add("show");
      break;
    case "remove":
      element.classList.remove("show");
      break;
    default:
      break;
  }
}
