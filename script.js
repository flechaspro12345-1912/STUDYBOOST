const formTarea = document.getElementById("formTarea");
const nombreTarea = document.getElementById("nombreTarea");
const listaTareas = document.getElementById("listaTareas");

let tareasGuardadas = localStorage.getItem("studyboost-tareas");

let tareas = tareasGuardadas !== null
    ? JSON.parse(tareasGuardadas)
    : [
        { id: 1, nombre: "Repasar matemáticas", hecha: false },
        { id: 2, nombre: "Leer los apuntes de biología", hecha: true },
        { id: 3, nombre: "Preparar un resumen", hecha: false }
    ];

if (tareasGuardadas === null) {
    localStorage.setItem("studyboost-tareas", JSON.stringify(tareas));
}

function guardarTareas() {
    localStorage.setItem("studyboost-tareas", JSON.stringify(tareas));
}
const rangosEstudio = [
    { nombre: "Bronce I", icono: "🥉", xp: 0 },
    { nombre: "Bronce II", icono: "🥉", xp: 100 },
    { nombre: "Bronce III", icono: "🥉", xp: 250 },
    { nombre: "Plata I", icono: "🥈", xp: 450 },
    { nombre: "Plata II", icono: "🥈", xp: 700 },
    { nombre: "Plata III", icono: "🥈", xp: 1000 },
    { nombre: "Oro I", icono: "🥇", xp: 1400 },
    { nombre: "Oro II", icono: "🥇", xp: 1900 },
    { nombre: "Oro III", icono: "🥇", xp: 2500 },
    { nombre: "Esmeralda I", icono: "💚", xp: 3200 },
    { nombre: "Esmeralda II", icono: "💚", xp: 4000 },
    { nombre: "Esmeralda III", icono: "💚", xp: 5000 },
    { nombre: "Diamante I", icono: "💎", xp: 6200 },
    { nombre: "Diamante II", icono: "💎", xp: 7600 },
    { nombre: "Diamante III", icono: "💎", xp: 9200 }
];

const claveProgresoEstudio = "studyBoost-progreso-estudio";

let progresoEstudio;

try {
    progresoEstudio = JSON.parse(
        localStorage.getItem(claveProgresoEstudio)
    );
} catch (error) {
    progresoEstudio = null;
}

if (
    !progresoEstudio ||
    typeof progresoEstudio.xp !== "number" ||
    !Number.isFinite(progresoEstudio.xp) ||
    progresoEstudio.xp < 0
) {
    progresoEstudio = {
        xp: 0,
        tareasRecompensadas: [],
        cuestionariosRecompensados: []
    };
}

if (!Array.isArray(progresoEstudio.tareasRecompensadas)) {
    progresoEstudio.tareasRecompensadas = [];
}

if (!Array.isArray(progresoEstudio.cuestionariosRecompensados)) {
    progresoEstudio.cuestionariosRecompensados = [];
}
if (!Array.isArray(progresoEstudio.retosRecompensados)) {
    progresoEstudio.retosRecompensados = [];
}
function guardarProgresoEstudio() {
    try {
        localStorage.setItem(
            claveProgresoEstudio,
            JSON.stringify(progresoEstudio)
        );
    } catch (error) {
        console.warn("No se pudo guardar la experiencia.", error);
    }
}

function otorgarExperiencia(cantidad) {
    if (!Number.isFinite(cantidad) || cantidad <= 0) return;

    progresoEstudio.xp += cantidad;
    guardarProgresoEstudio();
    actualizarRangoEstudio();
}

function actualizarRangoEstudio() {
    const xp = progresoEstudio.xp;

    let indice = 0;

    for (let i = 0; i < rangosEstudio.length; i++) {
        if (xp >= rangosEstudio[i].xp) {
            indice = i;
        } else {
            break;
        }
    }

    const rangoActual = rangosEstudio[indice];
    const siguienteRango = rangosEstudio[indice + 1];

    document.getElementById("iconoRango").textContent =
        rangoActual.icono;

    document.getElementById("nombreRango").textContent =
        rangoActual.nombre;

    document.getElementById("experienciaRango").textContent =
        `${xp} XP`;

    document.getElementById("xpTotal").textContent =
        `${xp} XP`;

    const porcentaje = siguienteRango
        ? Math.min(
            100,
            Math.round(
                (xp - rangoActual.xp) /
                (siguienteRango.xp - rangoActual.xp) * 100
            )
        )
        : 100;

    document.getElementById("barraRango").style.width =
        `${porcentaje}%`;

    document.getElementById("contenedorBarraRango")
        .setAttribute("aria-valuenow", porcentaje);

    document.getElementById("xpRestante").textContent =
        siguienteRango
            ? `${xp - rangoActual.xp} / ${siguienteRango.xp - rangoActual.xp} XP`
            : "Rango máximo alcanzado";

    document.getElementById("textoSiguienteRango").textContent =
        siguienteRango
            ? `Siguiente rango: ${siguienteRango.nombre}`
            : "¡Has alcanzado el rango máximo!";

    const tituloConsejo = document.getElementById("tituloConsejo");
    const consejo = document.getElementById("consejoRango");

    if (indice === rangosEstudio.length - 1) {
        tituloConsejo.textContent = "¡Rango máximo!";
        consejo.textContent =
            "Has llegado a Diamante III. Sigue estudiando para mantener tu aprendizaje y ampliar tus conocimientos.";
    } else if (porcentaje >= 80) {
        tituloConsejo.textContent = "¡Estás cerca del ascenso!";
        consejo.textContent =
            "Estás a punto de subir de rango. Completa una actividad de estudio y sigue avanzando.";
    } else if (xp === 0) {
        tituloConsejo.textContent = "Tu misión de hoy";
        consejo.textContent =
            "Completa una tarea o termina un cuestionario para ganar tus primeros puntos de experiencia.";
    } else {
        tituloConsejo.textContent = "Sigue construyendo tu progreso";
        consejo.textContent =
            "Combina tareas y cuestionarios. La constancia y la comprensión valen más que estudiar deprisa.";
    }

    const historial = JSON.parse(
        localStorage.getItem("studyBoost-resultados") || "[]"
    );

    document.getElementById("quizzesCompletados").textContent =
        historial.length;
}
actualizarRangoEstudio();

guardarProgresoEstudio();
const claveMetaSemanal = "studyBoost-meta-semanal";
const objetivoSemanal = 10;

function obtenerSemanaActual() {
    const fecha = new Date();
    const diaSemana = fecha.getDay() || 7;

    fecha.setDate(fecha.getDate() - diaSemana + 1);
    fecha.setHours(0, 0, 0, 0);

    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const dia = String(fecha.getDate()).padStart(2, "0");

    return `${anio}-${mes}-${dia}`;
}

function obtenerMetaSemanal() {
    let meta;

    try {
        meta = JSON.parse(localStorage.getItem(claveMetaSemanal));
    } catch (error) {
        meta = null;
    }

    if (
        !meta ||
        meta.semana !== obtenerSemanaActual() ||
        !Array.isArray(meta.actividades)
    ) {
        meta = {
            semana: obtenerSemanaActual(),
            actividades: []
        };

        localStorage.setItem(claveMetaSemanal, JSON.stringify(meta));
    }

    return meta;
}

function registrarActividadSemanal(idActividad) {
    const meta = obtenerMetaSemanal();

    if (!meta.actividades.includes(String(idActividad))) {
        meta.actividades.push(String(idActividad));

        localStorage.setItem(
            claveMetaSemanal,
            JSON.stringify(meta)
        );
    }

    actualizarMetaSemanal();
}

function actualizarMetaSemanal() {
    const meta = obtenerMetaSemanal();
    const total = meta.actividades.length;

    const porcentaje = Math.min(
        100,
        Math.round((total / objetivoSemanal) * 100)
    );

    const barra = document.getElementById("barraMeta");
    const texto = document.getElementById("textoMeta");

    if (barra) {
        barra.style.width = `${porcentaje}%`;
    }

    if (texto) {
        texto.textContent =
            `${total} de ${objetivoSemanal} actividades completadas esta semana`;
    }
}

actualizarMetaSemanal();
function actualizarProgreso() {
    const tareasCompletadas = tareas.filter(
        tarea => tarea.hecha
    ).length;

    const tareasPendientes = tareas.length - tareasCompletadas;

    // Leer los retos diarios guardados.
    let retosHoy = null;

    try {
        retosHoy = JSON.parse(
            localStorage.getItem("studyBoostRetosDiarios")
        );
    } catch (error) {
        retosHoy = null;
    }

    // Contar solamente los retos de la fecha actual.
    const ahora = new Date();
    const anio = ahora.getFullYear();
    const mes = String(ahora.getMonth() + 1).padStart(2, "0");
    const dia = String(ahora.getDate()).padStart(2, "0");
    const fechaHoy = `${anio}-${mes}-${dia}`;

    if (
        !retosHoy ||
        retosHoy.fecha !== fechaHoy ||
        !Array.isArray(retosHoy.retos)
    ) {
        retosHoy = null;
    }

    const totalRetos = retosHoy ? retosHoy.retos.length : 0;

    const retosCompletados = retosHoy
        ? retosHoy.retos.filter(reto => reto.completado).length
        : 0;

    const retosPendientes = totalRetos - retosCompletados;

    // Combinar tareas personales y retos diarios.
    const completadas = tareasCompletadas + retosCompletados;
    const pendientes = tareasPendientes + retosPendientes;
    const totalActividades = tareas.length + totalRetos;

    const porcentaje = totalActividades
        ? Math.round((completadas / totalActividades) * 100)
        : 0;

    document.getElementById("totalCompletadas").textContent =
        completadas;

    document.getElementById("totalPendientes").textContent =
        pendientes;

    document.getElementById("porcentaje").textContent =
        porcentaje + "%";

    document.getElementById("barraProgreso").style.width =
        porcentaje + "%";

    // La meta semanal se actualiza por separado.
    actualizarMetaSemanal();
}

function mostrarTareas() {
    listaTareas.replaceChildren();

    tareas.forEach(tarea => {
        const li = document.createElement("li");
        if (tarea.hecha) li.classList.add("hecha");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = tarea.hecha;
        checkbox.setAttribute("aria-label", "Marcar tarea como completada");

        const texto = document.createElement("span");
        texto.textContent = tarea.nombre;

        const eliminar = document.createElement("button");
        eliminar.type = "button";
        eliminar.textContent = "Eliminar";
        eliminar.className = "secundario";
        eliminar.addEventListener("click", () => {
            tareas = tareas.filter(item => item.id !== tarea.id);
            guardarTareas();
            mostrarTareas();
        });

        checkbox.addEventListener("change", () => {
            const estabaHecha = tarea.hecha;
            tarea.hecha = checkbox.checked;

            if (tarea.hecha && !estabaHecha) {
                // Registrar la tarea en la meta semanal.
                registrarActividadSemanal(`tarea-${tarea.id}`);

                // Dar XP solamente la primera vez.
                if (
                    !progresoEstudio.tareasRecompensadas.includes(tarea.id)
                ) {
                    progresoEstudio.tareasRecompensadas.push(tarea.id);
                    otorgarExperiencia(25);
                }
            }

            guardarProgresoEstudio();
            guardarTareas();
            mostrarTareas();
        });

        li.append(checkbox, texto, eliminar);
        listaTareas.appendChild(li);
    });

    actualizarProgreso();
}

