# web_gen_arucomap

Веб-реализация инструмента `genmap.py` из прошивки **[Clover](https://github.com/CopterExpress/clover)** (CopterExpress).

Позволяет быстро генерировать карту ArUco-маркеров (`map.txt`) для системы навигации по маркерам в ROS (Clover / aruco_pose) **прямо в браузере** — без установки ROS, Python и дополнительных пакетов.

### Демо
[crutoboy.ru/tools/genmap/](https://crutoboy.ru/tools/genmap/)

### Возможности

- Генерация `map.txt` по параметрам, полностью совместимым с оригинальным `genmap.py`
- **Предпросмотр карты в реальном времени** — визуализация, максимально близкая к топику `/aruco_map/image` из Clover
- Тёмная тема
- Скачивание готового `map.txt`

### Как использовать

1. Откройте страницу.
2. Заполните параметры:
   - Длина маркера (в метрах)
   - Количество маркеров по X и Y
   - Расстояние между центрами маркеров по X и Y
   - ID первого маркера
   - Смещение X0 / Y0 первого маркера
   - Направление нумерации: `--top-left` (по стандарту) или `--bottom-left`
3. Нажмите **«generate»** — увидите содержимое карты и её визуализацию.
4. Нажмите **«download map.txt»** — скачайте готовый файл.

### Параметры (соответствуют genmap.py)

| Параметр              | Описание                          |
|-----------------------|-----------------------------------|
| `length`              | Размер стороны маркера            |
| `markers_x`, `markers_y` | Размеры сетки                   |
| `dist_x`, `dist_y`    | Расстояние между центрами         |
| `first`               | Начальный ID маркера              |
| `x0`, `y0`            | Сдвиг начала координат            |
| `--top-left` / `--bottom-left` | Порядок нумерации        |

### Использование в Clover

Скопируйте полученный `map.txt` в папку:

```bash
~/catkin_ws/src/clover/aruco_pose/map/map.txt
```

И укажите его в `aruco.launch` (подробнее в [документации Clover](https://klever-doc.tech/ROS1/ru/auto_setup.html)).

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

### WASM-плагин (предпросмотр карты)

Визуализация карты реализована через WebAssembly-модуль из отдельного репозитория:

**[web_gen_arucomap_wasm_plugin](https://github.com/crutoboy/web_gen_arucomap_wasm_plugin)**

Модуль написан на C++ (OpenCV + ArUco) и компилируется в WASM.  
Скомпилированные файлы (`main.js` + `main.wasm`) лежат в папке:

```
public/wasm/
```

Основное приложение загружает их и использует для отрисовки предпросмотра карты в реальном времени.

> Если вы хотите обновить WASM-модуль — соберите его в репозитории плагина и замените файлы в `public/wasm/`.

### Технологии

- **Frontend**: HTML + JavaScript (Vite) + Bootstrap 5
- **Визуализация карты**: WebAssembly (C++ / OpenCV / ArUco)
- Без серверной части

### Лицензия

[MIT](LICENSE) (как и оригинальный Clover).

---

**Автор:** [crutoboy](https://github.com/crutoboy)  
**Зеркало:** https://git.crutoboy.ru/crutoboy/web_gen_arucomap  
**Оригинальный проект:** [CopterExpress/clover](https://github.com/CopterExpress/clover)
