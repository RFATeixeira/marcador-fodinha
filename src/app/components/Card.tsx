import { useState } from "react";

export function Card({
  name,
  value,
  color,
  onClick,
  onLongPress,
  children, // Agora children está disponível
  className, // Agora className está disponível
}: {
  name: string;
  value: number;
  color: string;
  onClick: () => void;
  onLongPress: () => void;
  children?: React.ReactNode; // Tipagem para children
  className?: string; // Tipagem para className
}) {
  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null);

  const handleTouchStart = () => {
    // Inicia o temporizador para 2 segundos ao tocar no card
    const timer = setTimeout(() => {
      onLongPress(); // Chama a função de long press após 2 segundos
    }, 600);

    setPressTimer(timer);
  };

  const handleTouchEnd = () => {
    // Limpa o temporizador se o toque for liberado antes de 2 segundos
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

  const handleMouseDown = () => {
    // Inicia o temporizador para 2 segundos ao pressionar o card
    const timer = setTimeout(() => {
      onLongPress(); // Chama a função de long press após 2 segundos
    }, 600);

    setPressTimer(timer);
  };

  const handleMouseUp = () => {
    // Limpa o temporizador se o clique for liberado antes de 2 segundos
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

  const handleMouseLeave = () => {
    // Limpa o temporizador se o mouse sair do card
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

  return (
    <div
      className="p-4 rounded-lg h-30"
      style={{
        backgroundColor: color,
        userSelect: "none", // Impede a seleção de texto
        WebkitUserSelect: "none", // Para dispositivos iOS
        touchAction: "none", // Impede ações de toque (como seleção de texto) no mobile
      }}
      onClick={onClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className={`flex flex-col items-center justify-center truncate ${className}`} // Inclui className aqui
      >
        <h2 className="text-lg font-semibold text-black">{name}</h2>
        <div>{children}</div>
        {/* Renderiza o conteúdo de children aqui */}
      </div>
    </div>
  );
}