formTarea.addEventListener("submit", event => {
    event.preventDefault();

    const nombre = nombreTarea.value.trim();
    if (!nombre) return;

    tareas.push({
        id: Date.now(),
        nombre,
        hecha: false
    });

    guardarTareas();
    mostrarTareas();
    formTarea.reset();
    nombreTarea.focus();
});

// Temporizador Pomodoro
let segundos = 25 * 60;
let intervalo = null;

const reloj = document.getElementById("reloj");
const botonIniciar = document.getElementById("iniciarTemporizador");
const botonReiniciar = document.getElementById("reiniciarTemporizador");

function mostrarReloj() {
    const minutos = Math.floor(segundos / 60);
    const resto = segundos % 60;

    reloj.textContent =
        String(minutos).padStart(2, "0") + ":" +
        String(resto).padStart(2, "0");
}

botonIniciar.addEventListener("click", () => {
    if (intervalo !== null) {
        clearInterval(intervalo);
        intervalo = null;
        botonIniciar.textContent = "Continuar";
        return;
    }

    if (segundos <= 0) return;

    botonIniciar.textContent = "Pausar";

    intervalo = setInterval(() => {
        segundos--;
        mostrarReloj();

        if (segundos <= 0) {
            clearInterval(intervalo);
            intervalo = null;
            botonIniciar.textContent = "Iniciar";
            alert("¡Sesión terminada! Tómate un descanso.");
        }
    }, 1000);
});

botonReiniciar.addEventListener("click", () => {
    clearInterval(intervalo);
    intervalo = null;
    segundos = 25 * 60;
    mostrarReloj();
    botonIniciar.textContent = "Iniciar";
});
const preguntasQuiz = [
    {
        pregunta: "Si 3x + 5 = 20, ¿cuánto vale x?",
        opciones: ["3", "5", "8", "15"],
        correcta: 1,
        explicacion: "Restamos 5 a ambos lados: 3x = 15. Después dividimos entre 3: x = 5."
    },
    {
        pregunta: "¿Cuál es el resultado de (x + 3)(x + 2)?",
        opciones: ["x² + 5x + 6", "x² + 6", "x² + 5x + 5", "2x + 5"],
        correcta: 0,
        explicacion: "Multiplicamos los términos: x² + 2x + 3x + 6. Al sumar los términos semejantes obtenemos x² + 5x + 6."
    },
    {
        pregunta: "Si f(x) = 2x² - 1, ¿cuánto vale f(3)?",
        opciones: ["5", "11", "17", "35"],
        correcta: 2,
        explicacion: "Sustituimos x por 3: 2(3²) - 1 = 2(9) - 1 = 17."
    },
    {
        pregunta: "Un artículo cuesta $80.000 y tiene un descuento del 25 %. ¿Cuánto se paga?",
        opciones: ["$20.000", "$55.000", "$60.000", "$75.000"],
        correcta: 2,
        explicacion: "El 25 % de 80.000 es 20.000. Restamos el descuento: 80.000 - 20.000 = 60.000."
    },
    {
        pregunta: "¿Cuáles son las soluciones de x² - 9 = 0?",
        opciones: ["Solo x = 3", "x = 3 y x = -3", "Solo x = -3", "x = 9 y x = -9"],
        correcta: 1,
        explicacion: "Obtenemos x² = 9. Por tanto, x = 3 o x = -3."
    }
];

let indicePregunta = 0;
let aciertosQuiz = 0;
let respondida = false;

const numeroPregunta = document.getElementById("numeroPregunta");
const puntuacionActual = document.getElementById("puntuacionActual");
const progresoQuiz = document.getElementById("progresoQuiz");
const preguntaTexto = document.getElementById("preguntaTexto");
const opcionesQuiz = document.getElementById("opcionesQuiz");
const retroalimentacion = document.getElementById("retroalimentacion");
const siguientePregunta = document.getElementById("siguientePregunta");
const resultadoQuiz = document.getElementById("resultadoQuiz");
const resumenQuiz = document.getElementById("resumenQuiz");
const reiniciarQuiz = document.getElementById("reiniciarQuiz");

function mostrarPregunta() {
    const pregunta = preguntasQuiz[indicePregunta];
    respondida = false;

    numeroPregunta.textContent = `Pregunta ${indicePregunta + 1} de ${preguntasQuiz.length}`;
    puntuacionActual.textContent = `Aciertos: ${aciertosQuiz}`;
    progresoQuiz.style.width = `${indicePregunta / preguntasQuiz.length * 100}%`;
    preguntaTexto.textContent = pregunta.pregunta;

    opcionesQuiz.replaceChildren();
    retroalimentacion.textContent = "";
    siguientePregunta.hidden = true;
    resultadoQuiz.hidden = true;

    preguntaTexto.hidden = false;
    opcionesQuiz.hidden = false;
    retroalimentacion.hidden = false;

    pregunta.opciones.forEach((opcion, indice) => {
        const boton = document.createElement("button");
        boton.type = "button";
        boton.className = "opcion-quiz";
        boton.textContent = `${String.fromCharCode(65 + indice)}. ${opcion}`;

        boton.addEventListener("click", () => comprobarRespuesta(indice));
        opcionesQuiz.appendChild(boton);
    });
}

function comprobarRespuesta(indiceElegido) {
    if (respondida) return;

    respondida = true;
    const pregunta = preguntasQuiz[indicePregunta];
    const botones = opcionesQuiz.querySelectorAll("button");
    const esCorrecta = indiceElegido === pregunta.correcta;

    if (esCorrecta) aciertosQuiz++;

    botones.forEach((boton, indice) => {
        boton.disabled = true;

        if (indice === pregunta.correcta) {
            boton.classList.add("correcta");
        } else if (indice === indiceElegido) {
            boton.classList.add("incorrecta");
        }
    });

    retroalimentacion.textContent =
        (esCorrecta ? "¡Correcto! " : "No exactamente. ") + pregunta.explicacion;

    puntuacionActual.textContent = `Aciertos: ${aciertosQuiz}`;
    progresoQuiz.style.width = `${(indicePregunta + 1) / preguntasQuiz.length * 100}%`;

    siguientePregunta.hidden = false;
    siguientePregunta.textContent =
        indicePregunta === preguntasQuiz.length - 1
            ? "Ver resultados"
            : "Siguiente pregunta";
}

function finalizarQuiz() {
    const porcentaje = Math.round(aciertosQuiz / preguntasQuiz.length * 100);
    const idCuestionario = "quiz-matematicas-inicial";

    if (
        !progresoEstudio.cuestionariosRecompensados.includes(idCuestionario)
    ) {
        progresoEstudio.cuestionariosRecompensados.push(idCuestionario);
        otorgarExperiencia(50);
    }

    preguntaTexto.hidden = true;
    opcionesQuiz.hidden = true;
    retroalimentacion.hidden = true;
    siguientePregunta.hidden = true;
    resultadoQuiz.hidden = false;

    numeroPregunta.textContent = "Cuestionario completado";
    puntuacionActual.textContent = `${aciertosQuiz}/${preguntasQuiz.length} correctas`;
    progresoQuiz.style.width = "100%";

    let mensaje;

    if (porcentaje === 100) {
        mensaje = "¡Excelente! Respondiste todas las preguntas correctamente.";
    } else if (porcentaje >= 60) {
        mensaje = "Buen trabajo. Repasa los ejercicios que te costaron.";
    } else {
        mensaje = "Repasa las explicaciones e inténtalo de nuevo para reforzar tus conocimientos.";
    }

    resumenQuiz.textContent =
        `Resultado: ${aciertosQuiz} de ${preguntasQuiz.length} respuestas correctas (${porcentaje} %). ${mensaje}`;

    try {
        const historial = JSON.parse(
            localStorage.getItem("studyboost-resultados") || "[]"
        );

        historial.push({
            fecha: new Date().toISOString(),
            aciertos: aciertosQuiz,
            total: preguntasQuiz.length,
            porcentaje: porcentaje
        });

        localStorage.setItem("studyboost-resultados", JSON.stringify(historial));
    } catch (error) {
        console.warn("No se pudo guardar el resultado.", error);
    }
}

siguientePregunta.addEventListener("click", () => {
    if (!respondida) return;

    if (indicePregunta < preguntasQuiz.length - 1) {
        indicePregunta++;
        mostrarPregunta();
    } else {
        finalizarQuiz();
    }
});

reiniciarQuiz.addEventListener("click", () => {
    indicePregunta = 0;
    aciertosQuiz = 0;
    mostrarPregunta();
});

mostrarPregunta();

mostrarTareas();
mostrarReloj();
const ventanaModal = document.getElementById("ventanaModal");
const tituloModal = document.getElementById("tituloModal");
const contenidoModal = document.getElementById("contenidoModal");
const cerrarModal = document.getElementById("cerrarModal");
const seccionTareas = document.getElementById("tareas");
const marcadorTareas = document.createComment("Lugar original de tareas");

seccionTareas.parentNode.insertBefore(marcadorTareas, seccionTareas);

function abrirModal(titulo, contenido) {
    tituloModal.textContent = titulo;
    contenidoModal.innerHTML = contenido;
    ventanaModal.hidden = false;
}

function cerrarVentanaModal() {
    ventanaModal.hidden = true;

    if (seccionTareas.parentNode === contenidoModal) {
        marcadorTareas.parentNode.insertBefore(
            seccionTareas,
            marcadorTareas
        );
    }
}

cerrarModal.addEventListener("click", cerrarVentanaModal);

