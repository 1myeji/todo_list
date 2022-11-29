// 목록 조회
export async function getTodo() {
  const res = await fetch('https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos', {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      'apikey': 'FcKdtJs202209',
      'username': 'KDT3_ImYeJi'
    }
    })
    const json = await res.json()
    console.log(json)
    return json
  }

// 항목 추가
export async function addTodo(title, order) {
  const res = await fetch('https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'apikey': 'FcKdtJs202209',
      'username': 'KDT3_ImYeJi'
    },
    body: JSON.stringify({
      title,
      order
    })
  })
  const json = await res.json()
  console.log(json)
  return json
}

// 항목 삭제
export async function deleteTodo(id) {
  const res = await fetch(`https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos/${id}` , {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json',
      'apikey': 'FcKdtJs202209',
      'username': 'KDT3_ImYeJi'
    }
  });
  const json = await res.json();
  console.log(json);
  return json;
}

// 항목 수정
export async function editTodo(id, title, done, order) {
  const res = await fetch(`https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos/${id}`, {
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
      'apikey': 'FcKdtJs202209',
      'username': 'KDT3_ImYeJi'
    },
    body: JSON.stringify({
      title,
      done,
      order
    })
  })
  const json = await res.json()
  console.log(json)
  return json
}

// 목록 순서 변경
export async function changeOrder(todoIds) {
  const res = await fetch('https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos/reorder', {
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
      'apikey': 'FcKdtJs202209',
      'username': 'KDT3_ImYeJi'
    },
    body: JSON.stringify({
      todoIds
    })
  })
  const json = await res.json()
  console.log(json)
  return json
}