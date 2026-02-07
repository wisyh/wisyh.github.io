import { supabase } from './supabaseClient.js'

// 获取并显示 todos
async function loadTodos() {
  const { data, error } = await supabase
    .from('todos')
    .select('*')
  
  const list = document.getElementById('todo-list')
  
  if (error) {
    list.innerHTML = `<li style="color:red">错误: ${error.message}</li>`
    return
  }
  
  if (data.length === 0) {
    list.innerHTML = '<li>暂无数据</li>'
    return
  }
  
  list.innerHTML = data.map(todo => `
    <li>
      <strong>${todo.task}</strong> - 
      <span style="color:${getStatusColor(todo.status)}">${todo.status}</span>
    </li>
  `).join('')
}

function getStatusColor(status) {
  const colors = {
    'Complete': 'green',
    'In progress': 'orange',
    'Not Started': 'gray'
  }
  return colors[status] || 'black'
}

// 添加新任务
async function addTodo(task) {
  const { data, error } = await supabase
    .from('todos')
    .insert([{ task: task, status: 'Not Started' }])
  
  if (error) {
    alert('添加失败: ' + error.message)
    return
  }
  
  loadTodos() // 刷新列表
  return data
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
  loadTodos()
  
  // 绑定添加按钮
  document.getElementById('add-btn').addEventListener('click', () => {
    const input = document.getElementById('new-task')
    if (input.value.trim()) {
      addTodo(input.value.trim())
      input.value = ''
    }
  })
})
