document.getElementById('profileForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const links = document.getElementById('links').value;

  try {
    const response = await fetch('/api/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, links: JSON.parse(links) })
    });

    const result = await response.text();
    alert(result);
  } catch (error) {
    console.error('Error:', error);
    alert('Error saving profile');
  }
});