ventanaModal.addEventListener("click", function (evento) {
    if (evento.target === ventanaModal) {
        cerrarVentanaModal();
    }
});
function mostrarRetosDiarios() {
    const claveRetos = "studyBoostRetosDiarios";

    const bancoRetos = {
        matematicas: [
            "Dedica 15 minutos a resolver ejercicios de matemáticas.",
            "Resuelve tres ejercicios de álgebra y comprueba tus resultados.",
            "Estudia un concepto matemático e inventa un ejemplo propio."
        ],
        programacion: [
            "Dedica 15 minutos a practicar Python.",
            "Escribe un pequeño programa y explica cómo funciona.",
            "Resuelve un problema sencillo usando condiciones o ciclos."
        ],
        ingles: [
            "Estudia 10 palabras nuevas en inglés y crea oraciones con ellas.",
            "Lee un texto corto en inglés e identifica su idea principal.",
            "Dedica 15 minutos a practicar gramática inglesa."
        ],
        ciencias: [
            "Estudia durante 15 minutos un concepto de física.",
            "Repasa un concepto de química y resuelve un ejercicio.",
            "Aprende un concepto de biología y explícalo con tus palabras."
        ],
        lectura: [
            "Lee durante 15 minutos y resume la idea principal.",
            "Lee un texto argumentativo e identifica su tesis.",
            "Aprende una palabra nueva y úsala en una oración."
        ],
        sociales: [
            "Estudia un acontecimiento histórico y explica una de sus causas.",
            "Repasa un concepto de geografía y busca un ejemplo.",
            "Dedica 15 minutos a comprender un tema de ciudadanía."
        ],
        pensamiento: [
            "Resuelve un acertijo lógico y explica tu razonamiento.",
            "Dedica 10 minutos a practicar cálculo mental.",
            "Analiza un problema cotidiano y plantea dos posibles soluciones."
        ]
    };

    // Obtener la fecha local para mantener los retos durante el día.
    const ahora = new Date();
    const anio = ahora.getFullYear();
    const mes = String(ahora.getMonth() + 1).padStart(2, "0");
    const dia = String(ahora.getDate()).padStart(2, "0");
    const fechaHoy = `${anio}-${mes}-${dia}`;

    let datosRetos = null;

    try {
        datosRetos = JSON.parse(
            localStorage.getItem(claveRetos)
        );
    } catch (error) {
        datosRetos = null;
    }

    // Si cambió el día, generar tres retos de materias diferentes.
    if (
        !datosRetos ||
        datosRetos.fecha !== fechaHoy ||
        !Array.isArray(datosRetos.retos) ||
        datosRetos.retos.length !== 3
    ) {
        const materias = Object.keys(bancoRetos);

        for (let i = materias.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [materias[i], materias[j]] = [materias[j], materias[i]];
        }

        datosRetos = {
            fecha: fechaHoy,
            retos: materias.slice(0, 3).map(materia => {
                const opciones = bancoRetos[materia];
                const indice = Math.floor(Math.random() * opciones.length);

                return {
                    materia,
                    texto: opciones[indice],
                    completado: false
                };
            })
        };

        localStorage.setItem(
            claveRetos,
            JSON.stringify(datosRetos)
        );
    }

    // Crear el contenido de los retos.
    contenidoModal.innerHTML = `
        <div class="retos-diarios">
            <h3>🎯 Tus tres retos de hoy</h3>
            <p>Pequeños pasos diarios para fortalecer tus conocimientos.</p>
            <p id="resumenRetos"></p>
            <div id="listaRetosDiarios"></div>
        </div>
    `;

    const lista = document.getElementById("listaRetosDiarios");

    datosRetos.retos.forEach((reto, indice) => {
        const tarjeta = document.createElement("div");
        tarjeta.className = "reto-diario";

        const etiqueta = document.createElement("label");
        etiqueta.className = "reto-etiqueta";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = reto.completado;
        checkbox.setAttribute(
            "aria-label",
            "Marcar reto como completado"
        );

        const texto = document.createElement("span");
        texto.textContent = reto.texto;

        if (reto.completado) {
            tarjeta.classList.add("reto-completado");
        }

        checkbox.addEventListener("change", () => {
            const retoActual = datosRetos.retos[indice];
            const idReto = `${datosRetos.fecha}-${retoActual.materia}-${indice}`;

            // Un reto completado no puede desmarcarse ni dar XP otra vez.
            if (retoActual.completado) {
                checkbox.checked = true;
                return;
            }

            if (!checkbox.checked) {
                return;
            }

            retoActual.completado = true;

            if (!progresoEstudio.retosRecompensados.includes(idReto)) {
                progresoEstudio.retosRecompensados.push(idReto);

                registrarActividadSemanal(`reto-${idReto}`);
                otorgarExperiencia(25);
            }

            localStorage.setItem(claveRetos, JSON.stringify(datosRetos));
            guardarProgresoEstudio();

            checkbox.disabled = true;
            tarjeta.classList.add("reto-completado");
            actualizarProgreso();
            actualizarResumenRetos();
        });

        etiqueta.append(checkbox, texto);
        tarjeta.appendChild(etiqueta);
        lista.appendChild(tarjeta);
    });

    function actualizarResumenRetos() {
        const completados = datosRetos.retos.filter(
            reto => reto.completado
        ).length;

        document.getElementById("resumenRetos").textContent =
            `Progreso de hoy: ${completados} de 3 retos completados.`;
    }

    actualizarResumenRetos();

}
document.querySelectorAll(".menu a").forEach(function (enlace) {
    enlace.addEventListener("click", function (evento) {
        evento.preventDefault();

        const destino = enlace.getAttribute("href");

        if (destino === "#tareas") {
            abrirModal("Mis tareas", "");
            mostrarRetosDiarios();

        } else if (destino === "#apuntes") {
            mostrarPortadaApuntes();
        } else if (destino === "#concentracion") {
            mostrarConcentracion();

        } else if (destino === "#progreso") {
            abrirModal("Mi progreso", "");
            mostrarLogros();

        } else if (destino === "#matematicas") {
            mostrarCursosMatematicas();

        } else if (destino === "#inicio") {
            abrirModal(
                "Inicio",
                "<p>¡Bienvenido a tu espacio de aprendizaje StudyBoost!</p>"
            );
        }
    });
});
const contenidosAsignaturas = {
    matematicas: {
        titulo: "Matemáticas",
        concepto: "Las ecuaciones, funciones, geometría y estadística permiten modelar y resolver problemas.",
        ejemplo: "En x² - 5x + 6 = 0, factorizamos (x - 2)(x - 3) = 0. Las soluciones son x = 2 y x = 3.",
        preguntas: [
            {
                pregunta: "¿Cuáles son las soluciones de x² - 7x + 12 = 0?",
                opciones: ["3 y 4", "2 y 6", "-3 y -4", "1 y 12"],
                correcta: 0,
                explicacion: "(x - 3)(x - 4) = 0; por tanto, x = 3 o x = 4."
            },
            {
                pregunta: "Si f(x) = 3x - 2, ¿cuánto vale f(4)?",
                opciones: ["10", "12", "14", "6"],
                correcta: 0,
                explicacion: "Sustituimos x por 4: f(4) = 3(4) - 2 = 10."
            },
            {
                pregunta: "¿Cuál es la pendiente de la recta que pasa por (1, 2) y (3, 8)?",
                opciones: ["2", "3", "4", "6"],
                correcta: 1,
                explicacion: "m = (8 - 2)/(3 - 1) = 6/2 = 3."
            },
            {
                pregunta: "Un triángulo rectángulo tiene catetos de 6 cm y 8 cm. ¿Cuánto mide la hipotenusa?",
                opciones: ["10 cm", "12 cm", "14 cm", "100 cm"],
                correcta: 0,
                explicacion: "Por Pitágoras: h² = 6² + 8² = 36 + 64 = 100; h = 10 cm."
            },
            {
                pregunta: "¿Cuál es el 15 % de 240?",
                opciones: ["24", "30", "36", "40"],
                correcta: 2,
                explicacion: "0,15 × 240 = 36."
            },
            {
                pregunta: "¿Cuál es la media de 4, 6, 8 y 10?",
                opciones: ["6", "7", "8", "28"],
                correcta: 1,
                explicacion: "La media es (4 + 6 + 8 + 10)/4 = 28/4 = 7."
            },
            {
                pregunta: "Si 2x + 5 = 17, ¿cuánto vale x?",
                opciones: ["5", "6", "11", "12"],
                correcta: 1,
                explicacion: "Restamos 5: 2x = 12. Dividimos entre 2: x = 6."
            },
            {
                pregunta: "¿Cuál es la probabilidad de obtener un número par al lanzar un dado justo de seis caras?",
                opciones: ["1/6", "1/3", "1/2", "2/3"],
                correcta: 2,
                explicacion: "Hay tres resultados pares (2, 4, 6) entre seis posibles: 3/6 = 1/2."
            }
        ]
    },

    fisica: {
        titulo: "Física",
        concepto: "La física estudia el movimiento, las fuerzas, la energía y los fenómenos naturales.",
        ejemplo: "Si recorres 150 metros en 30 segundos, la rapidez media es 150/30 = 5 m/s.",
        preguntas: [
            {
                pregunta: "Un ciclista recorre 240 m en 40 s. ¿Cuál es su rapidez media?",
                opciones: ["4 m/s", "6 m/s", "8 m/s", "10 m/s"],
                correcta: 1,
                explicacion: "v = d/t = 240/40 = 6 m/s."
            },
            {
                pregunta: "Un objeto cambia su velocidad de 4 m/s a 16 m/s en 3 s. ¿Cuál es su aceleración media?",
                opciones: ["3 m/s²", "4 m/s²", "6 m/s²", "12 m/s²"],
                correcta: 1,
                explicacion: "a = (vf - vi)/t = (16 - 4)/3 = 4 m/s²."
            },
            {
                pregunta: "¿Qué fuerza neta actúa sobre una masa de 5 kg que acelera a 2 m/s²?",
                opciones: ["2,5 N", "7 N", "10 N", "25 N"],
                correcta: 2,
                explicacion: "Por la segunda ley de Newton, F = ma = 5 × 2 = 10 N."
            },
            {
                pregunta: "¿Cuál es la energía cinética de un objeto de 2 kg que se mueve a 3 m/s?",
                opciones: ["6 J", "9 J", "12 J", "18 J"],
                correcta: 1,
                explicacion: "Ec = ½mv² = ½ × 2 × 3² = 9 J."
            },
            {
                pregunta: "¿Qué ocurre con la aceleración si la fuerza neta se duplica y la masa no cambia?",
                opciones: ["Se reduce a la mitad", "Se duplica", "No cambia", "Se cuadruplica"],
                correcta: 1,
                explicacion: "Según a = F/m, duplicar la fuerza duplica la aceleración."
            },
            {
                pregunta: "¿Cuánto trabajo realiza una fuerza de 10 N que desplaza un objeto 4 m en su misma dirección?",
                opciones: ["2,5 J", "14 J", "40 J", "400 J"],
                correcta: 2,
                explicacion: "W = Fd cuando la fuerza y el desplazamiento tienen la misma dirección: 10 × 4 = 40 J."
            },
            {
                pregunta: "Un objeto de 2 kg está a 5 m de altura. Usa g = 10 m/s². ¿Cuál es su energía potencial gravitatoria?",
                opciones: ["10 J", "25 J", "50 J", "100 J"],
                correcta: 3,
                explicacion: "Ep = mgh = 2 × 10 × 5 = 100 J."
            },
            {
                pregunta: "En un circuito sencillo, ¿qué magnitud se mide en amperios?",
                opciones: ["Voltaje", "Resistencia", "Corriente eléctrica", "Energía"],
                correcta: 2,
                explicacion: "La corriente eléctrica se mide en amperios (A). El voltaje se mide en voltios y la resistencia en ohmios."
            }
        ]
    },

    quimica: {
        titulo: "Química",
        concepto: "La química estudia la materia, sus propiedades, su composición y sus transformaciones.",
        ejemplo: "El número de neutrones se calcula restando el número atómico al número másico.",
        preguntas: [
            {
                pregunta: "Un átomo neutro tiene número atómico 11 y número másico 23. ¿Cuántos neutrones tiene?",
                opciones: ["11", "12", "23", "34"],
                correcta: 1,
                explicacion: "Neutrones = 23 - 11 = 12."
            },
            {
                pregunta: "¿Cuál es el símbolo químico del sodio?",
                opciones: ["S", "So", "Na", "N"],
                correcta: 2,
                explicacion: "El símbolo del sodio es Na, derivado de su nombre latino natrium."
            },
            {
                pregunta: "¿Cuántos átomos de oxígeno hay en una molécula de H₂SO₄?",
                opciones: ["1", "2", "3", "4"],
                correcta: 3,
                explicacion: "El subíndice 4 indica que hay cuatro átomos de oxígeno."
            },
            {
                pregunta: "¿Qué tipo de enlace suele formarse entre un metal y un no metal?",
                opciones: ["Iónico", "Metálico puro", "Siempre covalente no polar", "Nuclear"],
                correcta: 0,
                explicacion: "En muchos compuestos, un metal transfiere electrones a un no metal, formando iones que se atraen."
            },
            {
                pregunta: "¿Cuál es la masa molar aproximada del agua (H₂O)? Usa H = 1 y O = 16 g/mol.",
                opciones: ["16 g/mol", "17 g/mol", "18 g/mol", "20 g/mol"],
                correcta: 2,
                explicacion: "H₂O contiene dos H y un O: 2(1) + 16 = 18 g/mol."
            },
            {
                pregunta: "¿Qué indica un pH menor que 7 a 25 °C en una disolución acuosa?",
                opciones: ["Que es ácida", "Que es neutra", "Que es básica", "Que no contiene agua"],
                correcta: 0,
                explicacion: "A 25 °C, pH menor que 7 indica acidez; pH 7 es neutro y pH mayor que 7 es básico."
            },
            {
                pregunta: "¿Qué ley se cumple al balancear una ecuación química en un sistema cerrado?",
                opciones: ["Se crean átomos nuevos", "Se conserva el número de átomos de cada elemento", "Desaparece la masa", "Todos los coeficientes deben ser 1"],
                correcta: 1,
                explicacion: "Los átomos se reorganizan, pero no se crean ni se destruyen en una reacción química ordinaria."
            },
            {
                pregunta: "¿Cuántos moles hay en 36 g de agua? Usa una masa molar de 18 g/mol.",
                opciones: ["0,5 mol", "1 mol", "2 mol", "18 mol"],
                correcta: 2,
                explicacion: "n = m/M = 36/18 = 2 mol."
            }
        ]
    },

    biologia: {
        titulo: "Biología",
        concepto: "La biología estudia los seres vivos, sus estructuras, funciones, evolución e interacciones.",
        ejemplo: "La mitosis permite producir dos células hijas que normalmente conservan el número de cromosomas de la célula original.",
        preguntas: [
            {
                pregunta: "¿Qué resultado produce normalmente la mitosis?",
                opciones: ["Cuatro células con la mitad de cromosomas", "Dos células con igual número de cromosomas", "Una célula sin ADN", "Dos células sin núcleo"],
                correcta: 1,
                explicacion: "La mitosis produce normalmente dos células hijas con la misma cantidad de cromosomas que la célula original."
            },
            {
                pregunta: "¿Qué orgánulo participa principalmente en la producción de ATP mediante respiración celular?",
                opciones: ["Ribosoma", "Mitocondria", "Lisosoma", "Vacuola"],
                correcta: 1,
                explicacion: "La mitocondria es un lugar principal de producción de ATP durante la respiración celular aeróbica."
            },
            {
                pregunta: "¿Qué molécula almacena gran parte de la información hereditaria?",
                opciones: ["ADN", "Almidón", "Agua", "Hemoglobina"],
                correcta: 0,
                explicacion: "El ADN contiene la información genética de los organismos."
            },
            {
                pregunta: "En una cadena alimentaria, ¿qué función cumplen los productores?",
                opciones: ["Se alimentan de todos los consumidores", "Transforman energía en materia orgánica", "Solo descomponen cadáveres", "No necesitan energía"],
                correcta: 1,
                explicacion: "Los productores, como las plantas, fabrican materia orgánica usando energía luminosa o química."
            },
            {
                pregunta: "Si A es dominante sobre a, ¿qué genotipo expresa el rasgo recesivo en un modelo mendeliano simple?",
                opciones: ["AA", "Aa", "aA", "aa"],
                correcta: 3,
                explicacion: "El rasgo recesivo se expresa con dos alelos recesivos: aa."
            },
            {
                pregunta: "¿Cuál es la función principal de los glóbulos rojos?",
                opciones: ["Transportar principalmente oxígeno", "Producir hormonas digestivas", "Filtrar la orina", "Generar impulsos nerviosos"],
                correcta: 0,
                explicacion: "La hemoglobina de los glóbulos rojos transporta oxígeno en la sangre."
            },
            {
                pregunta: "¿Qué proceso permite a las plantas producir glucosa usando luz?",
                opciones: ["Fermentación", "Fotosíntesis", "Digestión", "Mitosis"],
                correcta: 1,
                explicacion: "En la fotosíntesis, la energía luminosa impulsa la producción de materia orgánica a partir de CO₂ y agua."
            },
            {
                pregunta: "¿Qué puede ocurrir con una población cuando cambia su ambiente y algunos individuos tienen rasgos heredables ventajosos?",
                opciones: ["Todos cambian voluntariamente", "Esos rasgos pueden hacerse más comunes por selección natural", "La evolución se detiene siempre", "Los individuos dejan de heredar ADN"],
                correcta: 1,
                explicacion: "La selección natural puede aumentar la frecuencia de rasgos heredables que favorecen la supervivencia y reproducción."
            }
        ]
    },

    lenguaje: {
        titulo: "Lenguaje y lectura crítica",
        concepto: "La lectura crítica exige identificar tesis, argumentos, propósito, tono e inferencias de un texto.",
        ejemplo: "Una afirmación central defendida por razones o evidencias suele ser la tesis de un texto argumentativo.",
        preguntas: [
            {
                pregunta: "Un texto defiende que los colegios deberían ampliar sus zonas verdes. ¿Qué sería la tesis?",
                opciones: ["Los árboles necesitan agua", "Los colegios deberían ampliar sus zonas verdes", "El agua es un recurso", "Los patios tienen medidas"],
                correcta: 1,
                explicacion: "La tesis es la postura principal que el autor busca defender."
            },
            {
                pregunta: "¿Qué es una inferencia al leer?",
                opciones: ["Copiar literalmente una oración", "Deducir una idea a partir de pistas del texto", "Ignorar el contexto", "Contar los párrafos"],
                correcta: 1,
                explicacion: "Inferir es obtener una conclusión razonable a partir de información explícita y pistas."
            },
            {
                pregunta: "¿Cuál es la función principal de un argumento en un texto persuasivo?",
                opciones: ["Respaldar una tesis", "Cambiar el título", "Eliminar toda evidencia", "Describir solo el paisaje"],
                correcta: 0,
                explicacion: "Los argumentos aportan razones o evidencias para apoyar una postura."
            },
            {
                pregunta: "¿Qué figura literaria aparece en «Tus ojos son dos luceros»?",
                opciones: ["Metáfora", "Hipérbole", "Onomatopeya", "Ironía necesariamente"],
                correcta: 0,
                explicacion: "La expresión identifica los ojos con luceros sin usar un nexo comparativo: es una metáfora."
            },
            {
                pregunta: "¿Cuál es el propósito más habitual de una reseña crítica?",
                opciones: ["Resumir y valorar una obra", "Enumerar números al azar", "Reemplazar la obra original", "Presentar solo datos sin valoración"],
                correcta: 0,
                explicacion: "Una reseña presenta información sobre una obra y ofrece una valoración argumentada."
            },
            {
                pregunta: "Si un autor utiliza datos estadísticos para defender una idea, ¿qué está aportando principalmente?",
                opciones: ["Evidencia", "Un personaje ficticio necesariamente", "Una rima", "Una contradicción automática"],
                correcta: 0,
                explicacion: "Los datos pueden funcionar como evidencia para respaldar una afirmación, si son pertinentes y fiables."
            },
            {
                pregunta: "¿Qué relación expresa normalmente el conector «sin embargo»?",
                opciones: ["Contraste", "Causa", "Secuencia temporal únicamente", "Ejemplificación"],
                correcta: 0,
                explicacion: "«Sin embargo» introduce una oposición o contraste con una idea anterior."
            },
            {
                pregunta: "¿Qué debe evaluarse para juzgar la confiabilidad de una fuente?",
                opciones: ["Solo el color de la página", "Autoría, evidencias, actualidad y posibles sesgos", "La longitud del título solamente", "La cantidad de imágenes sin contexto"],
                correcta: 1,
                explicacion: "La credibilidad requiere revisar quién publica, qué evidencia presenta, cuándo y con qué posibles sesgos."
            }
        ]
    },

    ingles: {
        titulo: "Inglés",
        concepto: "El present perfect se forma con have/has + participio pasado. Se utiliza, entre otros usos, para experiencias relacionadas con el presente.",
        ejemplo: "I have visited Cartagena. = He visitado Cartagena.",
        preguntas: [
            {
                pregunta: "Choose the grammatically correct sentence.",
                opciones: ["She have finished her homework.", "She has finish her homework.", "She has finished her homework.", "She finished has her homework."],
                correcta: 2,
                explicacion: "With she, use has + past participle: has finished."
            },
            {
                pregunta: "Complete: They ___ to school every day.",
                opciones: ["goes", "going", "go", "gone"],
                correcta: 2,
                explicacion: "With they, the present simple uses the base form: they go."
            },
            {
                pregunta: "Choose the correct past form: Yesterday, we ___ a movie.",
                opciones: ["see", "saw", "seen", "seeing"],
                correcta: 1,
                explicacion: "The past simple of see is saw."
            },
            {
                pregunta: "What is the closest meaning of 'although'?",
                opciones: ["Because", "Despite the fact that", "Therefore", "For example"],
                correcta: 1,
                explicacion: "'Although' introduces a contrast and means 'a pesar de que'."
            },
            {
                pregunta: "Complete: If it rains tomorrow, we ___ at home.",
                opciones: ["stay", "stayed", "will stay", "would stayed"],
                correcta: 2,
                explicacion: "The first conditional commonly uses if + present simple, will + base verb."
            },
            {
                pregunta: "Choose the correct comparative form: This test is ___ than the last one.",
                opciones: ["difficult", "more difficult", "most difficult", "the more difficult"],
                correcta: 1,
                explicacion: "For many longer adjectives, use more + adjective + than."
            },
            {
                pregunta: "Complete: I have lived here ___ 2022.",
                opciones: ["for", "since", "during", "from"],
                correcta: 1,
                explicacion: "Use since with the starting point of a period: since 2022."
            },
            {
                pregunta: "What does 'reliable' mean?",
                opciones: ["Trustworthy", "Extremely noisy", "Very expensive", "Unfinished"],
                correcta: 0,
                explicacion: "'Reliable' means dependable or trustworthy: confiable."
            }
        ]
    },

    sociales: {
        titulo: "Ciencias sociales",
        concepto: "Las ciencias sociales estudian las sociedades, las instituciones, los procesos históricos y las relaciones de poder.",
        ejemplo: "La separación de poderes distribuye funciones estatales entre instituciones para reducir la concentración del poder.",
        preguntas: [
            {
                pregunta: "¿Cuál es un objetivo de la separación de poderes?",
                opciones: ["Concentrar el poder", "Evitar la concentración del poder", "Eliminar los tribunales", "Suprimir todas las leyes"],
                correcta: 1,
                explicacion: "La separación permite distribuir funciones y establecer controles entre instituciones."
            },
            {
                pregunta: "¿Cuál fue una causa importante de la Independencia hispanoamericana?",
                opciones: ["La ausencia total de desigualdades", "Las tensiones con el dominio colonial y las ideas ilustradas", "La invención de internet", "La desaparición de todos los impuestos"],
                correcta: 1,
                explicacion: "Influyeron las tensiones políticas y económicas, las restricciones coloniales y nuevas ideas sobre soberanía."
            },
            {
                pregunta: "¿Qué es la migración?",
                opciones: ["El desplazamiento de personas para cambiar de lugar de residencia", "El cambio de estaciones", "El crecimiento de una roca", "La división celular"],
                correcta: 0,
                explicacion: "La migración implica desplazamientos de población, dentro de un país o entre países."
            },
            {
                pregunta: "¿Qué función cumple una constitución?",
                opciones: ["Organiza el Estado y establece derechos y reglas fundamentales", "Es solo un mapa físico", "Reemplaza toda forma de ciudadanía", "Es siempre una ley municipal"],
                correcta: 0,
                explicacion: "La constitución establece la estructura básica del Estado, sus poderes y derechos fundamentales."
            },
            {
                pregunta: "¿Qué estudia principalmente la geografía humana?",
                opciones: ["La relación entre las sociedades y el espacio geográfico", "Solo las reacciones químicas", "La estructura interna de los átomos", "La sintaxis de un idioma"],
                correcta: 0,
                explicacion: "La geografía humana estudia la población, las actividades y las formas en que las sociedades organizan el espacio."
            },
            {
                pregunta: "¿Qué es una fuente primaria para estudiar un acontecimiento histórico?",
                opciones: ["Un documento o testimonio producido en la época estudiada", "Un resumen actual sin referencias", "Una opinión sin relación con el hecho", "Una ficción presentada como prueba"],
                correcta: 0,
                explicacion: "Las fuentes primarias provienen del período o de participantes relacionados con el acontecimiento."
            },
            {
                pregunta: "¿Qué significa que un país tenga una democracia representativa?",
                opciones: ["Que los ciudadanos eligen representantes para tomar decisiones públicas", "Que nadie puede votar", "Que no existen instituciones", "Que una sola persona decide siempre"],
                correcta: 0,
                explicacion: "En una democracia representativa, la ciudadanía elige representantes mediante procedimientos establecidos."
            },
            {
                pregunta: "¿Qué suele indicar un aumento persistente del nivel general de precios?",
                opciones: ["Inflación", "Deflación necesariamente", "Una reducción automática de todos los precios", "Una mayor producción en cada sector"],
                correcta: 0,
                explicacion: "La inflación es un aumento generalizado y sostenido del nivel de precios."
            }
        ]
    }
};
function mostrarAsignatura(clave) {
    const asignatura = contenidosAsignaturas[clave];
    if (!asignatura) return;

    // Mezclar las preguntas y seleccionar seis distintas.
    const preguntasSesion = [...asignatura.preguntas]
        .sort(() => Math.random() - 0.5)
        .slice(0, 6);

    let preguntaActual = 0;
    let aciertos = 0;
    let respondida = false;

    function mostrarPregunta() {
        const pregunta = preguntasSesion[preguntaActual];
        respondida = false;

        contenidoModal.innerHTML = `
            <button type="button" class="boton volver-apuntes">
                ← Todas las asignaturas
            </button>

            <h3>${asignatura.titulo}</h3>

            <h4>📘 Concepto clave</h4>
            <p>${asignatura.concepto}</p>

            <h4>✏️ Ejemplo resuelto</h4>
            <p>${asignatura.ejemplo}</p>

            <div class="ejercicio-apuntes">
                <div class="quiz-cabecera">
                    <span>Pregunta ${preguntaActual + 1} de 6</span>
                    <span>Aciertos: ${aciertos}</span>
                </div>

                <div class="barra quiz-barra">
                    <div style="width: ${(preguntaActual / 6) * 100}%"></div>
                </div>

                <h4>🧠 ${pregunta.pregunta}</h4>

                <div class="opciones-apuntes">
                    ${pregunta.opciones.map((opcion, indice) => `
                        <button type="button"
                            class="opcion-apuntes"
                            data-opcion="${indice}">
                            ${opcion}
                        </button>
                    `).join("")}
                </div>

                <p class="resultado-apuntes" aria-live="polite"></p>

                <button type="button" class="boton siguiente-apunte" hidden>
                    Siguiente pregunta
                </button>
            </div>
        `;

        contenidoModal.querySelector(".volver-apuntes")
            .addEventListener("click", mostrarPortadaApuntes);

        contenidoModal.querySelectorAll(".opcion-apuntes")
            .forEach(boton => {
                boton.addEventListener("click", () => {
                    if (respondida) return;
                    respondida = true;

                    const elegida = Number(boton.dataset.opcion);
                    const botones = contenidoModal.querySelectorAll(".opcion-apuntes");
                    const resultado = contenidoModal.querySelector(".resultado-apuntes");
                    const siguiente = contenidoModal.querySelector(".siguiente-apunte");

                    botones.forEach(opcion => opcion.disabled = true);

                    if (elegida === pregunta.correcta) {
                        aciertos++;
                        resultado.textContent = "¡Correcto! 🎉 " + pregunta.explicacion;
                        resultado.className = "resultado-apuntes respuesta-correcta";
                    } else {
                        resultado.textContent =
                            "Respuesta correcta: " +
                            pregunta.opciones[pregunta.correcta] +
                            ". " + pregunta.explicacion;
                        resultado.className = "resultado-apuntes respuesta-incorrecta";
                    }

                    // Actualizar la puntuación visible.
                    contenidoModal.querySelector(".quiz-cabecera span:last-child")
                        .textContent = "Aciertos: " + aciertos;

                    siguiente.hidden = false;
                    siguiente.textContent = preguntaActual === 5
                        ? "Ver resultado"
                        : "Siguiente pregunta";
                });
            });

        contenidoModal.querySelector(".siguiente-apunte")
            .addEventListener("click", () => {
                if (!respondida) return;

                if (preguntaActual < 5) {
                    preguntaActual++;
                    mostrarPregunta();
                } else {
                    mostrarResultado();
                }
            });
    }

    function mostrarResultado() {
        const porcentaje = Math.round((aciertos / 6) * 100);

        contenidoModal.innerHTML = `
            <h3>🎉 ¡Cuestionario terminado!</h3>
            <p>Asignatura: ${asignatura.titulo}</p>
            <p>Tu resultado: <strong>${aciertos} de 6</strong> (${porcentaje} %)</p>
            <p>${aciertos === 6
                ? "¡Excelente! Has respondido todas correctamente."
                : aciertos >= 4
                    ? "¡Buen trabajo! Repasa las preguntas que fallaste para seguir mejorando."
                    : "Sigue practicando. Revisa las explicaciones e inténtalo de nuevo."
            }</p>

            <button type="button" class="boton repetir-apuntes">
                Practicar de nuevo
            </button>

            <button type="button" class="boton volver-apuntes">
                Todas las asignaturas
            </button>
        `;

        contenidoModal.querySelector(".repetir-apuntes")
            .addEventListener("click", () => mostrarAsignatura(clave));

        contenidoModal.querySelector(".volver-apuntes")
            .addEventListener("click", mostrarPortadaApuntes);
    }

    mostrarPregunta();
}
function mostrarPortadaApuntes() {
    abrirModal("Mis apuntes", `
        <p class="intro-apuntes">
            Refuerza tus conocimientos de 9.º, 10.º y 11.º
            con conceptos clave y ejercicios prácticos.
        </p>

        <div class="rejilla-asignaturas">
            <button type="button" class="tarjeta-asignatura" data-asignatura="matematicas">
                <span class="icono-asignatura">📐</span>
                <strong>Matemáticas</strong>
                <span>Álgebra, funciones y geometría</span>
            </button>
            <button type="button" class="tarjeta-asignatura" data-asignatura="fisica">
                <span class="icono-asignatura">⚙️</span>
                <strong>Física</strong>
                <span>Movimiento, fuerzas y energía</span>
            </button>
            <button type="button" class="tarjeta-asignatura" data-asignatura="quimica">
                <span class="icono-asignatura">🧪</span>
                <strong>Química</strong>
                <span>Átomos, reacciones y soluciones</span>
            </button>
            <button type="button" class="tarjeta-asignatura" data-asignatura="biologia">
                <span class="icono-asignatura">🧬</span>
                <strong>Biología</strong>
                <span>Células, genética y ecosistemas</span>
            </button>
            <button type="button" class="tarjeta-asignatura" data-asignatura="lenguaje">
                <span class="icono-asignatura">📚</span>
                <strong>Lenguaje</strong>
                <span>Lectura crítica y literatura</span>
            </button>
            <button type="button" class="tarjeta-asignatura" data-asignatura="ingles">
                <span class="icono-asignatura">🌎</span>
                <strong>Inglés</strong>
                <span>Gramática, vocabulario y lectura</span>
            </button>
            <button type="button" class="tarjeta-asignatura" data-asignatura="sociales">
                <span class="icono-asignatura">🌐</span>
                <strong>Ciencias sociales</strong>
                <span>Historia, geografía y ciudadanía</span>
            </button>
        </div>
    `);

    contenidoModal.querySelectorAll("[data-asignatura]").forEach(tarjeta => {
        tarjeta.addEventListener("click", () => {
            mostrarAsignatura(tarjeta.dataset.asignatura);
        });
    });

    // Abrir la biblioteca de recursos
    document.getElementById("abrirBiblioteca").addEventListener("click", () => {
        mostrarBibliotecaRecursos();
    });
}
const recursosBiblioteca = [
    // MATEMÁTICAS
    {
        titulo: "Teorema de Pitágoras",
        categoria: "formula",
        asignatura: "Matemáticas",
        contenido: "a² + b² = c²",
        detalle: "En un triángulo rectángulo, c es la hipotenusa y a y b son los catetos.",
        ejemplo: "Si los catetos miden 3 y 4, la hipotenusa mide 5."
    },
    {
        titulo: "Ecuación cuadrática",
        categoria: "formula",
        asignatura: "Matemáticas",
        contenido: "x = (−b ± √(b² − 4ac)) / 2a",
        detalle: "Resuelve ecuaciones de la forma ax² + bx + c = 0, con a ≠ 0.",
        ejemplo: "En x² − 5x + 6 = 0, las soluciones son x = 2 y x = 3."
    },
    {
        titulo: "Pendiente de una recta",
        categoria: "formula",
        asignatura: "Matemáticas",
        contenido: "m = (y₂ − y₁) / (x₂ − x₁)",
        detalle: "Mide cuánto cambia y por cada unidad que cambia x, si x₂ ≠ x₁.",
        ejemplo: "Entre (1, 2) y (3, 6), la pendiente es 2."
    },
    {
        titulo: "Número primo",
        categoria: "concepto",
        asignatura: "Matemáticas",
        contenido: "Un número natural mayor que 1 con exactamente dos divisores positivos.",
        detalle: "Sus únicos divisores positivos son 1 y el propio número.",
        ejemplo: "7 es primo; 9 no lo es porque también es divisible entre 3."
    },

    // FÍSICA
    {
        titulo: "Velocidad media",
        categoria: "formula",
        asignatura: "Física",
        contenido: "v = Δx / Δt",
        detalle: "Relaciona el desplazamiento con el tiempo transcurrido.",
        ejemplo: "Si recorres 100 metros en 20 segundos en línea recta, tu velocidad media es 5 m/s."
    },
    {
        titulo: "Segunda ley de Newton",
        categoria: "formula",
        asignatura: "Física",
        contenido: "F = m · a",
        detalle: "La fuerza neta es igual a la masa multiplicada por la aceleración.",
        ejemplo: "Una masa de 2 kg con aceleración de 3 m/s² requiere una fuerza neta de 6 N."
    },
    {
        titulo: "Energía cinética",
        categoria: "formula",
        asignatura: "Física",
        contenido: "Ec = ½mv²",
        detalle: "Es la energía asociada al movimiento de un objeto.",
        ejemplo: "Si duplicas la rapidez, la energía cinética se multiplica por cuatro."
    },
    {
        titulo: "¿Por qué flotan algunos objetos?",
        categoria: "lectura",
        asignatura: "Física",
        contenido: "La flotación y el empuje",
        detalle: "Un fluido ejerce un empuje hacia arriba sobre los objetos sumergidos.",
        ejemplo: "Un objeto puede flotar cuando su densidad media es menor que la del fluido."
    },

    // QUÍMICA
    {
        titulo: "Cantidad de sustancia",
        categoria: "formula",
        asignatura: "Química",
        contenido: "n = m / M",
        detalle: "Los moles se obtienen dividiendo la masa entre la masa molar, usando unidades compatibles.",
        ejemplo: "36 g de agua, con masa molar aproximada de 18 g/mol, corresponden a 2 mol."
    },
    {
        titulo: "Escala de pH",
        categoria: "concepto",
        asignatura: "Química",
        contenido: "Describe la acidez de una disolución acuosa.",
        detalle: "Aproximadamente a 25 °C, pH menor que 7 es ácido, 7 es neutro y mayor que 7 es básico.",
        ejemplo: "El jugo de limón suele ser ácido."
    },
    {
        titulo: "Conservación de la masa",
        categoria: "concepto",
        asignatura: "Química",
        contenido: "La masa total se conserva en una reacción química dentro de un sistema cerrado.",
        detalle: "Los átomos se reorganizan; no desaparecen ni se crean en una reacción química ordinaria.",
        ejemplo: "En una ecuación química ajustada debe haber igual número de átomos de cada elemento a ambos lados."
    },

    // BIOLOGÍA
    {
        titulo: "Fotosíntesis",
        categoria: "concepto",
        asignatura: "Biología",
        contenido: "La energía luminosa permite producir sustancias orgánicas a partir de CO₂ y agua.",
        detalle: "En la fotosíntesis oxigénica se libera oxígeno; ocurre en plantas, algas y algunas bacterias.",
        ejemplo: "Las plantas utilizan la energía de la luz para fabricar azúcares."
    },
    {
        titulo: "ADN",
        categoria: "concepto",
        asignatura: "Biología",
        contenido: "Molécula que almacena información genética.",
        detalle: "Sus secuencias contienen instrucciones que participan en el desarrollo y funcionamiento de los organismos.",
        ejemplo: "Los genes son segmentos de ADN con información funcional."
    },
    {
        titulo: "Los ecosistemas",
        categoria: "lectura",
        asignatura: "Biología",
        contenido: "Relaciones entre organismos y ambiente",
        detalle: "Los seres vivos interactúan entre sí y con factores como la luz, el agua y la temperatura.",
        ejemplo: "Si disminuye una población de insectos, las especies que se alimentan de ellos pueden verse afectadas."
    },

    // LENGUAJE
    {
        titulo: "Tesis de un texto",
        categoria: "concepto",
        asignatura: "Lenguaje",
        contenido: "Idea principal que un texto argumentativo busca defender.",
        detalle: "Los argumentos aportan razones o evidencias para respaldarla.",
        ejemplo: "«La lectura diaria debería promoverse porque fortalece la comprensión» es una tesis defendible."
    },
    {
        titulo: "Metáfora",
        categoria: "concepto",
        asignatura: "Lenguaje",
        contenido: "Expresión que identifica una realidad con otra por una relación de semejanza.",
        detalle: "No se limita a describir literalmente: crea una asociación de significado.",
        ejemplo: "«Tus palabras son puentes» relaciona las palabras con la capacidad de conectar personas."
    },
    {
        titulo: "Cómo evaluar una fuente",
        categoria: "lectura",
        asignatura: "Lenguaje",
        contenido: "Autoría, evidencias, fecha y propósito",
        detalle: "Verifica quién publica, qué pruebas presenta y si otras fuentes fiables corroboran la información.",
        ejemplo: "Una afirmación viral sin autor ni evidencias necesita verificarse antes de compartirla."
    },

    // INGLÉS
    {
        titulo: "Present perfect",
        categoria: "formula",
        asignatura: "Inglés",
        contenido: "Subject + have/has + past participle",
        detalle: "Se usa, entre otros casos, para experiencias o situaciones pasadas conectadas con el presente.",
        ejemplo: "She has visited London."
    },
    {
        titulo: "First conditional",
        categoria: "formula",
        asignatura: "Inglés",
        contenido: "If + present simple, will + base verb",
        detalle: "Expresa una situación futura posible y su consecuencia.",
        ejemplo: "If it rains, we will stay home."
    },
    {
        titulo: "Although vs. because",
        categoria: "concepto",
        asignatura: "Inglés",
        contenido: "Although expresa contraste; because expresa causa.",
        detalle: "Elige el conector según la relación lógica entre las ideas.",
        ejemplo: "Although it was late, we continued. / We left because it was late."
    },

    // CIENCIAS SOCIALES
    {
        titulo: "Separación de poderes",
        categoria: "concepto",
        asignatura: "Ciencias sociales",
        contenido: "Distribución del poder estatal entre distintas instituciones.",
        detalle: "Busca limitar la concentración del poder y permitir controles entre instituciones.",
        ejemplo: "En Colombia existen ramas ejecutiva, legislativa y judicial."
    },
    {
        titulo: "Fuente histórica primaria",
        categoria: "concepto",
        asignatura: "Ciencias sociales",
        contenido: "Material producido durante el periodo estudiado o por participantes de los hechos.",
        detalle: "Su interpretación requiere considerar autoría, contexto, propósito y posibles sesgos.",
        ejemplo: "Una carta escrita durante una guerra puede ser una fuente primaria."
    },
    {
        titulo: "La inflación",
        categoria: "concepto",
        asignatura: "Ciencias sociales",
        contenido: "Aumento generalizado y sostenido del nivel de precios.",
        detalle: "Reduce el poder adquisitivo del dinero cuando los ingresos no crecen al mismo ritmo.",
        ejemplo: "Si muchos bienes suben de precio, con el mismo dinero puedes comprar menos."
    },

    // PROGRAMACIÓN
    {
        titulo: "Variable en Python",
        categoria: "concepto",
        asignatura: "Programación",
        contenido: "Una variable es un nombre asociado a un valor.",
        detalle: "Puedes utilizar ese nombre para consultar o actualizar el valor durante la ejecución.",
        ejemplo: "edad = 16"
    },
    {
        titulo: "Condicional en Python",
        categoria: "formula",
        asignatura: "Programación",
        contenido: "if condición:",
        detalle: "Ejecuta un bloque cuando la condición se cumple. Python usa la indentación para delimitarlo.",
        ejemplo: "if edad >= 18:\n    print('Mayor de edad')"
    },
    {
        titulo: "Algoritmo",
        categoria: "concepto",
        asignatura: "Programación",
        contenido: "Conjunto finito y ordenado de pasos para resolver un problema.",
        detalle: "Un algoritmo debe describir un procedimiento suficientemente preciso para obtener un resultado.",
        ejemplo: "Para hallar un promedio: sumar los valores y dividir por la cantidad de valores."
    }
];
function mostrarBibliotecaRecursos() {
    abrirModal("📚 Biblioteca de estudio", `
        <p class="intro-apuntes">
            Explora fórmulas, conceptos y lecturas para aprender
            algo nuevo cada día.
        </p>

        <div class="recursos-biblioteca">
            <label for="buscarRecurso">Buscar contenido</label>
            <input
                type="search"
                id="buscarRecurso"
                placeholder="Ej.: energía, ecuaciones, células..."
            >

            <label for="filtroRecurso">Filtrar por categoría</label>
            <select id="filtroRecurso">
                <option value="todos">Todos los recursos</option>
                <option value="formula">Fórmulas</option>
                <option value="concepto">Conceptos clave</option>
                <option value="lectura">Lecturas interesantes</option>
            </select>

            <label for="asignaturaRecurso">Filtrar por asignatura</label>
            <select id="asignaturaRecurso">
                <option value="todas">Todas las asignaturas</option>
                <option value="Matemáticas">Matemáticas</option>
                <option value="Física">Física</option>
                <option value="Química">Química</option>
                <option value="Biología">Biología</option>
                <option value="Lenguaje">Lenguaje</option>
                <option value="Inglés">Inglés</option>
                <option value="Ciencias sociales">Ciencias sociales</option>
                <option value="Programación">Programación</option>
            </select>

            <p id="contadorRecursos" aria-live="polite"></p>
            <div id="listaRecursos"></div>
        </div>
    `);

    const buscador = document.getElementById("buscarRecurso");
    const filtro = document.getElementById("filtroRecurso");
    const asignatura = document.getElementById("asignaturaRecurso");
    const lista = document.getElementById("listaRecursos");
    const contador = document.getElementById("contadorRecursos");

    function mostrarRecursos() {
        const texto = buscador.value.trim().toLocaleLowerCase();
        const categoriaSeleccionada = filtro.value;
        const asignaturaSeleccionada = asignatura.value;

        const resultados = recursosBiblioteca.filter(recurso => {
            const textoCompleto = [
                recurso.titulo,
                recurso.asignatura,
                recurso.contenido,
                recurso.detalle,
                recurso.ejemplo
            ].join(" ").toLocaleLowerCase();

            const coincideTexto = textoCompleto.includes(texto);
            const coincideCategoria =
                categoriaSeleccionada === "todos" ||
                recurso.categoria === categoriaSeleccionada;
            const coincideAsignatura =
                asignaturaSeleccionada === "todas" ||
                recurso.asignatura === asignaturaSeleccionada;

            return coincideTexto && coincideCategoria && coincideAsignatura;
        });

        contador.textContent =
            resultados.length +
            (resultados.length === 1
                ? " recurso encontrado"
                : " recursos encontrados");

        if (resultados.length === 0) {
            lista.innerHTML = `
                <p class="sin-recursos">
                    No encontramos recursos con esos filtros.
                    Prueba otra búsqueda.
                </p>
            `;
            return;
        }

        lista.innerHTML = resultados.map((recurso, indice) => `
            <article class="recurso-estudio">
                <span class="etiqueta-recurso">
                    ${recurso.categoria === "formula"
                ? "Fórmula"
                : recurso.categoria === "concepto"
                    ? "Concepto clave"
                    : "Lectura interesante"}
                </span>

                <h3>${recurso.titulo}</h3>
                <p class="asignatura-recurso">${recurso.asignatura}</p>

                <p class="contenido-recurso">${recurso.contenido}</p>
                <p>${recurso.detalle}</p>

                <button
                    type="button"
                    class="boton secundario"
                    data-ejemplo="${indice}"
                >
                    Ver ejemplo
                </button>

                <div class="ejemplo-recurso" hidden>
                    <p><strong>Ejemplo:</strong></p>
                    <p></p>
                </div>
            </article>
        `).join("");

        lista.querySelectorAll("[data-ejemplo]").forEach(boton => {
            boton.addEventListener("click", () => {
                const recurso = resultados[Number(boton.dataset.ejemplo)];
                const contenedor = boton.nextElementSibling;
                const parrafo = contenedor.querySelectorAll("p")[1];
                const mostrar = contenedor.hidden;

                parrafo.textContent = recurso.ejemplo;
                contenedor.hidden = !mostrar;
                boton.textContent = mostrar ? "Ocultar ejemplo" : "Ver ejemplo";
            });
        });
    }

    buscador.addEventListener("input", mostrarRecursos);
    filtro.addEventListener("change", mostrarRecursos);
    asignatura.addEventListener("change", mostrarRecursos);

    mostrarRecursos();
}
const botonAbrirBiblioteca = document.getElementById("abrirBiblioteca");

