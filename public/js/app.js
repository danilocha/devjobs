import axios from "axios";
import Swal from "sweetalert2";
document.addEventListener("DOMContentLoaded", () => {
  const skills = document.querySelector(".lista-conocimientos");
  // limpiar las alertas
  let alertas = document.querySelector(".alertas");
  if (alertas) {
    limpiarAlertas();
  }

  if (skills) {
    skills.addEventListener("click", agregarSkills);
    // una vez que estamos en editar, llamar la funcion
    skillsSeleccionados();
  }
  const vacantesListado = document.querySelector(".panel-administracion");
  if (vacantesListado) {
    vacantesListado.addEventListener("click", accionesListado);
  }
});

const skills = new Set();
const agregarSkills = e => {
  if (e.target.tagName === "LI") {
    if (e.target.classList.contains("activo")) {
      // quitarlo del set y quitar la clase
      skills.delete(e.target.textContent);
      e.target.classList.remove("activo");
    } else {
      // agregarlo al set y agregar la clase
      skills.add(e.target.textContent);
      e.target.classList.add("activo");
    }
  }
  const skillsArray = [...skills];
  document.querySelector("#skills").value = skillsArray;
};

const skillsSeleccionados = () => {
  const seleccionadas = Array.from(
    document.querySelectorAll(".lista-conocimientos .activo")
  );

  seleccionadas.forEach(seleccionada => {
    skills.add(seleccionada.textContent);
  });

  // inyectarlo en el hidden
  const skillsArray = [...skills];
  document.querySelector("#skills").value = skillsArray;
};
const limpiarAlertas = () => {
  const alertas = document.querySelector(".alertas");
  const interval = setInterval(() => {
    if (alertas.children.length > 0) {
      alertas.removeChild(alertas.children[0]);
    } else if (alertas.children.length === 0) {
      alertas.parentElement.removeChild(alertas);
      clearInterval(interval);
    }
  }, 2000);
};
// Eliminar vacantes
const accionesListado = e => {
  e.preventDefault();

  if (e.target.dataset.eliminar) {
    // Eliminar por medio de axios

    Swal.fire({
      title: "Confirmar eliminacion",
      text: "una vez eliminada no se podra recuperar!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "si, eliminar!",
      cancelButtonText: "cancelar"
    }).then(result => {
      if (result.value) {
        // enviar la peticion con axios
        const url = `${location.origin}/vacantes/eliminar/${e.target.dataset.eliminar}`;
        // axios para eliminar el registro
        axios
          .delete(url, { params: { url } })
          .then(function(respuesta) {
            if (respuesta.status === 200) {
              Swal.fire("Borrado!", respuesta.data, "success");

              // TODO: Eliminar del DOM
              e.target.parentElement.parentElement.parentElement.removeChild(
                e.target.parentElement.parentElement
              );
            }
          })
          .catch(() => {
            Swal.fire({
              type: "error",
              title: "Hubo un error",
              text: "No se pudo Eliminar"
            });
          });
      }
    });
  } else if (e.target.tagName === "A") {
    window.location.href = e.target.href;
  }
};
