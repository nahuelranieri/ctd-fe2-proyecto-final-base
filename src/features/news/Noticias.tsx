import { useCallback, useEffect, useState } from "react";
import { obtenerNoticias } from "./fakeRest";
import { ContenedorNoticias, ListaNoticias, TituloNoticias } from "./styled";
import { INoticiasNormalizadas } from "./contracts";
import { toFront } from "./normalize";
import ModalSubscripcion from "./ModalSub";
import ModalPremium from "./ModalPremium";
import CardNoticias from "./CardNoticias";

const Noticias = () => {
  const [noticias, setNoticias] = useState<INoticiasNormalizadas[]>([]);
  const [modal, setModal] = useState<INoticiasNormalizadas | null>(null);

  const obtenerInformacion = useCallback(async () => {
    const respuesta = await obtenerNoticias();
    const noticiasNormalizadas = toFront(respuesta);
    setNoticias(noticiasNormalizadas);
  }, []);

  useEffect(() => {
    obtenerInformacion();
  }, [obtenerInformacion]);

  const getModal = useCallback(() => {
    if (!modal) {
      return undefined;
    }
    if (modal?.esPremium) {
      return (
        <ModalSubscripcion
          onClose={() => setModal(null)}
          onSubscription={() =>
            setTimeout(() => {
              alert("Suscripto!");
              setModal(null);
            }, 1000)
          }
        />
      );
    }
    return <ModalPremium {...modal} onClose={() => setModal(null)} />;
  }, [modal]);

  return (
    <ContenedorNoticias>
      <TituloNoticias>Noticias de los Simpsons</TituloNoticias>
      <ListaNoticias>
        <CardNoticias noticias={noticias} handleVerMasClick={setModal} />
        <>{getModal()}</>
      </ListaNoticias>
    </ContenedorNoticias>
  );
};

export default Noticias;


// Aplicaque el primer principio SOLID, single responsability para liberar al componente "Noticias" de ciertas responsabilidades que no le eran propias.
// En principio extraje las funciones para normalizar las noticias que recibe: capitalizeWords, calculateMinutes y noticias.mapper.
// Por último extraje 3 componentes que pueden ser reutilizados y da más legibilidad al código: ModalPremium, ModalSubscripcion y CardNoticias.
//Se movio la funcion obtenerInformacion fuera del effecto y se agrego como dependencia.
//Esto asegurará que la función se cree solo una vez y no en cada renderizado 
