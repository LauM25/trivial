
/*
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
let preguntas = []; // almacenamos las preguntas aquí

// Seleccionamos elementos del formulario de configuración (pantalla de inicio)
const formConfiguracion = document.getElementById("form-configuracion");
const selectCategoria = document.getElementById("select-categoria");
const selectDificultad = document.getElementById("select-dificultad");

// Evento para guardar configuración y comenzar juego
if (formConfiguracion && selectCategoria && selectDificultad) {
    formConfiguracion.addEventListener("submit", (e) => {
        e.preventDefault();
        const categoria = selectCategoria.value;
        const dificultad = selectDificultad.value;
        const configuracion = { categoria, dificultad };
        localStorage.setItem("configuracionTrivial", JSON.stringify(configuracion));
        window.location.href = "./game.html";
    });
}

// Código que se ejecuta en game.html
if (contenedorPregunta) {

    // Cargar todas las preguntas de una sola vez
    async function cargarPreguntas() {
        const configStr = localStorage.getItem("configuracionTrivial");
        let url = `https://opentdb.com/api.php?amount=${totalPreguntas}&type=multiple`;

        if (configStr) {
            const config = JSON.parse(configStr);
            if (config.categoria) url += `&category=${config.categoria}`;
            if (config.dificultad) url += `&difficulty=${config.dificultad}`;
        }

        const respuesta = await fetch(url);

        if (!respuesta.ok) {
            if (respuesta.status === 429) {
                alert("⚠️ Too many requests to the API. Please wait a few seconds and try again.");
            } else {
                alert("An error occurred while fetching the questions.");
            }
            throw new Error("API error: " + respuesta.status);
        }

        const datos = await respuesta.json();
        preguntas = datos.results;
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

        // Limpiar contenido previo y crear nuevo
        contenedor.innerHTML = `
            <h2 class="texto">${preguntaObj.question}</h2>
            <div class="opciones-grid"></div>
            <button class="btn-siguiente texto" style="display:none;">Next question</button>
            <p class="puntuacion texto">Score: ${puntuacion} / ${totalPreguntas}</p>
        `;

        const opcionesContainer = contenedor.querySelector(".opciones-grid");
        opciones.forEach((opcion) => {
            const btn = document.createElement("button");
            btn.className = "opcion texto";
            btn.textContent = opcion;
            opcionesContainer.appendChild(btn);
        });

        const botonesOpciones = contenedor.querySelectorAll(".opcion");
        const btnSiguiente = contenedor.querySelector(".btn-siguiente");
        const textoPuntuacion = contenedor.querySelector(".puntuacion");

        let respondida = false;

        // Funciones auxiliares
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
                preguntas = [];
                iniciarJuego(contenedor);
            });
        }

        // Función que se llama cuando se acaba el tiempo
        function tiempoAgotado() {
            if (respondida) return;
            respondida = true;
            detenerTemporizador();
            bloquearOpciones();

            // Mostrar la respuesta correcta
            alert(`⏰ Time's up! La respuesta correcta era: ${preguntaObj.correct_answer}`);

            // Resaltar la opción correcta
            botonesOpciones.forEach((b) => {
                if (b.textContent.trim() === preguntaObj.correct_answer.trim()) {
                    b.style.backgroundColor = "#51cf66"; // verde
                    b.style.color = "white";
                }
            });

            preguntasContestadas++;
            // La puntuación no aumenta si no respondió correctamente
            textoPuntuacion.textContent = `Score: ${puntuacion} / ${totalPreguntas}`;

            if (preguntasContestadas < totalPreguntas) {
                btnSiguiente.style.display = "inline-block";
            } else {
                mostrarFinal();
            }
        }

        // Iniciar temporizador
        iniciarTemporizador(contenedor, tiempoAgotado);

        // Añadir evento a las opciones
        botonesOpciones.forEach((b) => {
            b.addEventListener("click", () => {
                if (respondida) return;
                respondida = true;
                detenerTemporizador();
                bloquearOpciones();

                const opcionCorrecta = preguntaObj.correct_answer.trim();

                // Resaltar la opción correcta
                botonesOpciones.forEach((btn) => {
                    if (btn.textContent.trim() === opcionCorrecta) {
                        btn.style.backgroundColor = "#51cf66"; // verde
                        btn.style.color = "white";
                    }
                });

                if (b.textContent.trim() === opcionCorrecta) {
                    // Respuesta correcta
                    puntuacion++;
                    b.style.backgroundColor = "#51cf66";
                    b.style.color = "white";
                } else {
                    // Respuesta incorrecta
                    b.style.backgroundColor = "#e03131";
                    b.style.color = "white";

                    // Mostrar aviso con la correcta
                    alert(`❌ Respuesta incorrecta. La respuesta correcta era: ${preguntaObj.correct_answer}`);
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

        // Evento para siguiente pregunta
        btnSiguiente.addEventListener("click", () => {
            btnSiguiente.style.display = "none";
            iniciarJuego(contenedor);
        });
    }

    // Iniciar el juego
    async function iniciarJuego(contenedor) {
        if (preguntas.length === 0) {
            await cargarPreguntas();
        }

        if (preguntasContestadas < preguntas.length) {
            const pregunta = preguntas[preguntasContestadas];
            mostrarPregunta(pregunta, contenedor);
        } else {
            contenedor.innerHTML = `<p class="texto">❗ No more questions available.</p>`;
        }
    }

    // Iniciar el juego por primera vez
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
let preguntas = []; // almacenamos las preguntas aquí

// Seleccionamos elementos del formulario de configuración (pantalla de inicio)
const formConfiguracion = document.getElementById("form-configuracion");
const selectCategoria = document.getElementById("select-categoria");
const selectDificultad = document.getElementById("select-dificultad");

// Evento para guardar configuración y comenzar juego
if (formConfiguracion && selectCategoria && selectDificultad) {
    formConfiguracion.addEventListener("submit", (e) => {
        e.preventDefault();
        const categoria = selectCategoria.value;
        const dificultad = selectDificultad.value;
        const configuracion = { categoria, dificultad };
        localStorage.setItem("configuracionTrivial", JSON.stringify(configuracion));
        window.location.href = "./game.html";
    });
}

// Código que se ejecuta en game.html
if (contenedorPregunta) {

    // Cargar todas las preguntas de una sola vez
    async function cargarPreguntas() {
        const configStr = localStorage.getItem("configuracionTrivial");
        let url = `https://opentdb.com/api.php?amount=${totalPreguntas}&type=multiple`;

        if (configStr) {
            const config = JSON.parse(configStr);
            if (config.categoria) url += `&category=${config.categoria}`;
            if (config.dificultad) url += `&difficulty=${config.dificultad}`;
        }

        const respuesta = await fetch(url);

        if (!respuesta.ok) {
            if (respuesta.status === 429) {
                alert("⚠️ Too many requests to the API. Please wait a few seconds and try again.");
            } else {
                alert("An error occurred while fetching the questions.");
            }
            throw new Error("API error: " + respuesta.status);
        }

        const datos = await respuesta.json();
        preguntas = datos.results;
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


        // Limpiar contenido previo y crear nuevo
        contenedor.innerHTML = `
            <a href="./index.html"><i class="fa-solid fa-circle-chevron-left button-back"></i></a>
            <h2 class="texto">${preguntaObj.question}</h2>
            <div class="opciones-grid"></div>
            <button class="btn-siguiente texto" style="display:none;">Next question</button>
            <p class="puntuacion texto">Score: ${puntuacion} / ${totalPreguntas}</p>
        `;

        const opcionesContainer = contenedor.querySelector(".opciones-grid");
        opciones.forEach((opcion) => {
            const btn = document.createElement("button");
            btn.className = "opcion texto";
            btn.textContent = opcion;
            opcionesContainer.appendChild(btn);
        });

        const botonesOpciones = contenedor.querySelectorAll(".opcion");
        const btnSiguiente = contenedor.querySelector(".btn-siguiente");
        const textoPuntuacion = contenedor.querySelector(".puntuacion");

        let respondida = false;

        // Funciones auxiliares
        function bloquearOpciones() {
            botonesOpciones.forEach((b) => (b.disabled = true));
        }

        function mostrarFinal() {
            btnSiguiente.style.display = "none";
            contenedor.innerHTML = `
                <a href="./index.html"><i class="fa-solid fa-circle-chevron-left button-back"></i></a>
                <h2 class="texto">Game over</h2>
                <p class="texto">Your final score is ${puntuacion} out of ${totalPreguntas}.</p>
                <button class="btn-reiniciar texto">Replay</button>
            `;
            contenedor.querySelector(".btn-reiniciar").addEventListener("click", () => {
                puntuacion = 0;
                preguntasContestadas = 0;
                preguntas = [];
                iniciarJuego(contenedor);
            });
        }

        // Función que se llama cuando se acaba el tiempo
        function tiempoAgotado() {
            if (respondida) return;
            respondida = true;
            detenerTemporizador();
            bloquearOpciones();

            // Mostrar la respuesta correcta
            alert(`⏰ Time's up! La respuesta correcta era: ${preguntaObj.correct_answer}`);

            // Resaltar la opción correcta
            botonesOpciones.forEach((b) => {
                if (b.textContent.trim() === preguntaObj.correct_answer.trim()) {
                    b.style.backgroundColor = "#51cf66"; // verde
                    b.style.color = "white";
                }
            });

            preguntasContestadas++;
            // La puntuación no aumenta si no respondió correctamente
            textoPuntuacion.textContent = `Score: ${puntuacion} / ${totalPreguntas}`;

            if (preguntasContestadas < totalPreguntas) {
                btnSiguiente.style.display = "inline-block";
            } else {
                mostrarFinal();
            }
        }

        // Iniciar temporizador
        iniciarTemporizador(contenedor, tiempoAgotado);

        // Añadir evento a las opciones
        botonesOpciones.forEach((b) => {
            b.addEventListener("click", () => {
                if (respondida) return;
                respondida = true;
                detenerTemporizador();
                bloquearOpciones();

                const opcionCorrecta = preguntaObj.correct_answer.trim();

                // Resaltar la opción correcta
                botonesOpciones.forEach((btn) => {
                    if (btn.textContent.trim() === opcionCorrecta) {
                        btn.style.backgroundColor = "#51cf66"; // verde
                        btn.style.color = "white";
                    }
                });

                if (b.textContent.trim() === opcionCorrecta) {
                    // Respuesta correcta
                    puntuacion++;
                    b.style.backgroundColor = "#51cf66";
                    b.style.color = "white";
                } else {
                    // Respuesta incorrecta
                    b.style.backgroundColor = "#e03131";
                    b.style.color = "white";

                    // Mostrar aviso con la correcta
                    alert(`❌ Respuesta incorrecta. La respuesta correcta era: ${preguntaObj.correct_answer}`);
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

        // Evento para siguiente pregunta
        btnSiguiente.addEventListener("click", () => {
            btnSiguiente.style.display = "none";
            iniciarJuego(contenedor);
        });
    }

    // Iniciar el juego
    async function iniciarJuego(contenedor) {
        if (preguntas.length === 0) {
            await cargarPreguntas();
        }

        if (preguntasContestadas < preguntas.length) {
            const pregunta = preguntas[preguntasContestadas];
            mostrarPregunta(pregunta, contenedor);
        } else {
            contenedor.innerHTML = `<p class="texto">❗ No more questions available.</p>`;
        }
    }

    // Iniciar el juego por primera vez
    iniciarJuego(contenedorPregunta);
}






