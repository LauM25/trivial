/*
const contenedorPregunta = document.querySelector(".contenedor-pregunta");
const totalPreguntas = 5;
const tiempoPorPregunta = 60;

let puntuacion = 0;
let preguntasContestadas = 0;
let intervaloTemporizador;
let tiempoRestante;

// Lógica para la pantalla de inicio (landing)
const formConfiguracion = document.getElementById("form-configuracion");
const selectCategoria = document.getElementById("select-categoria");
const selectDificultad = document.getElementById("select-dificultad");

if (formConfiguracion && selectCategoria && selectDificultad) {
    formConfiguracion.addEventListener("submit", (e) => {
        e.preventDefault();

        const categoria = selectCategoria.value;
        const dificultad = selectDificultad.value;

        const configuracion = {
            categoria,
            dificultad
        };

        localStorage.setItem("configuracionTrivial", JSON.stringify(configuracion));

        window.location.href = "./game.html";
    });
}

// Juego en game.html
if (contenedorPregunta) {
    async function obtenerPreguntaAleatoria() {
        const configStr = localStorage.getItem("configuracionTrivial");
        let url = "https://opentdb.com/api.php?amount=1&type=multiple";

        if (configStr) {
            const config = JSON.parse(configStr);
            if (config.categoria) url += `&category=${config.categoria}`;
            if (config.dificultad) url += `&difficulty=${config.dificultad}`;
        }

        const respuesta = await fetch(url);
        const datos = await respuesta.json();
        return datos.results[0];
    }

    function mezclarOpciones(correcta, incorrectas) {
        const opciones = [...incorrectas, correcta];
        return opciones.sort(() => Math.random() - 0.5);
    }

    function mostrarTemporizador(tiempo, contenedor) {
        let temporizadorHTML = contenedor.querySelector(".temporizador");
        if (!temporizadorHTML) {
            temporizadorHTML = document.createElement("p");
            temporizadorHTML.classList.add("temporizador", "texto");
            contenedor.appendChild(temporizadorHTML);
        }
        temporizadorHTML.textContent = `Time remaining: ${tiempo}s`;
    }

    function detenerTemporizador() {
        clearInterval(intervaloTemporizador);
    }

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

    function mostrarPregunta(preguntaObj, contenedor) {
        const opciones = mezclarOpciones(
            preguntaObj.correct_answer,
            preguntaObj.incorrect_answers
        );

        contenedor.innerHTML = `
      <h2 class="texto">${preguntaObj.question}</h2>
      <div class="opciones-grid">
        ${opciones
                .map((opcion) => `<button class="opcion texto">${opcion}</button>`)
                .join("")}
      </div>
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

        function mostrarFinal() {
            btnSiguiente.style.display = "none";
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

        function tiempoAgotado() {
            if (respondida) return;
            respondida = true;
            bloquearOpciones();
            alert(`⏰ Time's up! The correct answer was: ${preguntaObj.correct_answer}`);
            preguntasContestadas++;
            textoPuntuacion.textContent = `Score: ${puntuacion} / ${totalPreguntas}`;
            if (preguntasContestadas < totalPreguntas) {
                btnSiguiente.style.display = "inline-block";
            } else {
                mostrarFinal();
            }
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
                    boton.style.backgroundColor = "#51cf66"; // Verde ✅
                    boton.style.color = "white";
                } else {
                    boton.style.backgroundColor = "#e03131"; // Rojo ❌
                    boton.style.color = "white";
                }

                preguntasContestadas++;
                textoPuntuacion.textContent = `Score: ${puntuacion} / ${totalPreguntas}`;

                if (preguntasContestadas < totalPreguntas) {
                    btnSiguiente.style.display = "inline-block";
                } else {
                    mostrarFinal();
                }
            });
        });

        btnSiguiente.addEventListener("click", () => {
            btnSiguiente.style.display = "none";
            iniciarJuego(contenedor);
        });
    }

    async function iniciarJuego(contenedor) {
        const pregunta = await obtenerPreguntaAleatoria();
        mostrarPregunta(pregunta, contenedor);
    }

    iniciarJuego(contenedorPregunta);
}
*/
// Seleccionamos el contenedor donde se mostrará la pregunta y opciones
const contenedorPregunta = document.querySelector(".contenedor-pregunta");

