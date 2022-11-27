// 항목 추가
export async function addTodo(title) {
  const res = await fetch('https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'apikey': 'FcKdtJs202209',
      'username': 'KDT3_ImYeJi'
    },
    body: JSON.stringify({
      title
    })
  })
  const json = await res.json()
  console.log(json)
  return json
}