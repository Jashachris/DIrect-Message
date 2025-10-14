let token = localStorage.getItem('token');
let currentUser = null;
let selectedUserId = null;
let messageInterval = null;

const API_URL = window.location.origin + '/api';

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    if (token) {
        checkAuth();
    }
});

// Auth functions
function showLogin() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('login-tab').classList.add('active');
    document.getElementById('register-tab').classList.remove('active');
    document.getElementById('auth-error').textContent = '';
}

function showRegister() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
    document.getElementById('login-tab').classList.remove('active');
    document.getElementById('register-tab').classList.add('active');
    document.getElementById('auth-error').textContent = '';
}

async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            token = data.token;
            localStorage.setItem('token', token);
            currentUser = data.user;
            showMessagingSection();
        } else {
            document.getElementById('auth-error').textContent = data.error || 'Login failed';
        }
    } catch (error) {
        document.getElementById('auth-error').textContent = 'Network error';
    }
}

async function handleRegister(event) {
    event.preventDefault();
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            token = data.token;
            localStorage.setItem('token', token);
            currentUser = data.user;
            showMessagingSection();
        } else {
            document.getElementById('auth-error').textContent = data.error || 'Registration failed';
        }
    } catch (error) {
        document.getElementById('auth-error').textContent = 'Network error';
    }
}

async function checkAuth() {
    try {
        const response = await fetch(`${API_URL}/auth/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            const data = await response.json();
            currentUser = data.user;
            showMessagingSection();
        } else {
            handleLogout();
        }
    } catch (error) {
        handleLogout();
    }
}

function handleLogout() {
    token = null;
    currentUser = null;
    selectedUserId = null;
    localStorage.removeItem('token');
    if (messageInterval) {
        clearInterval(messageInterval);
    }
    document.getElementById('auth-section').style.display = 'block';
    document.getElementById('message-section').style.display = 'none';
}

// Messaging functions
async function showMessagingSection() {
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('message-section').style.display = 'block';
    document.getElementById('username').textContent = currentUser.username;
    
    await loadUsers();
    
    // Auto-refresh messages every 3 seconds
    if (messageInterval) {
        clearInterval(messageInterval);
    }
    messageInterval = setInterval(() => {
        if (selectedUserId) {
            loadConversation(selectedUserId);
        }
    }, 3000);
}

async function loadUsers() {
    try {
        const response = await fetch(`${API_URL}/messages/users`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            const data = await response.json();
            displayUsers(data.users);
        }
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

function displayUsers(users) {
    const usersList = document.getElementById('users-list');
    usersList.innerHTML = '';
    
    users.forEach(user => {
        const userDiv = document.createElement('div');
        userDiv.className = 'user-item';
        userDiv.textContent = user.username;
        userDiv.onclick = () => selectUser(user);
        
        if (selectedUserId === user.id) {
            userDiv.classList.add('active');
        }
        
        usersList.appendChild(userDiv);
    });
}

function selectUser(user) {
    selectedUserId = user.id;
    document.getElementById('chat-with').textContent = `Chat with ${user.username}`;
    document.getElementById('message-content').disabled = false;
    document.getElementById('send-btn').disabled = false;
    
    // Update user list active state
    const userItems = document.querySelectorAll('.user-item');
    userItems.forEach(item => {
        item.classList.remove('active');
        if (item.textContent === user.username) {
            item.classList.add('active');
        }
    });
    
    loadConversation(selectedUserId);
}

async function loadConversation(userId) {
    try {
        const response = await fetch(`${API_URL}/messages/conversation/${userId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            const data = await response.json();
            displayMessages(data.messages);
        }
    } catch (error) {
        console.error('Error loading conversation:', error);
    }
}

function displayMessages(messages) {
    const container = document.getElementById('messages-container');
    const wasScrolledToBottom = container.scrollHeight - container.scrollTop === container.clientHeight;
    
    container.innerHTML = '';
    
    messages.forEach(msg => {
        const messageDiv = document.createElement('div');
        const isSent = msg.sender.id === currentUser.id || msg.sender._id === currentUser.id;
        messageDiv.className = `message ${isSent ? 'sent' : 'received'}`;
        
        const contentDiv = document.createElement('div');
        contentDiv.textContent = msg.content;
        
        const timeDiv = document.createElement('div');
        timeDiv.className = 'message-time';
        timeDiv.textContent = new Date(msg.createdAt).toLocaleString();
        
        messageDiv.appendChild(contentDiv);
        messageDiv.appendChild(timeDiv);
        container.appendChild(messageDiv);
    });
    
    // Auto-scroll to bottom if was already at bottom or first load
    if (wasScrolledToBottom || messages.length > 0) {
        container.scrollTop = container.scrollHeight;
    }
}

async function sendMessage() {
    if (!selectedUserId) return;
    
    const content = document.getElementById('message-content').value.trim();
    if (!content) return;
    
    try {
        const response = await fetch(`${API_URL}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                recipientId: selectedUserId,
                content
            })
        });
        
        if (response.ok) {
            document.getElementById('message-content').value = '';
            loadConversation(selectedUserId);
        } else {
            const data = await response.json();
            document.getElementById('message-error').textContent = data.error || 'Failed to send message';
        }
    } catch (error) {
        document.getElementById('message-error').textContent = 'Network error';
    }
}

// Allow sending message with Enter key
document.addEventListener('keypress', (event) => {
    if (event.key === 'Enter' && document.getElementById('message-content') === document.activeElement) {
        sendMessage();
    }
});
