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
    active: true,
  };
};

const Game = () => {
  const [cards, setCards] = useState([generateCard(), generateCard()]);
  const [hearts, setHearts] = useState(999);

  // This useEffect handles global keydown events for number inputs
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key >= "0" && event.key <= "9") {
        // Filter for number keys
        let newInput = event.key;
        let anyMatchFound = false;
        let anyCompleteMatch = false;

        // Map over cards to check for matches
        const newCards = cards.map((card) => {
          if (card.active && card.answer.startsWith(card.typed + newInput)) {
            anyMatchFound = true; // Flag that at least one card matches
            let updatedTyped = card.typed + newInput;
            if (updatedTyped === card.answer) {
              // Check if the full answer is correct
              anyCompleteMatch = true;
              return generateCard(); // Generate a new card if answer is fully correct
            }
            return { ...card, typed: updatedTyped }; // Update typed for partial matches
          }
          return card; // No changes if no match
        });

        if (!anyMatchFound) {
          // If no matches were found for this keystroke
          setHearts((hearts) => Math.max(0, hearts - 1)); // Deduct a heart
        } else {
          setCards(newCards); // Update cards with new typed values or replaced cards
        }

        if (anyCompleteMatch) {
          // Reset only if a complete match was found
          setCards((cards) =>
            cards.map((card) => ({
              ...card,
              typed: "",
              active: card.answer.startsWith(""), // All cards are active at start
            }))
          );
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cards]);

  // Timer effect for each card
  useEffect(() => {
    const intervalIds = cards.map((card, index) => {
      const intervalId = setInterval(() => {
        setCards((prevCards) => {
          const newCards = [...prevCards];
          if (newCards[index].time > 0) {
            newCards[index].time -= 1;
          } else {
            clearInterval(intervalId);
            newCards[index] = { ...generateCard(), typed: "", active: true }; // Replace with new card
            setHearts((hearts) => Math.max(0, hearts - 1)); // Lose a heart if time runs out
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
      {cards.map((card) => (
        <div
          key={card.id}
          style={{
            margin: "10px",
            padding: "20px",
            border: "1px solid black",
            minWidth: "100px",
            textAlign: "center",
            position: "relative",
            backgroundColor: card.active ? "lightgreen" : "lightgrey",
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
              width: `${(card.time / 30) * 100}%`,
            }}
          ></div>
        </div>
      ))}
    </div>
  );
};

export default Game;