// Configuramos el total de preguntas y tiempo por pregunta en segundos
const totalPreguntas = 5;
const tiempoPorPregunta = 60;

// Variables para la puntuación, preguntas contestadas y control del temporizador
let puntuacion = 0;
let preguntasContestadas = 0;
let intervaloTemporizador;
let tiempoRestante;

// Seleccionamos elementos del formulario de configuración (pantalla de inicio)
const formConfiguracion = document.getElementById("form-configuracion");
const selectCategoria = document.getElementById("select-categoria");
const selectDificultad = document.getElementById("select-dificultad");

// Si los elementos existen, añadimos el evento submit al formulario
if (formConfiguracion && selectCategoria && selectDificultad) {
    formConfiguracion.addEventListener("submit", (e) => {
        e.preventDefault(); // Prevenimos que el formulario recargue la página

        // Obtenemos los valores seleccionados de categoría y dificultad
        const categoria = selectCategoria.value;
        const dificultad = selectDificultad.value;

        // Guardamos la configuración en localStorage para usarla en la pantalla del juego
        const configuracion = {
            categoria,
            dificultad
        };
        localStorage.setItem("configuracionTrivial", JSON.stringify(configuracion));

        // Redirigimos a la pantalla de juego
        window.location.href = "./game.html";
    });
}

