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
import {
  classListController,
  date,
  createTodo,
  displayAlert,
  setBackToDefault,
} from "./main.js";

export async function submitlist(e) {
  e.preventDefault();
  let title = todo.value;
  const lists = await getTodo();
  // 중복값은 추가 할 수 없게 하기
  for (const list of lists) {
    if (title === list.title) {
      displayAlert("this value already exists", "danger");
      todo.value = "";
      return;
    }
  }
  // Select하고 Submit할 때, 할 일을 완료한 항목과 완료하지 않은 항목 분류해서 출력
  let doneYet = select.value;
  // Done을 select 하고 Submit
  if (!title && doneYet === "done") {
    list.innerHTML = "";
    for (const list of lists) {
      if (list.done === true) {
        date(list.updatedAt);
        let check = "checked";
        createTodo(list.title, list.id, state.update, check);
      }
    }
    return;
  }
  // Yet을 select 하고 Submit
  if (!title && doneYet === "yet") {
    list.innerHTML = "";
    for (const list of lists) {
      if (list.done === false) {
        date(list.updatedAt);
        let check = null;
        createTodo(list.title, list.id, state.update, check);
      }
    }
    return;
  }
  // All을 select하고 Submit
  if (!title && doneYet === "all") {
    list.innerHTML = "";
    for (const list of lists) {
      date(list.updatedAt);
      if (list.done === true) {
        let check = "checked";
        createTodo(list.title, list.id, state.update, check);
        continue;
      }
      createTodo(list.title, list.id, state.update);
    }
    return;
  }
  // input값을 입력하고 Submit, addlist
  if (title && doneYet === "all" && !state.editFlag) {
    classListController(spinner, "add");
    let order = lists.length;
    let todos = await addTodo(title, order);
    const { id, updatedAt } = todos;
    date(updatedAt);
    state.idArray.push(id);
    createTodo(title, id, state.update);
    displayAlert("value added to the list", "success");
    classListController(container, "add");
    classListController(spinner, "remove");
    setBackToDefault();
    return;
  }
  // edit 하고 Submit
  if (title && doneYet === "all" && state.editFlag) {
    classListController(spinner, "add");
    state.editlist.innerHTML = title;
    let lists = await editTodo(
      state.editID,
      title,
      state.editDone,
      state.editOrder
    );
    const { updatedAt } = lists;
    date(updatedAt);
    state.editupdate.innerHTML = state.update;
    displayAlert("list value changed", "success");
    classListController(spinner, "remove");
    setBackToDefault();
  }
}