if (botonAbrirBiblioteca) {
    botonAbrirBiblioteca.addEventListener("click", () => {
        mostrarBibliotecaRecursos();
    });
}
function mostrarConcentracion() {
    const clavePomodoro = "studyBoostPomodoro";

    let datos = null;

    try {
        datos = JSON.parse(localStorage.getItem(clavePomodoro));
    } catch (error) {
        datos = null;
    }

    const minutosGuardados = Number(datos?.minutosElegidos);
    const minutosIniciales =
        Number.isFinite(minutosGuardados) &&
            minutosGuardados >= 1 &&
            minutosGuardados <= 180
            ? Math.floor(minutosGuardados)
            : 25;

    abrirModal("Concentración", `
        <div class="pomodoro">
            <p class="pomodoro-descripcion">
                Organiza tu tiempo y concéntrate en una tarea a la vez.
            </p>

            <label for="minutosPomodoro">Tiempo de estudio (minutos)</label>
            <input
                id="minutosPomodoro"
                type="number"
                min="1"
                max="180"
                value="${minutosIniciales}"
            >

            <div id="relojPomodoro" class="reloj-pomodoro"></div>

            <p id="estadoPomodoro" aria-live="polite">
                Listo para comenzar
            </p>

            <div class="controles-pomodoro">
                <button type="button" id="iniciarPomodoro" class="boton">
                    ▶ Iniciar
                </button>
                <button type="button" id="pausarPomodoro" class="boton">
                    ⏸ Pausar
                </button>
                <button type="button" id="reiniciarPomodoro" class="boton">
                    ↻ Reiniciar
                </button>
            </div>

            <div class="consejos-estudio">
                <h3>📚 Consejos para estudiar mejor</h3>

                <article>
                    <h4>1. Define una meta concreta</h4>
                    <p>En lugar de decir «estudiar matemáticas», proponte resolver cinco ejercicios o comprender un concepto.</p>
                </article>

                <article>
                    <h4>2. Aleja las distracciones</h4>
                    <p>Silencia las notificaciones y deja abiertas únicamente las herramientas que necesitas.</p>
                </article>

                <article>
                    <h4>3. Recuerda sin mirar</h4>
                    <p>Después de estudiar, cierra los apuntes e intenta explicar lo aprendido con tus propias palabras.</p>
                </article>

                <article>
                    <h4>4. Haz pausas</h4>
                    <p>Cuando termines tu sesión, levántate, estírate y descansa un poco antes de continuar.</p>
                </article>

                <article>
                    <h4>5. Prioriza comprender</h4>
                    <p>No te limites a memorizar. Pregúntate por qué funciona una idea y cómo podrías aplicarla.</p>
                </article>
            </div>
        </div>
    `);

    const campoMinutos = document.getElementById("minutosPomodoro");
    const reloj = document.getElementById("relojPomodoro");
    const estado = document.getElementById("estadoPomodoro");
    const iniciar = document.getElementById("iniciarPomodoro");
    const pausar = document.getElementById("pausarPomodoro");
    const reiniciar = document.getElementById("reiniciarPomodoro");

    // Compartimos un único intervalo entre aperturas de la ventana.
    if (!window.studyBoostPomodoroControl) {
        window.studyBoostPomodoroControl = {
            intervalo: null
        };
    }

    const control = window.studyBoostPomodoroControl;

    let tiempoRestante = datos?.tiempoRestante ?? minutosIniciales * 60;
    let finalizado = datos?.finalizado ?? false;
    let enMarcha = datos?.enMarcha ?? false;
    let finEn = datos?.finEn ?? 0;

    function guardarPomodoro() {
        localStorage.setItem(clavePomodoro, JSON.stringify({
            tiempoRestante,
            finalizado,
            finEn,
            enMarcha,
            minutosElegidos: Number(campoMinutos.value)
        }));
    }

    function mostrarTiempo() {
        const minutos = Math.floor(tiempoRestante / 60);
        const segundos = tiempoRestante % 60;

        reloj.textContent =
            String(minutos).padStart(2, "0") + ":" +
            String(segundos).padStart(2, "0");
    }

    function detenerReloj() {
        if (control.intervalo !== null) {
            clearInterval(control.intervalo);
            control.intervalo = null;
        }
    }

    function reproducirAlarma() {
        try {
            const contextoAudio = new (
                window.AudioContext || window.webkitAudioContext
            )();

            contextoAudio.resume().then(() => {
                const oscilador = contextoAudio.createOscillator();
                const volumen = contextoAudio.createGain();

                oscilador.connect(volumen);
                volumen.connect(contextoAudio.destination);

                oscilador.type = "sine";
                oscilador.frequency.value = 880;
                volumen.gain.value = 0.2;

                oscilador.start();

                setTimeout(() => {
                    oscilador.stop();
                    contextoAudio.close();
                }, 1200);
            }).catch(() => {
                estado.textContent =
                    "¡Tiempo terminado! 🎉 Revisa el volumen de tu dispositivo.";
            });
        } catch (error) {
            estado.textContent =
                "¡Tiempo terminado! 🎉 Tu navegador no permitió reproducir el sonido.";
        }
    }

    function terminarSesion() {
        detenerReloj();

        tiempoRestante = 0;
        finalizado = true;
        enMarcha = false;
        finEn = 0;

        guardarPomodoro();
        mostrarTiempo();

        estado.textContent =
            "¡Sesión terminada! 🎉 Es hora de descansar.";

        reproducirAlarma();
    }

    function actualizarReloj() {
        tiempoRestante = Math.max(
            0,
            Math.ceil((finEn - Date.now()) / 1000)
        );

        mostrarTiempo();

        if (tiempoRestante <= 0) {
            terminarSesion();
        } else {
            guardarPomodoro();
        }
    }

    function iniciarSesion() {
        if (control.intervalo !== null || finalizado) return;

        if (tiempoRestante <= 0) {
            estado.textContent =
                "Pulsa Reiniciar para comenzar otra sesión.";
            return;
        }

        finEn = Date.now() + tiempoRestante * 1000;
        enMarcha = true;

        guardarPomodoro();

        estado.textContent = "¡Concéntrate! Tu sesión está en marcha.";

        control.intervalo = setInterval(actualizarReloj, 250);
    }

    function pausarSesion() {
        if (control.intervalo === null) return;

        tiempoRestante = Math.max(
            0,
            Math.ceil((finEn - Date.now()) / 1000)
        );

        detenerReloj();

        enMarcha = false;
        finEn = 0;

        guardarPomodoro();
        mostrarTiempo();

        estado.textContent = "Sesión pausada.";
    }

    function reiniciarSesion() {
        detenerReloj();

        let minutos = Number(campoMinutos.value);

        if (!Number.isFinite(minutos) || minutos < 1) {
            minutos = 25;
        }

        minutos = Math.min(180, Math.floor(minutos));
        campoMinutos.value = minutos;

        tiempoRestante = minutos * 60;
        finalizado = false;
        enMarcha = false;
        finEn = 0;

        guardarPomodoro();
        mostrarTiempo();

        estado.textContent = "Listo para comenzar";
    }

    iniciar.addEventListener("click", iniciarSesion);
    pausar.addEventListener("click", pausarSesion);
    reiniciar.addEventListener("click", reiniciarSesion);

    campoMinutos.addEventListener("change", reiniciarSesion);

    // Si ya había un temporizador, no dejamos intervalos anteriores activos.
    detenerReloj();

    if (enMarcha) {
        tiempoRestante = Math.max(
            0,
            Math.ceil((finEn - Date.now()) / 1000)
        );

        if (tiempoRestante <= 0) {
            tiempoRestante = 0;
            finalizado = true;
            enMarcha = false;
            finEn = 0;

            guardarPomodoro();

            estado.textContent =
                "¡Tu sesión terminó mientras no estabas aquí! 🎉 Es hora de descansar.";
        } else {
            estado.textContent =
                "Tu sesión sigue en marcha. ¡A concentrarse!";

            control.intervalo = setInterval(actualizarReloj, 250);
        }
    } else if (finalizado) {
        tiempoRestante = 0;
        estado.textContent =
            "¡Sesión terminada! 🎉 Es hora de descansar.";
    } else {
        estado.textContent = "Sesión pausada o lista para comenzar.";
    }

    mostrarTiempo();
}
/* ===== SISTEMA DE RACHA DE ESTUDIO ===== */

