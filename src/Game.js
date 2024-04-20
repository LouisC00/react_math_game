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
  const [typedCardIds, setTypedCardIds] = useState([]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key >= "0" && event.key <= "9") {
        let newInput = event.key;
        let matches = [];
        let correctInput = false;

        const newCards = cards.map((card) => {
          if (
            (typedCardIds.length === 0 || typedCardIds.includes(card.id)) &&
            card.answer.startsWith(card.typed + newInput)
          ) {
            let updatedTyped = card.typed + newInput;
            correctInput = true;
            if (updatedTyped === card.answer) {
              return generateCard(); // Generates a new card
            }
            matches.push(card.id); // Track card as matched
            return { ...card, typed: updatedTyped };
          }
          return card;
        });

        if (!correctInput) {
          // Reduce hearts only if no correct input
          setHearts((hearts) => Math.max(0, hearts - 1));
          // Reset the typing on all cards
          const resetCards = newCards.map((card) => ({ ...card, typed: "" }));
          // Check for any potential matches with new input among reset cards
          const finalCards = resetCards.map((card) => {
            if (card.typed === "" && card.answer.startsWith(newInput)) {
              return { ...card, typed: newInput };
            }
            return card;
          });
          setCards(finalCards);
        } else {
          setCards(newCards); // Update cards state with correct input
        }

        setTypedCardIds(matches); // Update which cards are being typed
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cards, typedCardIds, hearts]);

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
