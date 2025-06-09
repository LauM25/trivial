



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







