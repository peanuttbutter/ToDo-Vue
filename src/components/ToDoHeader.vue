<template>
  <header class="w-full bg-gray-800 text-white p-4 flex justify-between items-center">
    <h1 class="text-3xl font-bold">ToDo</h1>

    <div class="flex items-center gap-4">

      <div class="relative" ref="filterMenu">
        <button
          class="flex items-center bg-gray-700 hover:bg-gray-600 p-2 rounded-full"
          @click="toggleFilterMenu"
        >
          <span class="material-icons">filter_alt</span>
        </button>
        <ul
          v-if="showFilterMenu"
          class="absolute right-0 mt-2 w-40 bg-gray-700 text-white rounded-lg shadow-lg"
        >
          <li
            v-for="option in filterOptions"
            :key="option.value"
            @click="setFilter(option.value)"
            class="px-4 py-2 hover:bg-gray-600 cursor-pointer"
          >
            {{ option.label }}
          </li>
        </ul>
      </div>

      <div class="relative" ref="sortMenu">
        <button
          class="flex items-center bg-gray-700 hover:bg-gray-600 p-2 rounded-full"
          @click="toggleSortMenu"
        >
          <span class="material-icons">sort</span>
        </button>
        <ul
          v-if="showSortMenu"
          class="absolute right-0 mt-2 w-40 bg-gray-700 text-white rounded-lg shadow-lg"
        >
          <li
            v-for="option in sortOptions"
            :key="option.value"
            @click="setSort(option.value)"
            class="px-4 py-2 hover:bg-gray-600 cursor-pointer"
          >
            {{ option.label }}
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useTaskStore } from '@/stores/taskStore'

const taskStore = useTaskStore()

const showFilterMenu = ref(false)
const showSortMenu = ref(false)

const filterMenu = ref(null)
const sortMenu = ref(null)

const filterOptions = [
  { label: 'Все', value: 'all' },
  { label: 'Выполненные', value: 'completed' },
  { label: 'Невыполненные', value: 'incomplete' },
]

const sortOptions = [
  { label: 'По возрастанию', value: 'asc' },
  { label: 'По убыванию', value: 'desc' },
]

const toggleFilterMenu = () => (showFilterMenu.value = !showFilterMenu.value)
const toggleSortMenu = () => (showSortMenu.value = !showSortMenu.value)

const setFilter = (value) => {
  showFilterMenu.value = false
  taskStore.setFilter(value)
}

const setSort = (value) => {
  showSortMenu.value = false
  taskStore.setSortOrder(value)
}

const closeMenus = (event) => {
  const isClickInsideFilter = filterMenu.value?.contains(event.target)
  const isClickInsideSort = sortMenu.value?.contains(event.target)

  if (!isClickInsideFilter) showFilterMenu.value = false
  if (!isClickInsideSort) showSortMenu.value = false
}

onMounted(() => {
  document.addEventListener('click', closeMenus)
})

onUnmounted(() => {
  document.removeEventListener('click', closeMenus)
})
</script>

<style scoped>
.material-icons {
  font-size: 24px;
}
</style>
