import CharacterCreator from "./components/CharacterCreator";

export default function HomePage() {
  return (
    <div>
      <h1
        style={{
          textAlign: "center",
          marginBottom: "2rem",
          fontSize: "2.5rem",
        }}
      >
        Create Your Buddy!
      </h1>
      <CharacterCreator />
    </div>
  );
}
