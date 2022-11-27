// 항목 수정
export async function editTodo(id, title, done) {
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
    })
  })
  const json = await res.json()
  console.log(json)
  return json
}
