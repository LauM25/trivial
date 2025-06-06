// --- VARIABLES GLOBALES Y CONSTANTES ---
const contenedorPregunta = document.querySelector(".contenedor-pregunta");
const totalPreguntas = 5;          // Número total de preguntas por partida
const tiempoPorPregunta = 60;      // Tiempo en segundos por pregunta

// Variables que cambian durante la ejecución
let puntuacion = 0;
let preguntasContestadas = 0;
let intervaloTemporizador;         // ID del setInterval para temporizador
let tiempoRestante;                // Segundos restantes para la pregunta

// --- INICIO DEL JUEGO SOLO SI ESTAMOS EN LA PANTALLA DE JUEGO ---
if (contenedorPregunta) {
    // 1. Función para obtener una pregunta aleatoria desde la API pública de OpenTDB
    async function obtenerPreguntaAleatoria() {
        const url = "https://opentdb.com/api.php?amount=1&type=multiple";
        const respuesta = await fetch(url);
        const datos = await respuesta.json();
        return datos.results[0];
    }

    // 2. Mezclar aleatoriamente las respuestas correcta e incorrectas para mostrarlas sin orden
    function mezclarOpciones(correcta, incorrectas) {
        const opciones = [...incorrectas, correcta];
        return opciones.sort(() => Math.random() - 0.5);
    }

    // 3. Mostrar el temporizador en el contenedor y actualizarlo cada segundo
    function mostrarTemporizador(tiempo, contenedor) {
        let temporizadorHTML = contenedor.querySelector(".temporizador");
        if (!temporizadorHTML) {
            temporizadorHTML = document.createElement("p");
            temporizadorHTML.classList.add("temporizador", "texto");
            contenedor.appendChild(temporizadorHTML);
        }
        temporizadorHTML.textContent = `Time remaining: ${tiempo}s`;
    }

    // 4. Parar el temporizador para no seguir restando segundos
    function detenerTemporizador() {
        clearInterval(intervaloTemporizador);
    }

    // 5. Iniciar el temporizador con cuenta regresiva y callback cuando el tiempo se acabe
    function iniciarTemporizador(contenedor, onTiempoAgotado) {
        tiempoRestante = tiempoPorPregunta;
        mostrarTemporizador(tiempoRestante, contenedor);

        intervaloTemporizador = setInterval(() => {
            tiempoRestante--;
            mostrarTemporizador(tiempoRestante, contenedor);

            if (tiempoRestante <= 0) {
                detenerTemporizador();
                onTiempoAgotado();
            }
        }, 1000);
    }

    // 6. Función para mostrar pregunta, opciones, gestionar respuestas y controles
    function mostrarPregunta(preguntaObj, contenedor) {
        const opciones = mezclarOpciones(
            preguntaObj.correct_answer,
            preguntaObj.incorrect_answers
        );

        contenedor.innerHTML = `
      <h2 class="texto">${preguntaObj.question}</h2>
      <ul class="texto">
        ${opciones
                .map((opcion) => `<li><button class="opcion texto">${opcion}</button></li>`)
                .join("")}
      </ul>
      <button class="btn-siguiente texto" style="display:none;">Next question</button>
      <p class="puntuacion texto">Score: ${puntuacion} / ${totalPreguntas}</p>
    `;

        const botonesOpciones = contenedor.querySelectorAll(".opcion");
        const btnSiguiente = contenedor.querySelector(".btn-siguiente");
        const textoPuntuacion = contenedor.querySelector(".puntuacion");

        let respondida = false;

        function bloquearOpciones() {
            botonesOpciones.forEach((b) => (b.disabled = true));
        }

        function tiempoAgotado() {
            if (respondida) return;
            respondida = true;
            bloquearOpciones();
            alert(`⏰ Time's up! The correct answer was: ${preguntaObj.correct_answer}`);
            preguntasContestadas++;
            textoPuntuacion.textContent = `Score: ${puntuacion} / ${totalPreguntas}`;
            btnSiguiente.style.display = "inline-block";
        }

        iniciarTemporizador(contenedor, tiempoAgotado);

        botonesOpciones.forEach((boton) => {
            boton.addEventListener("click", () => {
                if (respondida) return;
                respondida = true;
                detenerTemporizador();
                bloquearOpciones();

                if (boton.textContent === preguntaObj.correct_answer) {
                    puntuacion++;
                    alert("✅ Correct!");
                } else {
                    alert(`❌ Incorrect. The correct answer was: ${preguntaObj.correct_answer}`);
                }

                preguntasContestadas++;
                textoPuntuacion.textContent = `Score: ${puntuacion} / ${totalPreguntas}`;

                if (preguntasContestadas < totalPreguntas) {
                    btnSiguiente.style.display = "inline-block";
                } else {
                    contenedor.innerHTML = `
            <h2 class="texto">Game over</h2>
            <p class="texto">Your final score is ${puntuacion} out of ${totalPreguntas}.</p>
            <button class="btn-reiniciar texto">Replay</button>
          `;

                    contenedor.querySelector(".btn-reiniciar").addEventListener("click", () => {
                        puntuacion = 0;
                        preguntasContestadas = 0;
                        iniciarJuego(contenedor);
                    });
                }
            });
        });

        btnSiguiente.addEventListener("click", () => {
            btnSiguiente.style.display = "none";
            iniciarJuego(contenedor);
        });
    }

    // 7. Función principal que inicia el juego pidiendo una pregunta y mostrándola
    async function iniciarJuego(contenedor) {
        const pregunta = await obtenerPreguntaAleatoria();
        mostrarPregunta(pregunta, contenedor);
    }

    // Empezamos el juego
    iniciarJuego(contenedorPregunta);
}