// Código que se ejecuta en game.html para manejar el juego
if (contenedorPregunta) {

    // Función para obtener una pregunta aleatoria desde la API, usando configuración si existe
    async function obtenerPreguntaAleatoria() {
        const configStr = localStorage.getItem("configuracionTrivial");
        let url = "https://opentdb.com/api.php?amount=1&type=multiple";

        // Si hay configuración, añadimos categoría y dificultad a la URL
        if (configStr) {
            const config = JSON.parse(configStr);
            if (config.categoria) url += `&category=${config.categoria}`;
            if (config.dificultad) url += `&difficulty=${config.dificultad}`;
        }

        // Llamada a la API y parseo de respuesta JSON
        const respuesta = await fetch(url);
        const datos = await respuesta.json();

        // Devolvemos la pregunta recibida
        return datos.results[0];
    }

    // Función para mezclar (aleatorizar) las opciones de respuesta
    function mezclarOpciones(correcta, incorrectas) {
        // Creamos un array con las incorrectas y añadimos la correcta
        const opciones = [...incorrectas, correcta];

        // Mezclamos con sort usando Math.random()
        return opciones.sort(() => Math.random() - 0.5);
    }

    // Función para mostrar el temporizador dentro del contenedor
    function mostrarTemporizador(tiempo, contenedor) {
        // Buscamos el elemento del temporizador
        let temporizadorHTML = contenedor.querySelector(".temporizador");

        // Si no existe, lo creamos y añadimos
        if (!temporizadorHTML) {
            temporizadorHTML = document.createElement("p");
            temporizadorHTML.classList.add("temporizador", "texto");
            contenedor.appendChild(temporizadorHTML);
        }

        // Actualizamos el texto con el tiempo restante
        temporizadorHTML.textContent = `Time remaining: ${tiempo}s`;
    }

    // Función para detener el temporizador (limpiar el intervalo)
    function detenerTemporizador() {
        clearInterval(intervaloTemporizador);
    }

    // Función para iniciar el temporizador con callback cuando se agota el tiempo
    function iniciarTemporizador(contenedor, onTiempoAgotado) {
        tiempoRestante = tiempoPorPregunta; // Reiniciamos tiempo
        mostrarTemporizador(tiempoRestante, contenedor);

        // Creamos un intervalo que resta un segundo cada vez y actualiza el temporizador
        intervaloTemporizador = setInterval(() => {
            tiempoRestante--;
            mostrarTemporizador(tiempoRestante, contenedor);

            // Cuando el tiempo llega a 0, detenemos y llamamos callback
            if (tiempoRestante <= 0) {
                detenerTemporizador();
                onTiempoAgotado();
            }
        }, 1000);
    }

    // Función principal para mostrar la pregunta y gestionar interacciones
    function mostrarPregunta(preguntaObj, contenedor) {
        // Mezclamos opciones correctas e incorrectas para mostrar
        const opciones = mezclarOpciones(
            preguntaObj.correct_answer,
            preguntaObj.incorrect_answers
        );

        // Renderizamos el HTML con pregunta, opciones, botón siguiente y puntuación
        contenedor.innerHTML = `
      <h2 class="texto">${preguntaObj.question}</h2>
      <div class="opciones-grid">
        ${opciones
                .map((opcion) => `<button class="opcion texto">${opcion}</button>`)
                .join("")}
      </div>
      <button class="btn-siguiente texto" style="display:none;">Next question</button>
      <p class="puntuacion texto">Score: ${puntuacion} / ${totalPreguntas}</p>
    `;

        // Seleccionamos botones y elementos recién creados para añadir eventos
        const botonesOpciones = contenedor.querySelectorAll(".opcion");
        const btnSiguiente = contenedor.querySelector(".btn-siguiente");
        const textoPuntuacion = contenedor.querySelector(".puntuacion");

        let respondida = false; // Estado para controlar que solo se responda una vez

        // Función para bloquear todas las opciones (deshabilitar botones)
        function bloquearOpciones() {
            botonesOpciones.forEach((b) => (b.disabled = true));
        }

        // Función para mostrar pantalla final con puntuación y opción de reiniciar
        function mostrarFinal() {
            btnSiguiente.style.display = "none"; // Ocultamos siguiente
            contenedor.innerHTML = `
        <h2 class="texto">Game over</h2>
        <p class="texto">Your final score is ${puntuacion} out of ${totalPreguntas}.</p>
        <button class="btn-reiniciar texto">Replay</button>
      `;

            // Añadimos evento para reiniciar juego
            contenedor.querySelector(".btn-reiniciar").addEventListener("click", () => {
                puntuacion = 0;
                preguntasContestadas = 0;
                iniciarJuego(contenedor);
            });
        }

        // Callback para cuando se agota el tiempo sin responder
        function tiempoAgotado() {
            if (respondida) return; // Si ya respondió, no hacer nada
            respondida = true;
            bloquearOpciones();

            // Mostramos alerta con la respuesta correcta
            alert(`⏰ Time's up! The correct answer was: ${preguntaObj.correct_answer}`);

            preguntasContestadas++;
            textoPuntuacion.textContent = `Score: ${puntuacion} / ${totalPreguntas}`;

            // Mostramos botón siguiente o pantalla final
            if (preguntasContestadas < totalPreguntas) {
                btnSiguiente.style.display = "inline-block";
            } else {
                mostrarFinal();
            }
        }

        // Iniciamos el temporizador con callback para tiempo agotado
        iniciarTemporizador(contenedor, tiempoAgotado);

        // Añadimos evento click a cada opción
        botonesOpciones.forEach((boton) => {
            boton.addEventListener("click", () => {
                if (respondida) return; // Solo permitimos una respuesta

                respondida = true;
                detenerTemporizador();
                bloquearOpciones();

                // Si es correcta, sumamos puntos y pintamos botón verde
                if (boton.textContent === preguntaObj.correct_answer) {
                    puntuacion++;
                    boton.style.backgroundColor = "#51cf66"; // Verde ✅
                    boton.style.color = "white";
                } else {
                    // Si no, botón rojo
                    boton.style.backgroundColor = "#e03131"; // Rojo ❌
                    boton.style.color = "white";
                }

                preguntasContestadas++;
                textoPuntuacion.textContent = `Score: ${puntuacion} / ${totalPreguntas}`;

                // Mostramos botón siguiente o pantalla final
                if (preguntasContestadas < totalPreguntas) {
                    btnSiguiente.style.display = "inline-block";
                } else {
                    mostrarFinal();
                }
            });
        });

        // Evento click para avanzar a la siguiente pregunta
        btnSiguiente.addEventListener("click", () => {
            btnSiguiente.style.display = "none"; // Ocultamos el botón
            iniciarJuego(contenedor); // Cargamos nueva pregunta
        });
    }

    // Función para iniciar el juego cargando una pregunta
    async function iniciarJuego(contenedor) {
        const pregunta = await obtenerPreguntaAleatoria();
        mostrarPregunta(pregunta, contenedor);
    }

    // Arrancamos el juego en el contenedor principal
    iniciarJuego(contenedorPregunta);
}







