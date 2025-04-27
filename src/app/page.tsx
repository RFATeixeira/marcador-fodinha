"use client";

import { useState, useEffect } from "react";
import { TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
// Supondo que você tenha um componente Card separado
import { Card } from "./components/Card"; // Ajuste o caminho se precisar

export default function Home() {
  const [cards, setCards] = useState<
    { name: string; value: number | string }[]
  >([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCardIndex, setEditingCardIndex] = useState<number | null>(null);
  const [editedName, setEditedName] = useState("");
  const [editedValue, setEditedValue] = useState<number | string>(0); // Alterado para permitir string
  const [selectedCardColor, setSelectedCardColor] = useState<string | null>(
    null
  ); // Estado para armazenar a cor do card selecionado

  // Lista de cores
  const colors = [
    "#F9A8D4", // pink
    "#A5B4FC", // blue
    "#6EE7B7", // green
    "#FCD34D", // yellow
    "#FDBA74", // orange
    "#C4B5FD", // purple
    "#F87171", // red
    "#34D399", // teal
    "#60A5FA", // light blue
  ];

  // Carregar os cards do localStorage ao abrir a página
  useEffect(() => {
    const savedCards = localStorage.getItem("cards");
    if (savedCards) {
      setCards(JSON.parse(savedCards));
    }
  }, []);

  // Salvar os cards no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem("cards", JSON.stringify(cards));
  }, [cards]);

  function addCard() {
    if (newName.trim() === "") return;
    setCards([...cards, { name: newName, value: 0 }]);
    setNewName("");
    setIsAddModalOpen(false);
  }

  // Função para incrementar o valor do card
  function incrementValue(index: number) {
    const newCards = [...cards];

    // Verifica se o valor do card já é "X"
    if (newCards[index].value === "X") {
      return; // Impede incrementar o card se já estiver "apagado"
    }

    // Incrementa o valor se for menor que 5
    if (
      typeof newCards[index].value === "number" &&
      newCards[index].value < 4
    ) {
      newCards[index].value += 1; // Incrementa o valor do card
    } else {
      newCards[index].value = "X"; // Altera para "X" quando chegar a 5
    }

    setCards(newCards);

    // Atualiza o valor no modal
    if (editingCardIndex === index) {
      setEditedValue(newCards[index].value);
    }
  }

  function decrementValue(index: number) {
    const newCards = [...cards];

    // Se o valor for "X", definimos como 5 para poder diminuir
    if (newCards[index].value === "X") {
      newCards[index].value = 4; // Se o valor for "X", volta para 4
    } else if (
      typeof newCards[index].value === "number" &&
      newCards[index].value > 0
    ) {
      newCards[index].value -= 1; // Decrementa o valor do card
    }

    setCards(newCards);

    // Atualiza o valor no modal
    if (editingCardIndex === index) {
      setEditedValue(newCards[index].value);
    }
  }

  function removeAllCards() {
    setCards([]);
    setIsConfirmModalOpen(false);
  }

  // Função para abrir o modal de edição
  function openEditModal(index: number) {
    setEditingCardIndex(index);
    setEditedName(cards[index].name);

    // Se o valor for "X", definimos o valor como 5 para poder diminuir
    setEditedValue(cards[index].value === "X" ? 5 : cards[index].value);
    setIsEditModalOpen(true);
  }

  // Função para salvar as alterações no card
  function saveEdits() {
    if (editingCardIndex === null) return;
    const newCards = [...cards];
    newCards[editingCardIndex] = {
      name: editedName,
      value: editedValue,
    };
    setCards(newCards);
    setIsEditModalOpen(false);
  }

  // Função para tratar clique no card (incremento de valor)
  function handleCardClick(index: number) {
    setSelectedCardColor(colors[index % colors.length]); // Armazena a cor do card selecionado
    incrementValue(index);
  }

  function darkenHexColor(color: string, percent: number) {
    // Remove o '#' da cor hexadecimal, se houver
    color = color.replace("#", "");

    // Converte os componentes hexadecimais de R, G e B em números
    let r = parseInt(color.substring(0, 2), 16);
    let g = parseInt(color.substring(2, 4), 16);
    let b = parseInt(color.substring(4, 6), 16);

    // Escurece a cor ajustando o valor de cada componente
    r = Math.max(0, Math.min(255, r * (1 - percent)));
    g = Math.max(0, Math.min(255, g * (1 - percent)));
    b = Math.max(0, Math.min(255, b * (1 - percent)));

    // Converte os valores de volta para hexadecimal e os junta
    const darkenedColor = `#${((1 << 24) | (r << 16) | (g << 8) | b)
      .toString(16)
      .slice(1)}`;

    return darkenedColor;
  }

  return (
    <div className="p-4">
      <main>
        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl">Marcador Fodinha</h1>
          <div className="flex justify-center items-center gap-5">
            {/* Botão de apagar */}
            <TrashIcon
              onClick={() => setIsConfirmModalOpen(true)}
              className="h-7 w-7 text-red-600 cursor-pointer"
            />
            {/* Botão de adicionar */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center justify-center rounded-full border-2 hover:bg-blue-50 transition-colors"
            >
              <PlusIcon className="h-6 w-6" />
            </button>
          </div>
        </header>

        {/* Grid de cards */}
        <div className="grid grid-cols-3 gap-4">
          {cards.map((card, index) => (
            <Card
              key={index}
              name={card.name}
              value={typeof card.value === "number" ? card.value : 0} // Verifica se card.value é um número, se não, passa 0
              color={colors[index % colors.length]} // Mantém a cor original
              onClick={() => handleCardClick(index)} // Agora sempre chama a função de clique
              onLongPress={() => openEditModal(index)} // Sempre abre o modal de edição
              className={`p-4 rounded-lg ${
                card.value === "X" ? "opacity-50" : "" // Aplica opacidade se valor for "X"
              }`}
            >
              {card.value === "X" ? (
                <div className="flex justify-center items-center">
                  <span className="text-2xl text-red-600">X</span>
                </div>
              ) : (
                <span className="text-2xl text-black">{card.value}</span>
              )}
            </Card>
          ))}
        </div>

        {/* Modal para adicionar novo card */}
        {isAddModalOpen && (
          <div className="fixed flex flex-col inset-0 backdrop-blur-xs items-center justify-center z-50 text-black gap-3 p-12">
            <div className="flex w-full justify-end">
              <button
                onClick={() => setIsAddModalOpen(false)} // Mudar para setIsAddModalOpen
                className="w-11 h-11 text-xl font-semibold bg-white rounded-xl hover:bg-gray-400 "
              >
                X
              </button>
            </div>
            <div className="p-6 w-full rounded-lg shadow-lg bg-yellow-400">
              <h2 className="text-xl mb-4 text-center">Novo jogador</h2>
              <input
                type="text"
                className="p-2 py-4 w-full rounded mb-4 bg-yellow-500 text-center focus:outline-0"
                placeholder="Nome do jogador"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <div className="flex justify-center gap-2">
                <button
                  onClick={addCard}
                  className="w-11 h-11 bg-white text-xl text-black font-semibold rounded-xl hover:bg-gray-400"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal para editar card */}
        {isEditModalOpen && editingCardIndex !== null && (
          <div className="fixed inset-0 backdrop-blur-xs flex items-center justify-center z-50 p-12">
            <div
              className="p-6 rounded-lg shadow-lg w-full"
              style={{
                backgroundColor: colors[editingCardIndex! % colors.length], // Usando a cor do card selecionado
              }}
            >
              <h2 className="text-xl mb-4 text-black">Editar Jogador</h2>
              <input
                type="text"
                className="p-4 w-full rounded mb-4"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                style={{
                  backgroundColor: darkenHexColor(
                    colors[editingCardIndex! % colors.length],
                    0.2
                  ),
                }}
              />
              <div className="flex flex-col items-center justify-center gap-4 mb-4">
                <span className="text-2xl text-black font-semibold">
                  {editedValue === "X" ? "X" : editedValue}{" "}
                  {/* Exibe o valor ou "X" */}
                </span>
                <div className="w-full flex justify-between gap-2">
                  <button
                    onClick={() => decrementValue(editingCardIndex)}
                    className="px-4 py-2 text-black text-2xl w-full rounded-2xl"
                    style={{
                      backgroundColor: darkenHexColor(
                        colors[editingCardIndex! % colors.length],
                        0.2
                      ),
                    }}
                  >
                    -
                  </button>

                  <button
                    onClick={() => incrementValue(editingCardIndex)}
                    className="px-4 py-2 text-black text-2xl w-full rounded-2xl"
                    style={{
                      backgroundColor: darkenHexColor(
                        colors[editingCardIndex! % colors.length],
                        0.2
                      ),
                    }}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex justify-center gap-2">
                <button
                  onClick={saveEdits}
                  className="w-11 h-11 bg-white text-xl text-black font-semibold rounded-xl hover:bg-gray-400"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal para confirmação */}
        {isConfirmModalOpen && (
          <div className="fixed inset-0 backdrop-blur-xs flex flex-col gap-3 items-center justify-center z-50 p-12">
            <div className="flex w-full justify-end">
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="w-11 h-11 text-xl text-black font-semibold rounded-xl bg-white"
              >
                X
              </button>
            </div>
            <div className="bg-red-400 p-6 rounded-lg shadow-lg w-full">
              <div className="bg-red-500 rounded-2xl p-2">
                <h2 className="text-xl text-center ">
                  Você tem certeza que deseja apagar todos os cards?
                </h2>
              </div>
              <div className="flex justify-center gap-2 mt-4">
                <button
                  onClick={removeAllCards}
                  className="w-11 h-11 text-xl text-black font-semibold rounded-xl bg-white"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
