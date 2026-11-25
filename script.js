
const tablaPuntos = {
  p1: {
    SI: { preocupacion: 0, desconocimiento: 0 },
    NO: { preocupacion: 0, desconocimiento: 3 }
  },
  p2: {
    SI: { preocupacion: 0, desconocimiento: 0 },
    DUDOSO: { preocupacion: 1, desconocimiento: 1 },
    NO: { preocupacion: 0, desconocimiento: 2 }
  },
  p3: {
    SI: { preocupacion: 1, desconocimiento: 0 },
    NO: { preocupacion: 0, desconocimiento: 2 }
  },
  p4: {
    SI: { preocupacion: 0, desconocimiento: 0 },
    NO: { preocupacion: 1, desconocimiento: 3 }
  },
  p5: {
    SI: { preocupacion: 2, desconocimiento: 1 },
    NO: { preocupacion: 0, desconocimiento: 0 }
  },
  p6: {
    VIGILANCIA: { preocupacion: 2, desconocimiento: 0 },
    ESTAFAS: { preocupacion: 3, desconocimiento: 0 },
    BANCOS: { preocupacion: 3, desconocimiento: 0 }
  },
  p7: {
    MUY_CLARA: { preocupacion: 0, desconocimiento: 0 },
    ALGO_CLARA: { preocupacion: 0, desconocimiento: 1 },
    POCA_CLARA: { preocupacion: 1, desconocimiento: 2 },
    NADA_CLARA: { preocupacion: 2, desconocimiento: 3 }
  },
  p8: {
    MUCHO: { preocupacion: 0, desconocimiento: 0 },
    POCO: { preocupacion: 2, desconocimiento: 0 },
    NADA: { preocupacion: 3, desconocimiento: 0 }
  },
  p9: {
    SI: { preocupacion: 3, desconocimiento: 0 },
    NO: { preocupacion: 0, desconocimiento: 0 }
  },
  p10: {
    SI: { preocupacion: 0, desconocimiento: 0 },
    NO: { preocupacion: 1, desconocimiento: 0 }
  },
  p11: {
    SI: { preocupacion: 3, desconocimiento: 0 },
    NO: { preocupacion: 0, desconocimiento: 0 }
  },
  p12: {
    SI: { preocupacion: 3, desconocimiento: 0 },
    NO: { preocupacion: 0, desconocimiento: 0 }
  },
  p13: {
    FRECUENTE: { preocupacion: 2, desconocimiento: 0 },
    RARAMENTE: { preocupacion: 1, desconocimiento: 0 },
    NO: { preocupacion: 0, desconocimiento: 0 }
  },
  p14: {
    SI: { preocupacion: 0, desconocimiento: 0 },
    MAS_O_MENOS: { preocupacion: 0, desconocimiento: 1 },
    NO: { preocupacion: 1, desconocimiento: 2 }
  }
};

const MAX_PREOCUPACION = 25;
const MAX_DESCONOCIMIENTO = 16;

function clasificar(puntos, maximo) {
  const ratio = puntos / maximo;
  if (ratio < 0.34) return "Bajo";
  if (ratio < 0.67) return "Moderado";
  return "Alto";
}

const form = document.getElementById("encuestaForm");
const resultadoDiv = document.getElementById("resultado");

form.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const datos = new FormData(form);
  let preocupacion = 0;
  let desconocimiento = 0;

  for (const [pregunta, respuesta] of datos.entries()) {
    const peso = tablaPuntos[pregunta]?.[respuesta];
    if (peso) {
      preocupacion += peso.preocupacion;
      desconocimiento += peso.desconocimiento;
    }
  }

  const nivelPreoc = clasificar(preocupacion, MAX_PREOCUPACION);
  const nivelDesc = clasificar(desconocimiento, MAX_DESCONOCIMIENTO);

  const pctPreoc = Math.round((preocupacion / MAX_PREOCUPACION) * 100);
  const pctDesc = Math.round((desconocimiento / MAX_DESCONOCIMIENTO) * 100);

  let perfil = "";
  if (nivelPreoc === "Alto" && nivelDesc === "Alto") {
    perfil = "Alta preocupación y alto desconocimiento: el usuario siente mucha inquietud y además necesita información clara y medidas prácticas de protección.";
  } else if (nivelPreoc === "Alto" && nivelDesc !== "Alto") {
    perfil = "Alta preocupación con menor desconocimiento: el usuario conoce riesgos o el tema, pero muestra fuerte desconfianza o inquietud por sus datos/cuentas.";
  } else if (nivelPreoc !== "Alto" && nivelDesc === "Alto") {
    perfil = "Mayor desconocimiento que preocupación: el usuario no expresa tanta alarma, pero tiene vacíos importantes sobre seguridad digital, phishing o qué hacer ante un robo de datos.";
  } else {
    perfil = "Niveles bajos o moderados: el usuario reporta menor inquietud y mayor familiaridad o claridad frente a los temas consultados.";
  }

  const avisoBancario =
    datos.get("p12") === "SI"
      ? `<p class="alerta">Nota: Se marcó haber notado movimientos fuera de lo normal en cuentas bancarias. Se recomienda revisar estados de cuenta y contactar al banco por vías oficiales.</p>`
      : "";

  resultadoDiv.style.display = "block";
  resultadoDiv.innerHTML = `
    <h2>Resultados de la evaluación</h2>
    <div class="tarjetas">
      <div class="tarjeta">
        <h3>Preocupación: ${nivelPreoc}</h3>
        <p><strong>Puntaje:</strong> ${preocupacion} / ${MAX_PREOCUPACION} (${pctPreoc}%)</p>
      </div>
      <div class="tarjeta">
        <h3>Desconocimiento: ${nivelDesc}</h3>
        <p><strong>Puntaje:</strong> ${desconocimiento} / ${MAX_DESCONOCIMIENTO} (${pctDesc}%)</p>
      </div>
    </div>
    <p><strong>Diagnóstico del perfil:</strong> ${perfil}</p>
    ${avisoBancario}
  `;

  resultadoDiv.scrollIntoView({ behavior: "smooth" });
});