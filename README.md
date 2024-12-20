# Инструкция по запуску проекта

## Установка и запуск проекта

1. Cклонируйте репозиторий:
   
   ```sh
   git clone https://github.com/peanuttbutter/ToDo-Vue.git; cd ToDo-Vue/ 
   ```

2. Установите все необходимые зависимости, указанные в `package.json`:

   ```sh
   npm install 
   ```


3. Запустите сервер:

   ```sh
   npm run server
   ```

4. В другом терминале запустите фронтенд:

   ```sh
   npm run dev
   ```


# Краткое описание технического решения и использованных технологий

Проект представляет собой ToDo-приложение, реализованное с использованием **Vue 3** и **Express.js** для обработки API запросов. Основные технологии и инструменты включают:

1. **Vue 3**: для создания интерактивного интерфейса. 

2. **Pinia**: для управления состоянием приложения.

3. **Express.js**: cерверная платформа, используемая для обработки запросов к серверу, а также для запуска сервера.

4. **WebSocket**: библиотека Socket\.io для обновления в реальном времени добавления, изменения или удаления задач.

5. **Fabric.js**: библиотека для работы с графикой на HTML Canvas. Используется для создания канбан-доски, где задачи можно перетаскивать между столбцами.

6. **Vite**: для сборки.

7. **Tailwind**: для стилизации  интерфейса.


