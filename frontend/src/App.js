import React from 'react';

function App() {
  const addItem = async () => {
    console.log("HEYYY")
    try {
      const response = await fetch('/api/addItem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
      } else {
        throw new Error('Failed to add item');
      }
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  return (
    <div>
      <h1>Airbnb-like App</h1>
      <button onClick={addItem}>Add Random Item</button>
    </div>
  );
}

export default App;
