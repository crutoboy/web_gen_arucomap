# web_gen_arucomap

Веб-реализация инструмента `genmap.py` из прошивки **[Clover](https://github.com/CopterExpress/clover)** (CopterExpress).

Позволяет быстро генерировать карту ArUco-маркеров (`map.txt`) для системы навигации по маркерам в ROS (Clover / aruco_pose).

### Демо
[crutoboy.ru/tools/genmap/](https://crutoboy.ru/tools/genmap/)

### Зачем это нужно

В Clover для автономного полёта по карте ArUco-маркеров требуется файл `map.txt` с координатами всех маркеров. Оригинальный скрипт `genmap.py` запускается через ROS (`rosrun aruco_pose genmap.py ...`).  
Эта веб-версия позволяет генерировать карту **прямо в браузере** без установки ROS, Python и дополнительных пакетов — удобно для быстрой подготовки поля.

### Как использовать

1. Откройте страницу.
2. Заполните параметры, аналогичные команде из `rosrun`:
   - Длина маркера (в метрах)
   - Количество маркеров по X и Y
   - Расстояние между центрами маркеров по X и Y
   - ID первого маркера
   - Смещение X0 / Y0 первого маркера
   - Направление нумерации: `--top-left` (по стандарту) или `--bottom-left`
3. Нажмите **«generate»** — увидите содержимое карты в текстовом поле.
4. Нажмите **«download map.txt»** — скачайте готовый файл.

### Установка и запуск (для разработки)

```bash
git clone https://github.com/crutoboy/web_gen_arucomap.git
cd web_gen_arucomap
npm install
npm run dev
```

Для сборки:

```bash
npm run build
```

Готовые файлы окажутся в папке `dist/`.

### Параметры (соответствуют genmap.py)

- `length` — размер стороны маркера
- `markers_x`, `markers_y` — размеры сетки
- `dist_x`, `dist_y` — расстояние между центрами
- `first` — начальный ID маркера
- `x0`, `y0` — сдвиг начала координат
- `--top-left` / `--bottom-left` — порядок нумерации

### Использование в Clover

Скопируйте полученный `map.txt` в папку:
```bash
~/catkin_ws/src/clover/aruco_pose/map/map.txt
```

И укажите его в `aruco.launch` (подробнее в [документации Clover](https://klever-doc.tech/ROS1/ru/auto_setup.html)).

### Технологии

- HTML + JavaScript (Vite)
- Bootstrap 5 (стили)
- Чистый JS — без серверной части

### Лицензия

[MIT](LICENSE) (как и оригинальный Clover).

---

**Автор веб-версии:** crutoboy
**Зеркало проекта:** https://git.crutoboy.ru/crutoboy/web_gen_arucomap
**Оригинальный проект:** [CopterExpress/clover](https://github.com/CopterExpress/clover)