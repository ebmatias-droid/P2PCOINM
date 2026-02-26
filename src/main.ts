import './style.css'
import { getOrCreateUserId } from './user'
import { fetchPosts, renderPost } from './components/PostsFeed'
import { createPost, renderPostCreator, type PostData } from './components/PostCreator'
import { fetchMessages, sendMessage, renderDMModal, renderMessage } from './components/DMModal'

let currentDMPostId: string | null = null
let currentDMAuthorId: string | null = null
let dmInterval: number | null = null

async function init() {
  getOrCreateUserId()
  const app = document.querySelector<HTMLDivElement>('#app')!

  app.innerHTML = `
    <div class="container">
      <header class="header">
        <h1 class="logo">₿ P2PCoin</h1>
        <p class="tagline">Anonymous social sharing</p>
      </header>

      ${renderPostCreator()}

      <div class="posts-container" id="posts-container">
        <div class="loading">Loading posts...</div>
      </div>
    </div>
  `

  setupPostCreator()
  await loadPosts()

  setInterval(loadPosts, 10000)
}

function setupPostCreator() {
  const titleInput = document.getElementById('post-title') as HTMLInputElement
  const bodyInput = document.getElementById('post-body') as HTMLTextAreaElement
  const amountInput = document.getElementById('post-amount') as HTMLInputElement
  const contactInput = document.getElementById('post-contact') as HTMLInputElement
  const postButton = document.getElementById('post-button') as HTMLButtonElement

  postButton.addEventListener('click', async () => {
    const title = titleInput.value.trim()
    const body = bodyInput.value.trim()
    const amount = amountInput.value ? parseFloat(amountInput.value) : null
    const contact = contactInput.value.trim()

    if (!title || !body) {
      alert('Please fill in title and body')
      return
    }

    postButton.disabled = true
    postButton.textContent = 'Posting...'

    const postData: PostData = {
      title,
      body,
      crypto_amount: amount,
      contact_info: contact || null
    }

    const success = await createPost(postData)

    if (success) {
      titleInput.value = ''
      bodyInput.value = ''
      amountInput.value = ''
      contactInput.value = ''
      await loadPosts()
    } else {
      alert('Failed to create post. Please try again.')
    }

    postButton.textContent = 'Post'
    postButton.disabled = false
  })
}

async function loadPosts() {
  const userId = getOrCreateUserId()
  const posts = await fetchPosts()
  const container = document.getElementById('posts-container')!

  if (posts.length === 0) {
    container.innerHTML = '<div class="no-posts">No posts yet. Be the first to share something!</div>'
    return
  }

  container.innerHTML = posts.map(post => renderPost(post, userId)).join('')

  document.querySelectorAll('.contact-button').forEach(button => {
    button.addEventListener('click', (e) => {
      const target = e.target as HTMLButtonElement
      const postId = target.dataset.postId!
      const authorId = target.dataset.authorId!
      openDMModal(postId, authorId)
    })
  })
}

function openDMModal(postId: string, authorId: string) {
  currentDMPostId = postId
  currentDMAuthorId = authorId

  const existingModal = document.getElementById('dm-modal')
  if (existingModal) {
    existingModal.remove()
  }

  document.body.insertAdjacentHTML('beforeend', renderDMModal())

  const modal = document.getElementById('dm-modal')!
  const closeButton = document.getElementById('close-modal')!
  const sendButton = document.getElementById('send-dm-button')!
  const dmInput = document.getElementById('dm-input') as HTMLInputElement

  closeButton.addEventListener('click', closeDMModal)
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeDMModal()
    }
  })

  sendButton.addEventListener('click', () => sendDM())
  dmInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendDM()
    }
  })

  loadMessages()
  dmInterval = setInterval(loadMessages, 3000) as unknown as number
}

function closeDMModal() {
  const modal = document.getElementById('dm-modal')
  if (modal) {
    modal.remove()
  }
  if (dmInterval) {
    clearInterval(dmInterval)
    dmInterval = null
  }
  currentDMPostId = null
  currentDMAuthorId = null
}

async function loadMessages() {
  if (!currentDMPostId || !currentDMAuthorId) return

  const userId = getOrCreateUserId()
  const messages = await fetchMessages(currentDMPostId, currentDMAuthorId)
  const container = document.getElementById('dm-messages')!

  if (messages.length === 0) {
    container.innerHTML = '<div class="no-messages">No messages yet. Start the conversation!</div>'
    return
  }

  const scrollAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 50

  container.innerHTML = messages.map(msg => renderMessage(msg, userId)).join('')

  if (scrollAtBottom || messages.length === 1) {
    container.scrollTop = container.scrollHeight
  }
}

async function sendDM() {
  if (!currentDMPostId || !currentDMAuthorId) return

  const dmInput = document.getElementById('dm-input') as HTMLInputElement
  const content = dmInput.value.trim()
  if (!content) return

  const sendButton = document.getElementById('send-dm-button') as HTMLButtonElement
  sendButton.disabled = true

  const success = await sendMessage(currentDMPostId, currentDMAuthorId, content)

  if (success) {
    dmInput.value = ''
    await loadMessages()
  } else {
    alert('Failed to send message. Please try again.')
  }

  sendButton.disabled = false
  dmInput.focus()
}

init()
