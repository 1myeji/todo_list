import { getTodo } from "./api.js";
import { classListController, date, createTodo } from "./main.js";
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

export async function loadlist() {
  classListController(spinner, "add");
  const lists = await getTodo();
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
