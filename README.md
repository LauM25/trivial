# 🎯 Trivial - Juego de Preguntas

Juego web interactivo tipo trivial donde los jugadores responden preguntas aleatorias con límite de tiempo, pudiendo elegir categoría y dificultad antes de comenzar.

---

## 🚀 Funcionalidades principales

- 🎲 Preguntas aleatorias obtenidas de la API pública [Open Trivia Database](https://opentdb.com/)
- 🎯 Configuración previa para elegir categoría y dificultad
- ⏳ Temporizador de 60 segundos por pregunta
- ✅ Feedback visual inmediato tras cada respuesta (correcta o incorrecta)
- 🔄 Navegación entre preguntas con botón "Next question"
- 🏆 Puntuación acumulada y mostrada en tiempo real
- 🔁 Opción para reiniciar el juego al finalizar las 5 preguntas
- 🖥️ Diseño responsivo para escritorio y dispositivos móviles

---

## 🧰 Tecnologías utilizadas

- HTML5
- SASS (CSS3)
- JavaScript moderno (ES6+)
- API: [Open Trivia DB](https://opentdb.com/)
- Vite (entorno de desarrollo)

---

## 🎮 Cómo funciona el juego

1. En la pantalla de inicio (landing), el usuario selecciona la categoría y dificultad del cuestionario.
2. Al enviar el formulario, la configuración se guarda en `localStorage` y se redirige a la pantalla del juego.
3. En la pantalla del juego:
   - Se cargan 5 preguntas aleatorias según la configuración seleccionada.
   - Las opciones se muestran en orden aleatorio.
   - El usuario dispone de 60 segundos para responder, con un temporizador visible.
   - Al responder o agotar el tiempo, se bloquean las opciones y se muestra feedback.
   - Se puede avanzar a la siguiente pregunta con un botón.
   - Al completar las 5 preguntas, se muestra la puntuación final y opción para reiniciar el juego.

---

## 🎨 Paleta de colores principal

| Color       | Código    | Uso                       |
| ----------- | --------- | ------------------------- |
| 🔴 Rojo     | `#fa5f34` | Botones, estados de error |
| 🔵 Azul     | `#4f4e8b` | Texto principal, bordes   |
| 🟡 Amarillo | `#fdbf24` | Hover y acentos           |
| ⚪ Blanco   | `#ffffff` | Fondo general             |

---

## 📦 Cómo ejecutar el proyecto localmente

````bash
git clone https://github.com/LauM25/trivial.git
cd trivial
npm install
npm run dev

---

## 🚀 Cómo construir y desplegar

```bash
npm run build      # Genera versión optimizada
npm run deploy     # Sube la carpeta /docs al repositorio para GitHub Pages

````