function actualizarRachaEstudio() {
    const elementoDias = document.getElementById("diasRacha");
    const elementoMensaje = document.getElementById("mensajeRacha");
    const elementoIcono = document.getElementById("iconoRacha");
    const elementoSemana = document.getElementById("rachaSemana");
    const tarjetaRacha = document.querySelector(".racha-estudio");

    if (
        !elementoDias ||
        !elementoMensaje ||
        !elementoIcono ||
        !elementoSemana ||
        !tarjetaRacha
    ) {
        return;
    }

    const clave = "studyBoostRacha";

    function obtenerFecha(fecha) {
        const anio = fecha.getFullYear();
        const mes = String(fecha.getMonth() + 1).padStart(2, "0");
        const dia = String(fecha.getDate()).padStart(2, "0");

        return `${anio}-${mes}-${dia}`;
    }

    function diferenciaEnDias(fechaInicial, fechaFinal) {
        const [anio1, mes1, dia1] = fechaInicial.split("-").map(Number);
        const [anio2, mes2, dia2] = fechaFinal.split("-").map(Number);

        const inicio = Date.UTC(anio1, mes1 - 1, dia1);
        const final = Date.UTC(anio2, mes2 - 1, dia2);

        return Math.round((final - inicio) / 86400000);
    }

    const hoy = new Date();
    const fechaHoy = obtenerFecha(hoy);

    let datos;

    try {
        datos = JSON.parse(localStorage.getItem(clave) || "{}");
    } catch (error) {
        datos = {};
    }

    let racha = Number(datos.racha) || 0;
    const ultimaFecha = datos.ultimaFecha || null;

    let fechasVisita = Array.isArray(datos.fechasVisita)
        ? datos.fechasVisita.filter(fecha =>
            typeof fecha === "string" &&
            /^\d{4}-\d{2}-\d{2}$/.test(fecha)
        )
        : [];

    // Registrar como máximo una visita por día.
    if (ultimaFecha !== fechaHoy) {
        if (!ultimaFecha) {
            racha = 1;
        } else {
            const diferencia = diferenciaEnDias(ultimaFecha, fechaHoy);

            if (diferencia === 1) {
                racha += 1;
            } else {
                racha = 1;
            }
        }
    }

    if (!fechasVisita.includes(fechaHoy)) {
        fechasVisita.push(fechaHoy);
    }

    // Conservamos las visitas recientes.
    fechasVisita = [...new Set(fechasVisita)]
        .filter(fecha => diferenciaEnDias(fecha, fechaHoy) >= 0)
        .filter(fecha => diferenciaEnDias(fecha, fechaHoy) <= 400)
        .sort();

    localStorage.setItem(
        clave,
        JSON.stringify({
            racha: racha,
            ultimaFecha: fechaHoy,
            fechasVisita: fechasVisita
        })
    );

    elementoDias.textContent = racha;

    if (racha >= 7) {
        elementoMensaje.textContent =
            "¡Increíble! Llevas una semana o más de racha.";
        tarjetaRacha.classList.add("racha-activa");
    } else if (racha > 1) {
        elementoMensaje.textContent =
            "¡Buen trabajo! Sigue construyendo tu hábito.";
        tarjetaRacha.classList.remove("racha-activa");
    } else {
        elementoMensaje.textContent =
            "¡Hoy comienza tu racha de estudio!";
        tarjetaRacha.classList.remove("racha-activa");
    }

    // Dibujar los días de la semana, de lunes a domingo.
    const diaHoy = (hoy.getDay() + 6) % 7;
    const dias = elementoSemana.querySelectorAll(".dia-racha");

    dias.forEach((dia, indice) => {
        const simbolo = dia.querySelector("span:last-child");

        // Calcular la fecha real de cada día de esta semana.
        const fechaDia = new Date(
            hoy.getFullYear(),
            hoy.getMonth(),
            hoy.getDate() + indice - diaHoy
        );

        const fechaTexto = obtenerFecha(fechaDia);
        const visitado = fechasVisita.includes(fechaTexto);

        dia.classList.remove("completado", "hoy");

        if (visitado) {
            dia.classList.add("completado");
            simbolo.textContent = "✓";
        } else {
            simbolo.textContent = "○";
        }

        if (indice === diaHoy) {
            dia.classList.add("hoy");
        }
    });
}

