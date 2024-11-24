import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import { io } from 'socket.io-client'

export const useTaskStore = defineStore('taskStore', () => {
  const tasks = ref([])
  const filter = ref('all')
  const sortOrder = ref('asc')
  const isLoading = ref(false)

  const API_URL = 'http://localhost:3000/tasks'
  const SOCKET_URL = 'http://localhost:3000'

  const socket = io(SOCKET_URL)

  socket.on('taskAdded', (task) => {
    tasks.value.push(task)
  })

  socket.on('taskUpdated', (updatedTask) => {
    const index = tasks.value.findIndex((task) => task.id === updatedTask.id)
    if (index !== -1) {
      tasks.value[index] = { ...updatedTask }
    }
  })

  socket.on('taskDeleted', (taskId) => {
    tasks.value = tasks.value.filter((task) => task.id !== taskId)
  })

  const filteredAndSortedTasks = computed(() => {
    let filteredTasks = tasks.value.slice()

    if (filter.value === 'completed') {
      filteredTasks = filteredTasks.filter((task) => task.isCompleted)
    } else if (filter.value === 'incomplete') {
      filteredTasks = filteredTasks.filter((task) => !task.isCompleted)
    }

    filteredTasks.sort((a, b) => {
      const dateA = a.dueDate ? new Date(a.dueDate) : null
      const dateB = b.dueDate ? new Date(b.dueDate) : null

      if (!dateA && !dateB) {
        return 0
      }
      if (!dateA) {
        return 1
      }
      if (!dateB) {
        return -1
      }

      if (sortOrder.value === 'asc') {
        return dateA - dateB
      } else {
        return dateB - dateA
      }
    })

    return filteredTasks
  })

  const fetchTasks = async () => {
    isLoading.value = true
    try {
      const response = await axios.get(API_URL)
      tasks.value = response.data.map((task) => ({
        ...task,
        isCompleted: task.status === 'done',
      }))
    } catch (error) {
      console.error('Ошибка при получении задач:', error)
    } finally {
      isLoading.value = false
    }
  }

  const addTask = async (newTask) => {
    try {
      const taskToAdd = {
        ...newTask,
        isCompleted: newTask.status === 'done',
      }
      await axios.post(API_URL, taskToAdd)
    } catch (error) {
      console.error('Ошибка при добавлении задачи:', error)
    }
  }

  const updateTask = async (updatedTask) => {
    try {
      const taskToUpdate = {
        ...updatedTask,
        isCompleted: updatedTask.status === 'done',
      }
      await axios.put(`${API_URL}/${taskToUpdate.id}`, taskToUpdate)
    } catch (error) {
      console.error('Ошибка при обновлении задачи:', error)
    }
  }

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`)
    } catch (error) {
      console.error('Ошибка при удалении задачи:', error)
    }
  }

  const toggleComplete = async (id) => {
    const task = tasks.value.find((task) => task.id === id)
    if (task) {
      const newStatus = task.isCompleted ? 'todo' : 'done'
      const updatedTask = {
        ...task,
        status: newStatus,
        isCompleted: !task.isCompleted,
      }
      await updateTask(updatedTask)
    }
  }

  const updateTaskStatus = async (id, status) => {
    const task = tasks.value.find((task) => task.id === id)
    if (task) {
      const isCompleted = status === 'done'
      const updatedTask = {
        ...task,
        status,
        isCompleted,
      }
      await updateTask(updatedTask)
    }
  }

  const setFilter = (newFilter) => {
    filter.value = newFilter
  }

  const setSortOrder = (newSortOrder) => {
    sortOrder.value = newSortOrder
  }

  return {
    tasks,
    filter,
    sortOrder,
    isLoading,
    filteredAndSortedTasks,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    updateTaskStatus,
    setFilter,
    setSortOrder,
  }
})
