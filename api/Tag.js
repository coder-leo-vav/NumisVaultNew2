// JavaScript Example: Reading Entities
// Filterable fields: name, color
async function fetchTagEntities() {
    const response = await fetch(`https://app.base44.com/api/apps/6979c67072406431bb978653/entities/Tag`, {
        headers: {
            'api_key': 'ae69e1521ecc4957ae64787f750505b5', // or use await User.me() to get the API key
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    console.log(data);
}

// JavaScript Example: Updating an Entity
// Filterable fields: name, color
async function updateTagEntity(entityId, updateData) {
    const response = await fetch(`https://app.base44.com/api/apps/6979c67072406431bb978653/entities/Tag/${entityId}`, {
        method: 'PUT',
        headers: {
            'api_key': 'ae69e1521ecc4957ae64787f750505b5', // or use await User.me() to get the API key
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
    });
    const data = await response.json();
    console.log(data);
}