### Hexlet tests and linter status:
[![Actions Status](https://github.com/Scarecrow2510/frontend-project-12/workflows/hexlet-check/badge.svg)](https://github.com/Scarecrow2510/frontend-project-12/actions)
[![Maintainability](https://api.codeclimate.com/v1/badges/6808c91f916ab0188b22/maintainability)](https://codeclimate.com/github/Scarecrow2510/frontend-project-12/maintainability)

Description:

Дипломный проект <a href=https://scarecrow2510-onlinechat.up.railway.app>HexletChat</a> - строится на технологиях, используемых в повседневной работе фронтенд-разработчиками.
Его цель - показать спектр всех стандартных задач, с которыми придётся столкнуться в реальной жизни.
Среди них: работа с веб-сокетами, взаимодействие с REST API, использование React (с хуками), Redux (через reduxjs/toolkit), организация роутинга на клиенте, авторизация и аутентификация, сборка (webpack) и деплой.

Features:

• Чат поддерживает два языка на выбор: русский и английский. Просто найдите значок флага вверху, в верхнем разделе

• Вы можете отправлять сообщения и управлять каналами (кроме 'general' и 'random').

• Вы ничего не пропустите с уведомлениями, которые появляются справа

• Чат всегда сообщит вам, если у вас проблемы с подключением к сети

• Включен фильтр ненормативной лексики.

Installation:

• Шаг 1 — Клонируем этот репозиторий
git clone https://github.com/Scarecrow2510/frontend-project-12

• Шаг 2 — Переходим в корневую папку проекта
cd frontend-project-12

• Шаг 3 — Устанавливаем зависимости
make install

• Шаг 4 — Устанавлиеваем пакеты
npm link (или sudo npm link)

• Шаг 5 — Запускаем Фронтенд и Бэкенд в корневой папке проекта
make start

•• Если четвёртый шаг не сработал — попробуйте использовать другой способ:

• Шаг 6 — Инициализируйте Фронтенд
cd frontend && make start

• Шаг 7 — Инициализируйте Бэкенд
make start-backend