// Ejecutar la racha cuando el HTML esté listo.
if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        actualizarRachaEstudio
    );
} else {
    actualizarRachaEstudio();
}
function mostrarLogros() {
    const contenido = document.getElementById("contenidoModal");

    if (!contenido) return;

    // Leer las tareas que ya están guardadas en StudyBoost.
    let tareasGuardadas = [];

    try {
        tareasGuardadas = JSON.parse(
            localStorage.getItem("studyboost-tareas") || "[]"
        );
    } catch (error) {
        tareasGuardadas = [];
    }

    // Leer los cuestionarios ya registrados.
    let resultadosQuiz = [];

    try {
        resultadosQuiz = JSON.parse(
            localStorage.getItem("studyBoost-resultados") || "[]"
        );
    } catch (error) {
        resultadosQuiz = [];
    }

    const tareasCompletadas = Array.isArray(tareasGuardadas)
        ? tareasGuardadas.filter(tarea => tarea.hecha).length
        : 0;

    const cuestionariosCompletados = Array.isArray(resultadosQuiz)
        ? resultadosQuiz.length
        : 0;

    const xp = progresoEstudio.xp;

    const logros = [
        {
            id: "primera_tarea",
            icono: "🌱",
            nombre: "Primer paso",
            descripcion: "Completa tu primera tarea.",
            desbloqueado: tareasCompletadas >= 1
        },
        {
            id: "primer_cuestionario",
            icono: "🧠",
            nombre: "Mente activa",
            descripcion: "Completa tu primer cuestionario.",
            desbloqueado: cuestionariosCompletados >= 1
        },
        {
            id: "experiencia_100",
            icono: "⚡",
            nombre: "Energía en marcha",
            descripcion: "Alcanza 100 XP.",
            desbloqueado: xp >= 100
        },
        {
            id: "experiencia_500",
            icono: "💎",
            nombre: "Cazador de XP",
            descripcion: "Alcanza 500 XP.",
            desbloqueado: xp >= 500
        }
    ];

    const desbloqueados = logros.filter(
        logro => logro.desbloqueado
    ).length;

    const porcentaje = Math.round(
        (desbloqueados / logros.length) * 100
    );

    contenido.innerHTML = `
        <section class="galeria-logros">
            <div class="logros-resumen">
                <div>
                    <h3>🏆 Mi colección</h3>
                    <p>Los hitos que vas conquistando.</p>
                </div>
                <span class="logros-contador">
                    ${desbloqueados} / ${logros.length}
                </span>
            </div>

            <div class="logros-barra">
                <div
                    class="logros-barra-valor"
                    style="width: ${porcentaje}%">
                </div>
            </div>

            <p class="texto-progreso-logros">
                Has desbloqueado el ${porcentaje}% de tus logros.
            </p>

            <div class="logros-grid">
                ${logros.map(logro => `
                    <article
                        class="tarjeta-logro ${logro.desbloqueado ? "desbloqueado" : "bloqueado"}"
                        data-logro="${logro.id}">

                        <div class="logro-icono">
                            ${logro.icono}
                        </div>

                        <h4>${logro.nombre}</h4>
                        <p>${logro.descripcion}</p>

                        <span class="logro-estado">
                            ${logro.desbloqueado
            ? "🏆 Desbloqueado"
            : "🔒 Por desbloquear"}
                        </span>
                    </article>
                `).join("")}
            </div>
        </section>
    `;
}
function mostrarCursosMatematicas() {
    abrirModal("Aprender matemáticas", `
        <div class="catalogo-matematicas">
            <p>
                Aprende paso a paso, desde los fundamentos
                hasta los temas más avanzados.
            </p>

            <div class="cursos-matematicas">

                <button type="button" class="curso-matematicas" data-curso="aritmetica">
                    <span>🔢</span>
                    <strong>Aritmética y fundamentos</strong>
                    <small>Fracciones, potencias, raíces y porcentajes.</small>
                </button>

                <button type="button" class="curso-matematicas" data-curso="algebra">
                    <span>✖️</span>
                    <strong>Álgebra</strong>
                    <small>Expresiones, factorización y ecuaciones.</small>
                </button>

                <button type="button" class="curso-matematicas" data-curso="funciones">

                    <span>📈</span>
                    <strong>Funciones y gráficas</strong>
                    <small>Variables, rectas y funciones cuadráticas.</small>
                </button>

                <button type="button" class="curso-matematicas" data-curso="geometria">
                    <span>📐</span>
                    <strong>Geometría y trigonometría</strong>
                    <small>Áreas, semejanza, Pitágoras y razones trigonométricas.</small>
                </button>

                <button type="button" class="curso-matematicas" data-curso="estadistica">
                    <span>📊</span>
                    <strong>Estadística y probabilidad</strong>
                    <small>Promedios, dispersión y eventos aleatorios.</small>
                </button>

                <button type="button" class="curso-matematicas" data-curso="calculo">
                    <span>♾️</span>
                    <strong>Introducción al cálculo</strong>
                    <small>Límites, continuidad y derivadas.</small>
                </button>

            </div>
        </div>
    `);
    contenidoModal.querySelectorAll("[data-curso]").forEach(boton => {
        boton.addEventListener("click", () => {
            mostrarTemarioMatematicas(boton.dataset.curso);
        });
    });
}
const cursosMatematicas = {
    aritmetica: {
        titulo: "Aritmética y fundamentos",
        lecciones: [
            "Números y operaciones",
            "Fracciones",
            "Potencias y raíces",
            "Razones, proporciones y porcentajes"
        ]
    },
    algebra: {
        titulo: "Álgebra",
        lecciones: [
            "Expresiones algebraicas",
            "Productos notables",
            "Factorización",
            "Ecuaciones e inecuaciones"
        ]
    },
    funciones: {
        titulo: "Funciones y gráficas",
        lecciones: [
            "Variables y plano cartesiano",
            "Concepto de función",
            "Función lineal",
            "Función cuadrática"
        ]
    },
    geometria: {
        titulo: "Geometría y trigonometría",
        lecciones: [
            "Ángulos y figuras geométricas",
            "Perímetros y áreas",
            "Teorema de Pitágoras",
            "Razones trigonométricas"
        ]
    },
    estadistica: {
        titulo: "Estadística y probabilidad",
        lecciones: [
            "Tablas y gráficos estadísticos",
            "Media, mediana y moda",
            "Rango y dispersión",
            "Probabilidad básica"
        ]
    },
    calculo: {
        titulo: "Introducción al cálculo",
        lecciones: [
            "Concepto de función y variación",
            "Límites",
            "Continuidad",
            "Introducción a las derivadas"
        ]
    }
};

