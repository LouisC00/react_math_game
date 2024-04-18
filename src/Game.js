import React, { useState, useEffect } from "react";

const generateCard = () => {
  const num1 = Math.floor(Math.random() * 20) + 10;
  const num2 = Math.floor(Math.random() * 20) + 10;
  return {
    id: Math.random(),
    question: `${num1} + ${num2}`,
    answer: `${num1 + num2}`,
    time: 300,
    typed: "",
  };
};

const Game = () => {
  const [cards, setCards] = useState(Array.from({ length: 9 }, generateCard));
  const [hearts, setHearts] = useState(999);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key >= "0" && event.key <= "9") {
        let newInput = event.key;
        let anyMatchFound = false;
        let anyCompleteMatch = false;
        let matches = [];

        const newCards = cards.map((card) => {
          if (card.answer.startsWith(card.typed + newInput)) {
            anyMatchFound = true;
            let updatedTyped = card.typed + newInput;
            if (updatedTyped === card.answer) {
              anyCompleteMatch = true;
              return generateCard();
            }
            matches.push(card.id);
            return { ...card, typed: updatedTyped };
          }
          return card;
        });

        if (!anyMatchFound) {
          setHearts((hearts) => Math.max(0, hearts - 1));
          newCards.forEach((card) => (card.typed = "")); // Reset typed if no matches
        } else {
          setCards(newCards);
        }

        if (anyCompleteMatch || matches.length === 0) {
          setCards((cards) =>
            cards.map((card) => ({
              ...card,
              typed: "",
            }))
          );
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cards]);

  useEffect(() => {
    const intervalIds = cards.map((card, index) => {
      const intervalId = setInterval(() => {
        setCards((prevCards) => {
          const newCards = [...prevCards];
          if (newCards[index].time > 0) {
            newCards[index].time -= 1;
          } else {
            clearInterval(intervalId);
            newCards[index] = generateCard();
            setHearts((hearts) => Math.max(0, hearts - 1));
          }
          return newCards;
        });
      }, 1000);
      return intervalId;
    });

    return () => intervalIds.forEach((intervalId) => clearInterval(intervalId));
  }, [cards]);

  return (
    <div>
      <div>Hearts: {hearts}</div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "10px",
        }}
      >
        {cards.map((card) => (
          <div
            key={card.id}
            style={{
              padding: "20px",
              border: "1px solid black",
              textAlign: "center",
              backgroundColor: "white", // Neutral color since active color change is not needed
              position: "relative",
            }}
          >
            <div>{card.question}</div>
            <div>Typed: {card.typed}</div>
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "10px",
                backgroundColor: "red",
                width: `${(card.time / 300) * 100}%`,
              }}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Game;
