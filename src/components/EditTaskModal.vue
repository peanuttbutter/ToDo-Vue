<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10"
  >
    <div class="bg-white rounded-lg p-6 w-full max-w-md">

      <h3 class="text-lg font-semibold mb-4">
        <slot name="title">{{ isEditMode ? 'Редактировать задачу' : 'Добавить задачу' }}</slot>
      </h3>

      <form @submit.prevent="saveChanges">
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Название</label>
          <input
            v-model="editedTask.title"
            type="text"
            class="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Описание</label>
          <textarea
            v-model="editedTask.description"
            class="w-full border rounded px-3 py-2"
            required
          ></textarea>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Срок выполнения</label>
          <input v-model="editedTask.dueDate" type="date" class="w-full border rounded px-3 py-2" />
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Статус</label>
          <select v-model="editedTask.status" class="w-full border rounded px-3 py-2">
            <option value="todo">Сделать</option>
            <option value="inProgress">В процессе</option>
            <option value="done">Выполнено</option>
          </select>
        </div>

        <div class="flex justify-end gap-4">
          <button
            type="button"
            class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            @click="closeModal"
          >
            Отмена
          </button>
          <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Сохранить
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  },
  task: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close', 'save'])

const editedTask = ref({
  id: null,
  title: '',
  description: '',
  dueDate: '',
  status: 'todo',
})

const isEditMode = computed(() => !!props.task)

watch(
  () => props.task,
  (newTask) => {
    if (newTask) {
      editedTask.value = {
        id: newTask.id,
        title: newTask.title,
        description: newTask.description,
        dueDate: newTask.dueDate || '',
        status: newTask.status
      }
    } else {
      editedTask.value = {
        id: null,
        title: '',
        description: '',
        dueDate: '',
        status: 'todo',
      }
    }
  },
  { immediate: true },
)

const closeModal = () => {
  emit('close')
}

const validateForm = () => {
  return editedTask.value.title && editedTask.value.description
}

const saveChanges = () => {
  if (validateForm()) {
    emit('save', { ...editedTask.value })
  }
}
</script>