function mostrarTemarioMatematicas(clave) {
    const curso = cursosMatematicas[clave];

    if (!curso) return;

    contenidoModal.innerHTML = `
        <button type="button" class="boton volver-cursos">
            ← Todos los cursos
        </button>

        <h3>${curso.titulo}</h3>
        <p>Elige una lección para comenzar a aprender.</p>

        <div class="lecciones-matematicas">
            ${curso.lecciones.map((leccion, indice) => `
    <button
        type="button"
        class="leccion-matematicas"
        data-curso="${clave}"
        data-leccion="${indice}"
    >
        <span>Lección ${indice + 1}</span>
        <strong>${leccion}</strong>
        <span>Ver lección →</span>
    </button>
`).join("")}
        </div>
    `;

    contenidoModal.querySelector(".volver-cursos")
        .addEventListener("click", mostrarCursosMatematicas);
        contenidoModal.querySelectorAll("[data-leccion]").forEach(boton => {
        boton.addEventListener("click", () => {
            mostrarLeccionMatematicas(
                boton.dataset.curso,
                Number(boton.dataset.leccion)
            );
        });
    });
}
function mostrarLeccionMatematicas(clave, indice) {
    const curso = cursosMatematicas[clave];

    if (!curso || !curso.lecciones[indice]) return;

    const lecciones = {
        aritmetica: [
            {
                titulo: "Números y operaciones",
                concepto: "La aritmética estudia las operaciones con números. El orden de las operaciones es: paréntesis, potencias y raíces, multiplicaciones y divisiones, y finalmente sumas y restas.",
                ejemplo: "En 3 + 2 × 5, primero multiplicamos: 2 × 5 = 10. Después sumamos: 3 + 10 = 13.",
                pregunta: "¿Cuánto vale 8 + 3 × 4?",
                opciones: ["44", "20", "32", "24"],
                correcta: 1,
                explicacion: "Primero multiplicamos 3 × 4 = 12 y luego sumamos 8 + 12 = 20."
            }
        ]
    };

    const leccion = lecciones[clave]?.[indice];

    if (!leccion) {
        abrirModal(curso.lecciones[indice], `
            <button type="button" class="boton volver-temario">
                ← Volver al temario
            </button>
            <h3>${curso.lecciones[indice]}</h3>
            <p>Esta lección estará disponible próximamente.</p>
        `);

        contenidoModal.querySelector(".volver-temario")
            .addEventListener("click", () => mostrarTemarioMatematicas(clave));

        return;
    }

    let respondida = false;

    abrirModal(leccion.titulo, `
        <button type="button" class="boton volver-temario">
            ← Volver al temario
        </button>

        <h3>📘 ${leccion.titulo}</h3>

        <h4>🧠 Concepto clave</h4>
        <p>${leccion.concepto}</p>

        <h4>✏️ Ejemplo resuelto</h4>
        <p>${leccion.ejemplo}</p>

        <div class="ejercicio-apuntes">
            <h4>🎯 Comprueba lo aprendido</h4>
            <p>${leccion.pregunta}</p>

            <div class="opciones-apuntes">
                ${leccion.opciones.map((opcion, i) => `
                    <button type="button"
                        class="opcion-apuntes"
                        data-respuesta="${i}">
                        ${opcion}
                    </button>
                `).join("")}
            </div>

            <p class="resultado-apuntes" aria-live="polite"></p>

            <button type="button" class="boton volver-temario">
                Volver al temario
            </button>
        </div>
    `);

    contenidoModal.querySelectorAll(".volver-temario")
        .forEach(boton => {
            boton.addEventListener("click", () => mostrarTemarioMatematicas(clave));
        });

    contenidoModal.querySelectorAll("[data-respuesta]")
        .forEach(boton => {
            boton.addEventListener("click", () => {
                if (respondida) return;
                respondida = true;

                const elegida = Number(boton.dataset.respuesta);
                const resultado = contenidoModal.querySelector(".resultado-apuntes");

                contenidoModal.querySelectorAll("[data-respuesta]")
                    .forEach(opcion => opcion.disabled = true);

                if (elegida === leccion.correcta) {
                    resultado.textContent = "¡Correcto! 🎉 " + leccion.explicacion;
                    resultado.className = "resultado-apuntes respuesta-correcta";
                } else {
                    resultado.textContent =
                        "La respuesta correcta es " +
                        leccion.opciones[leccion.correcta] +
                        ". " + leccion.explicacion;
                    resultado.className = "resultado-apuntes respuesta-incorrecta";
                }
            });
        });
}