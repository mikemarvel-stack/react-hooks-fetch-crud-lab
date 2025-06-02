import React, { useState, useEffect } from "react";
import QuestionForm from "./QuestionForm";
import QuestionList from "./QuestionList";

function App() {
  const [questions, setQuestions] = useState([]);
  const [viewQuestions, setViewQuestions] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    fetch("http://localhost:4000/questions", { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => setQuestions(data))
      .catch((error) => {
        if (error.name !== "AbortError") {
          console.error("Failed to fetch questions:", error);
        }
      });

    return () => controller.abort();
  }, []);

  function handleAddQuestion(newQuestion) {
    setQuestions((prev) => [...prev, newQuestion]);
  }

  function handleDeleteQuestion(deletedId) {
    setQuestions((prev) => prev.filter((q) => q.id !== deletedId));
  }

  function handleUpdateCorrectAnswer(updatedQuestion) {
    setQuestions((prev) =>
      prev.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q))
    );
  }

  return (
    <main>
      <h1>QuizMaster Admin Panel</h1>
      <button onClick={() => setViewQuestions(!viewQuestions)}>
        View Questions
      </button>

      <section>
        <h2>New Question</h2>
        <QuestionForm onAddQuestion={handleAddQuestion} />
      </section>

      {viewQuestions && (
        <section>
          <h2>Questions</h2>
          <QuestionList
            questions={questions}
            onDeleteQuestion={handleDeleteQuestion}
            onUpdateCorrectAnswer={handleUpdateCorrectAnswer}
          />
        </section>
      )}
    </main>
  );
}

export default App;
