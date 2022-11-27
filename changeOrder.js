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