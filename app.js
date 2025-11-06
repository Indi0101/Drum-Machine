
const arr_botones = [
  { id: "0-0", letra: "Q", sonido: "Heater-1", url:"audios_drum/Heater-1.mp3"},
  { id: "0-1", letra: "W", sonido: "Heater-2", url:"audios_drum/Heater-2.mp3"},
  { id: "0-2", letra: "E", sonido: "Heater-3", url:"audios_drum/Heater-3.mp3" },
  { id: "1-0", letra: "A", sonido: "Heater-4", url:"audios_drum/Heater-4.mp3" },
  { id: "1-1", letra: "S", sonido: "Clap", url:"audios_drum/clap.mp3" },
  { id: "1-2", letra: "D", sonido: "Platillos", url:"audios_drum/platillos.mp3" },
  { id: "2-0", letra: "Z", sonido: "Kick_n_Hat", url:"audios_drum/kick_n_Hat.mp3" },
  { id: "2-1", letra: "X", sonido: "Kick", url:"audios_drum/Kick.mp3" },
  { id: "2-2", letra: "C", sonido: "Closed-HH", url:"audios_drum/closed-HH.mp3" }
];

const rows = 3;
const cols = 3;
const { useState } = React;

  function DrumMachine() {
    const [currentBank, setCurrentBank] = useState('OFF');
    const [volume, setVolume] = React.useState(0.5);
    const isOn = currentBank === 'ON';
  
  const grid = Array.from({ length: rows }, (_, rowIndex) =>
    Array.from({ length: cols }, (_, colIndex) => ({
      id: `${rowIndex}-${colIndex}`,
      label: `boton ${rowIndex + 1}-${colIndex + 1}`
    }))
  );

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if(!isOn) return; //si el banco esta en OFF, no hace nada
      const tecla =arr_botones.find((btn)=> btn.letra.toLowerCase() === e.key.toLowerCase());//busca en arr_botones el objeto que tiene la letra igual a la tecla presionada
      
      if(tecla) play(tecla); //si encuentra la tecla, llama a la funcion play con el objeto tecla
    };
    document.addEventListener('keydown', handleKeyDown);///agrega el event listener para keydown
    return () => document.removeEventListener('keydown', handleKeyDown);///remueve el event listener al desmontar el componente
  }, [isOn]); //solo se vuelve a ejecutar si cambia isOn
  
  ///efecto para actualizar el volumen de los audios
  React.useEffect(() => {const audios =document.querySelectorAll("audio");
    audios.forEach((audio) => {audio.volume= volume;});
  }, [volume]); //actualiza el volumen de todos los audios cuando cambia el estado volume

  const play=(tecla)=>{
    const audio = document.getElementById(tecla.letra);///obtiene el elemento audio por su id (que es la letra)
    const btn =document.getElementById(tecla.sonido);///obtiene el boton por su id (que es el nombre del sonido)
     if(!isOn) return; //si el banco esta en OFF, no hace nada

    if(!audio || !btn) return; //si no encuentra nada, retorna null para no hacer nada
    
    audio.currentTime=0; //reinicia el audio al inicio
    audio.play(); //reproduce el audio

    const etiqueta =document.getElementById("etiqueta"); //obtiene el display por su id
    if(etiqueta){
      etiqueta.innerText = tecla.sonido; //muestra el nombre del sonido en el display
    }

     // efecto visual (reinicia si se presiona muy seguido)
     btn.classList.remove("flash");
       // forzar reflow para que la animación reinicie
     void btn.offsetWidth;
     btn.classList.add("flash");
      // quitar la clase luego de un momento
     setTimeout(() => btn.classList.remove("flash"), 150);
    
  }

return (
    <div id="contenedor">
      <div id="contenedor_matrisBTN">
        <div id="matrisBTN"  >
          {grid.flat().map((boton) => { ///flat() aplana el array de arrays en un array simple, boton es cada objeto {id, label}
            const tecla = arr_botones.find((arr) => arr.id === boton.id); //busca en arr_botones el objeto que tiene el mismo id que el boton actual
            if(!tecla) return null; //si no encuentra nada, retorna null para no renderizar nada

            return (
              <button key={boton.id} id={tecla.sonido} onClick={()=>play(tecla)} className="drum-pad"> 
                {tecla.letra}  
                <audio id={tecla.letra} className="clip" src={tecla.url} ></audio>
              </button>
            );
          })}
        </div>
      </div>
      <div id="contenedor_controles">
        <div id="etiqueta"></div>
        <div><input id="volumen" type="range" min="0" max="1" step="0.01" value={volume} onChange={(e)=> setVolume(Number(e.target.value))}/></div>
        <p id="por_volumen">{Math.round(volume*100)}%</p>
        <BankSwitch currentBank={currentBank} onBankChange={setCurrentBank} />
          <div id="on-off">{currentBank}</div>
      </div>
    </div>
  );
}
function BankSwitch({ currentBank, onBankChange }) {  // Componente para el interruptor de banco
  const toggleBank = () => {
    const newBank = currentBank === 'OFF' ? 'ON' : 'OFF'; 
    onBankChange(newBank);
  };

  return (
    <div id="selector" style={{
      justifyContent: currentBank === 'OFF' ? 'flex-start' : 'flex-end'
    }}>
      <div id="bank" onClick={toggleBank}></div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<DrumMachine />);