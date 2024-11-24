<template>
  <section class="p-4">
    <div class="mb-4 flex gap-4">
      <button
        @click="openAddTaskModal"
        class="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 flex items-center gap-2"
      >
        Добавить задачу
      </button>
      <button
        @click="toggleView"
        class="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 flex items-center gap-2"
      >
        {{ isKanbanView ? 'Список задач' : 'Изменить вид' }}
      </button>
    </div>

    <div v-if="taskStore.isLoading" class="mb-4">Загрузка задач...</div>
    <p v-show="tasks.length === 0 && !taskStore.isLoading" class="text-2xl">Задач нет &#127882;</p>

    <KanbanBoard v-if="isKanbanView && tasks.length !== 0" />
    <ul v-else class="space-y-4">
      <TaskItem
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        @toggle-complete="toggleComplete"
        @delete-task="openDeleteTaskModal"
        @edit-task="openEditTaskModal"
      />
    </ul>

    <DeleteTaskModal
      v-if="isDeleteModalVisible"
      :is-visible="isDeleteModalVisible"
      :task-name="taskToDelete?.title"
      @close="closeDeleteModal"
      @delete="deleteTask"
    />
    <EditTaskModal
      v-if="isEditModalVisible"
      :is-visible="isEditModalVisible"
      :task="taskToEdit"
      @close="closeEditModal"
      @save="saveTaskChanges"
    >
      <template #title>
        {{ isEditMode ? 'Редактировать задачу' : 'Добавить задачу' }}
      </template>
    </EditTaskModal>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTaskStore } from '@/stores/taskStore'
import TaskItem from './TaskItem.vue'
import EditTaskModal from './EditTaskModal.vue'
import DeleteTaskModal from './DeleteTaskModal.vue'
import KanbanBoard from './KanbanBoard.vue'

const taskStore = useTaskStore()

const tasks = computed(() => taskStore.filteredAndSortedTasks)

onMounted(() => {
  taskStore.fetchTasks()
})

const isEditModalVisible = ref(false)
const isDeleteModalVisible = ref(false)
const taskToEdit = ref(null)
const taskToDelete = ref(null)
const isEditMode = ref(false)

const isKanbanView = ref(false)

const openAddTaskModal = () => {
  isEditMode.value = false
  taskToEdit.value = {
    title: '',
    description: '',
    dueDate: '',
    status: 'todo',
    isCompleted: false,
  }
  isEditModalVisible.value = true
}

const openEditTaskModal = (task) => {
  isEditMode.value = true
  taskToEdit.value = { ...task }
  isEditModalVisible.value = true
}

const openDeleteTaskModal = (taskId) => {
  taskToDelete.value = taskStore.tasks.find((task) => task.id === taskId)
  isDeleteModalVisible.value = true
}

const closeDeleteModal = () => {
  isDeleteModalVisible.value = false
}

const closeEditModal = () => {
  isEditModalVisible.value = false
}

const saveTaskChanges = async (editedTask) => {
  if (isEditMode.value) {
    await taskStore.updateTask(editedTask)
  } else {
    await taskStore.addTask(editedTask)
  }
  closeEditModal()
}

const toggleComplete = async (id) => {
  await taskStore.toggleComplete(id)
}

const deleteTask = async () => {
  if (taskToDelete.value) {
    await taskStore.deleteTask(taskToDelete.value.id)
    closeDeleteModal()
  }
}

const toggleView = () => {
  isKanbanView.value = !isKanbanView.value
}
</script>
