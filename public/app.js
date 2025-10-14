// Show notification
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Load all users and populate dropdowns
async function loadUsers() {
    try {
        const response = await fetch('/api/users');
        const data = await response.json();
        
        if (data.users) {
            // Update users list
            const usersContainer = document.getElementById('users-container');
            usersContainer.innerHTML = '';
            
            data.users.forEach(user => {
                const userCard = document.createElement('div');
                userCard.className = 'user-card';
                
                const avatarHTML = user.profile_image 
                    ? `<img src="${user.profile_image}" alt="${user.username}">`
                    : `<div class="placeholder-avatar">${user.username.charAt(0).toUpperCase()}</div>`;
                
                userCard.innerHTML = `
                    ${avatarHTML}
                    <div class="user-info">
                        <strong>${user.username}</strong>
                        <small>ID: ${user.id}</small>
                        <small>Joined: ${new Date(user.created_at).toLocaleDateString()}</small>
                    </div>
                `;
                usersContainer.appendChild(userCard);
            });
            
            // Update dropdowns
            updateUserDropdowns(data.users);
        }
    } catch (error) {
        showNotification('Error loading users: ' + error.message, 'error');
    }
}

// Update all user dropdowns
function updateUserDropdowns(users) {
    const userSelect = document.getElementById('user-select');
    const senderSelect = document.getElementById('sender-select');
    const receiverSelect = document.getElementById('receiver-select');
    
    [userSelect, senderSelect, receiverSelect].forEach(select => {
        const currentValue = select.value;
        select.innerHTML = '<option value="">Select a user...</option>';
        
        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.id;
            option.textContent = `${user.username} (ID: ${user.id})`;
            select.appendChild(option);
        });
        
        select.value = currentValue;
    });
}

// Create a new user
async function createUser() {
    const username = document.getElementById('new-username').value.trim();
    
    if (!username) {
        showNotification('Please enter a username', 'error');
        return;
    }
    
    try {
        const response = await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showNotification(`User "${username}" created successfully!`, 'success');
            document.getElementById('new-username').value = '';
            loadUsers();
        } else {
            showNotification(data.error || 'Error creating user', 'error');
        }
    } catch (error) {
        showNotification('Error creating user: ' + error.message, 'error');
    }
}

// Upload profile image
async function uploadProfileImage() {
    const userId = document.getElementById('user-select').value;
    const fileInput = document.getElementById('profile-image');
    const file = fileInput.files[0];
    
    if (!userId) {
        showNotification('Please select a user', 'error');
        return;
    }
    
    if (!file) {
        showNotification('Please select an image file', 'error');
        return;
    }
    
    const formData = new FormData();
    formData.append('profileImage', file);
    
    try {
        const response = await fetch(`/api/users/${userId}/upload-image`, {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showNotification('Profile image uploaded successfully!', 'success');
            fileInput.value = '';
            loadUsers();
        } else {
            showNotification(data.error || 'Error uploading image', 'error');
        }
    } catch (error) {
        showNotification('Error uploading image: ' + error.message, 'error');
    }
}

// Send a message
async function sendMessage() {
    const senderId = document.getElementById('sender-select').value;
    const receiverId = document.getElementById('receiver-select').value;
    const messageText = document.getElementById('message-text').value.trim();
    
    if (!senderId || !receiverId) {
        showNotification('Please select both sender and receiver', 'error');
        return;
    }
    
    if (senderId === receiverId) {
        showNotification('Sender and receiver cannot be the same', 'error');
        return;
    }
    
    if (!messageText) {
        showNotification('Please enter a message', 'error');
        return;
    }
    
    try {
        const response = await fetch('/api/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sender_id: senderId,
                receiver_id: receiverId,
                message: messageText
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showNotification('Message sent successfully!', 'success');
            document.getElementById('message-text').value = '';
            loadMessages();
        } else {
            showNotification(data.error || 'Error sending message', 'error');
        }
    } catch (error) {
        showNotification('Error sending message: ' + error.message, 'error');
    }
}

// Load messages between two users
async function loadMessages() {
    const userId1 = document.getElementById('sender-select').value;
    const userId2 = document.getElementById('receiver-select').value;
    
    if (!userId1 || !userId2) {
        showNotification('Please select both users to view conversation', 'error');
        return;
    }
    
    try {
        const response = await fetch(`/api/messages/${userId1}/${userId2}`);
        const data = await response.json();
        
        const messagesContainer = document.getElementById('messages-container');
        messagesContainer.innerHTML = '';
        
        if (data.messages && data.messages.length > 0) {
            data.messages.forEach(msg => {
                const messageDiv = document.createElement('div');
                messageDiv.className = 'message';
                
                const avatarHTML = msg.sender_image 
                    ? `<img src="${msg.sender_image}" alt="${msg.sender_username}">`
                    : `<div class="placeholder-avatar-small">${msg.sender_username.charAt(0).toUpperCase()}</div>`;
                
                messageDiv.innerHTML = `
                    <div class="message-header">
                        ${avatarHTML}
                        <span class="message-sender">${msg.sender_username}</span>
                        <span style="color: #999;">→</span>
                        <span style="color: #666;">${msg.receiver_username}</span>
                    </div>
                    <div class="message-text">${msg.message}</div>
                    <div class="message-time">${new Date(msg.created_at).toLocaleString()}</div>
                `;
                messagesContainer.appendChild(messageDiv);
            });
        } else {
            messagesContainer.innerHTML = '<p style="color: #999; text-align: center; padding: 20px;">No messages yet</p>';
        }
    } catch (error) {
        showNotification('Error loading messages: ' + error.message, 'error');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadUsers();
    
    // Add enter key support for username input
    document.getElementById('new-username').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            createUser();
        }
    });
    
    // Add enter key support for message textarea (with Shift+Enter for new line)
    document.getElementById('message-text').addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
});
